/**
 * SkillMatch skill engine: dictionary, extraction, normalization and matching.
 * Pure TypeScript with no server or browser dependencies so it can be unit tested.
 */

export type SkillCategory =
  | "Programming Languages"
  | "Web Technologies"
  | "Databases"
  | "Frameworks"
  | "Data & AI"
  | "Tools & Practices";

interface Alias {
  /** Text to find. Spaces match any run of spaces or hyphens. */
  text: string;
  /** Match against the original casing (for ambiguous short names such as "C" or "AI"). */
  caseSensitive?: boolean;
}

export interface SkillDefinition {
  name: string;
  category: SkillCategory;
  aliases: (string | Alias)[];
  /** Skills that knowing this one also demonstrates (e.g. MySQL implies SQL). */
  implies?: string[];
}

const cs = (text: string): Alias => ({ text, caseSensitive: true });

export const SKILL_DICTIONARY: SkillDefinition[] = [
  // Programming languages
  { name: "Python", category: "Programming Languages", aliases: ["python", "python3"] },
  { name: "Java", category: "Programming Languages", aliases: ["java", "core java", "java se"] },
  { name: "C", category: "Programming Languages", aliases: [cs("C"), "c language", "c programming"] },
  { name: "C++", category: "Programming Languages", aliases: ["c++", "cpp", "c plus plus"] },
  { name: "C#", category: "Programming Languages", aliases: ["c#", "c sharp", "csharp"] },
  { name: "JavaScript", category: "Programming Languages", aliases: ["javascript", "java script", cs("JS"), "es6", "ecmascript"] },
  { name: "TypeScript", category: "Programming Languages", aliases: ["typescript", cs("TS")] },
  { name: "PHP", category: "Programming Languages", aliases: ["php"] },
  { name: "Go", category: "Programming Languages", aliases: ["golang", "go lang"] },
  { name: "Kotlin", category: "Programming Languages", aliases: ["kotlin"] },
  { name: "Swift", category: "Programming Languages", aliases: [cs("Swift")] },

  // Web technologies
  { name: "HTML", category: "Web Technologies", aliases: ["html", "html5"] },
  { name: "CSS", category: "Web Technologies", aliases: ["css", "css3"] },
  { name: "Bootstrap", category: "Web Technologies", aliases: ["bootstrap"] },
  { name: "Tailwind CSS", category: "Web Technologies", aliases: ["tailwind", "tailwindcss", "tailwind css"], implies: ["CSS"] },
  { name: "React", category: "Web Technologies", aliases: ["react", "react.js", "reactjs", "react js"], implies: ["JavaScript"] },
  { name: "Angular", category: "Web Technologies", aliases: ["angular", "angularjs", "angular.js"] },
  { name: "Vue.js", category: "Web Technologies", aliases: ["vue", "vue.js", "vuejs"] },
  { name: "jQuery", category: "Web Technologies", aliases: ["jquery"] },
  { name: "REST API", category: "Web Technologies", aliases: ["rest api", "rest apis", "restful", "restful api", "restful apis"] },

  // Databases
  { name: "SQL", category: "Databases", aliases: ["sql", "structured query language"] },
  { name: "MySQL", category: "Databases", aliases: ["mysql", "my sql"], implies: ["SQL"] },
  { name: "PostgreSQL", category: "Databases", aliases: ["postgresql", "postgres", "postgre sql"], implies: ["SQL"] },
  { name: "SQLite", category: "Databases", aliases: ["sqlite", "sqlite3"], implies: ["SQL"] },
  { name: "MongoDB", category: "Databases", aliases: ["mongodb", "mongo db", "mongo"] },

  // Frameworks
  { name: "Flask", category: "Frameworks", aliases: ["flask"] },
  { name: "Django", category: "Frameworks", aliases: ["django"] },
  { name: "FastAPI", category: "Frameworks", aliases: ["fastapi", "fast api"] },
  { name: "Node.js", category: "Frameworks", aliases: ["node.js", "nodejs", "node js"] },
  { name: "Express.js", category: "Frameworks", aliases: ["express.js", "expressjs"] },
  { name: "Spring Boot", category: "Frameworks", aliases: ["spring boot", "springboot"] },

  // Data & AI
  { name: "Machine Learning", category: "Data & AI", aliases: ["machine learning", cs("ML")] },
  { name: "Deep Learning", category: "Data & AI", aliases: ["deep learning"] },
  { name: "Artificial Intelligence", category: "Data & AI", aliases: ["artificial intelligence", cs("AI")] },
  { name: "Natural Language Processing", category: "Data & AI", aliases: ["natural language processing", cs("NLP"), "nlp"] },
  { name: "Data Analysis", category: "Data & AI", aliases: ["data analysis", "data analytics", "data analyst"] },
  { name: "Data Visualization", category: "Data & AI", aliases: ["data visualization", "data visualisation", "matplotlib", "seaborn"] },
  { name: "Statistics", category: "Data & AI", aliases: ["statistics", "statistical analysis", "statistical modeling", "statistical modelling"] },
  { name: "NumPy", category: "Data & AI", aliases: ["numpy"] },
  { name: "Pandas", category: "Data & AI", aliases: ["pandas"] },
  { name: "Scikit-learn", category: "Data & AI", aliases: ["scikit-learn", "scikit learn", "sklearn"] },
  { name: "TensorFlow", category: "Data & AI", aliases: ["tensorflow"] },
  { name: "PyTorch", category: "Data & AI", aliases: ["pytorch"] },
  { name: "Excel", category: "Data & AI", aliases: [cs("Excel"), "ms excel", "microsoft excel", "advanced excel"] },
  { name: "Power BI", category: "Data & AI", aliases: ["power bi", "powerbi"], implies: ["Data Visualization"] },
  { name: "Tableau", category: "Data & AI", aliases: ["tableau"], implies: ["Data Visualization"] },

  // Tools & practices
  { name: "Git", category: "Tools & Practices", aliases: ["git"] },
  { name: "GitHub", category: "Tools & Practices", aliases: ["github"], implies: ["Git"] },
  { name: "Docker", category: "Tools & Practices", aliases: ["docker"] },
  { name: "Linux", category: "Tools & Practices", aliases: ["linux", "ubuntu"] },
  { name: "AWS", category: "Tools & Practices", aliases: [cs("AWS"), "amazon web services"] },
  { name: "Data Structures", category: "Tools & Practices", aliases: ["data structures", "data structure", cs("DSA"), "data structures and algorithms"] },
  { name: "Object-Oriented Programming", category: "Tools & Practices", aliases: ["object oriented programming", "object oriented", cs("OOP"), cs("OOPS"), cs("OOPs"), "oops concepts"] },
];

const SKILL_BY_KEY = new Map(SKILL_DICTIONARY.map((s) => [s.name.toLowerCase(), s]));
const ALIAS_TO_NAME = new Map<string, string>();
for (const skill of SKILL_DICTIONARY) {
  ALIAS_TO_NAME.set(skill.name.toLowerCase(), skill.name);
  for (const a of skill.aliases) {
    const text = typeof a === "string" ? a : a.text;
    ALIAS_TO_NAME.set(text.toLowerCase().replace(/[\s-]+/g, " "), skill.name);
  }
}

/** Characters that make up a skill "word". Includes + # . so C never matches inside C++, C# or Node.js. */
const WORD_CHAR = "A-Za-z0-9+#";

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function aliasPattern(alias: Alias): RegExp {
  const body = alias.text
    .trim()
    .split(/[\s-]+/)
    .map(escapeRegex)
    .join("[\\s\\-]+");
  // Word boundary: not preceded/followed by a skill-word character. A trailing "." is allowed
  // after the match (end of sentence) but a "." directly before is not (so ".js" stays inside "node.js").
  return new RegExp(`(?<![${WORD_CHAR}.])${body}(?![${WORD_CHAR}]|\\.[A-Za-z])`, alias.caseSensitive ? "g" : "gi");
}

const COMPILED = SKILL_DICTIONARY.map((skill) => ({
  name: skill.name,
  patterns: skill.aliases.map((a) => aliasPattern(typeof a === "string" ? { text: a } : a)),
}));

/** Text preprocessing (tokenizer-style cleanup): unify dashes, quotes and whitespace. */
export function preprocessText(text: string): string {
  return text
    .replace(/[\u2010-\u2015\u2212]/g, "-")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\u00A0/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\r\n?/g, "\n");
}

/** Find every dictionary skill mentioned in the resume text. Returns unique canonical names in dictionary order. */
export function extractSkills(text: string): string[] {
  const clean = preprocessText(text);
  const found: string[] = [];
  for (const { name, patterns } of COMPILED) {
    if (patterns.some((p) => { p.lastIndex = 0; return p.test(clean); })) found.push(name);
  }
  return found;
}

/** Map any alias or casing to the canonical skill name; unknown skills are trimmed and kept. */
export function normalizeSkill(skill: string): string {
  const key = skill.trim().toLowerCase().replace(/[\s-]+/g, " ");
  return ALIAS_TO_NAME.get(key) ?? skill.trim();
}

/** Unique canonical skills plus any skills they imply (MySQL → SQL). */
export function expandSkills(skills: string[]): Set<string> {
  const out = new Set<string>();
  for (const raw of skills) {
    const name = normalizeSkill(raw);
    out.add(name);
    for (const implied of SKILL_BY_KEY.get(name.toLowerCase())?.implies ?? []) out.add(implied);
  }
  return out;
}

export function skillCategory(name: string): SkillCategory | null {
  return SKILL_BY_KEY.get(name.toLowerCase())?.category ?? null;
}

export interface MatchResult {
  matched: string[];
  missing: string[];
  totalRequired: number;
  /** null when the job has no required skills configured. */
  percentage: number | null;
}

/** Match % = matched required skills / total required skills × 100, on unique normalized names. */
export function matchSkills(candidateSkills: string[], requiredSkills: string[]): MatchResult {
  const have = new Set([...expandSkills(candidateSkills)].map((s) => s.toLowerCase()));
  const required = [...new Set(requiredSkills.map(normalizeSkill))];
  const matched = required.filter((s) => have.has(s.toLowerCase()));
  const missing = required.filter((s) => !have.has(s.toLowerCase()));
  const percentage =
    required.length === 0 ? null : Math.round((matched.length / required.length) * 1000) / 10;
  return { matched, missing, totalRequired: required.length, percentage };
}

export interface JobLike {
  id: string;
  title: string;
  required_skills: string[];
}

export interface RankedJob<J extends JobLike> extends MatchResult {
  job: J;
}

/** Score every job and sort highest match first (ties: fewer missing skills, then title). */
export function rankJobs<J extends JobLike>(candidateSkills: string[], jobs: J[]): RankedJob<J>[] {
  return jobs
    .map((job) => ({ job, ...matchSkills(candidateSkills, job.required_skills) }))
    .sort(
      (a, b) =>
        (b.percentage ?? -1) - (a.percentage ?? -1) ||
        a.missing.length - b.missing.length ||
        a.job.title.localeCompare(b.job.title),
    );
}

const DEGREE_RE =
  /\b(B\.?\s?Tech|M\.?\s?Tech|B\.?\s?E\.?|M\.?\s?E\.?|B\.?\s?Sc|M\.?\s?Sc|BCA|MCA|MBA|BBA|B\.?\s?Com|M\.?\s?Com|Ph\.?\s?D|Bachelor(?:'s)?|Master(?:'s)?|Diploma|Associate Degree)\b[^\n]{0,90}/i;

function labelled(text: string, labels: string[]): string | null {
  for (const label of labels) {
    const m = new RegExp(`^\\s*${label}\\s*[:\\-–]\\s*(.+)$`, "im").exec(text);
    const value = m?.[1]?.trim();
    if (value) return value.slice(0, 120);
  }
  return null;
}

/** Best-effort education and experience lines from resume text. */
export function extractCandidateDetails(text: string): { education: string | null; experience: string | null } {
  const clean = preprocessText(text);
  const education =
    labelled(clean, ["education", "qualification", "qualifications"]) ??
    DEGREE_RE.exec(clean)?.[0]?.trim().replace(/\s+/g, " ").slice(0, 120) ??
    null;

  let experience = labelled(clean, ["experience", "work experience", "total experience"]);
  if (!experience) {
    const years = /(\d+(?:\.\d+)?)\s*\+?\s*(?:years?|yrs?)\s+(?:of\s+)?(?:professional\s+|work\s+|industry\s+)?experience/i.exec(clean);
    if (years) experience = `${years[1]} years`;
    else if (/\bfresher\b/i.test(clean)) experience = "Fresher";
  }
  return { education, experience };
}

export interface ReportJob extends JobLike {
  company: string | null;
}

/** Plain-language final recommendation built only from the actual analysis results. */
export function buildRecommendation(input: {
  skills: string[];
  selected: { title: string; result: MatchResult } | null;
  ranked: RankedJob<ReportJob>[];
}): { summary: string[]; suggestedRoles: string[]; learningAreas: string[] } {
  const { skills, selected, ranked } = input;
  const summary: string[] = [];

  if (skills.length === 0) {
    summary.push(
      "No recognised technical skills were found in this resume. Add a clear Skills section listing the tools and technologies you know.",
    );
  } else {
    const shown = skills.slice(0, 6);
    const rest = skills.length - shown.length;
    const list = shown.length > 1 ? `${shown.slice(0, -1).join(", ")} and ${shown.at(-1)}` : shown[0];
    summary.push(`The candidate has a technical foundation in ${list}${rest > 0 ? ` plus ${rest} more skill${rest > 1 ? "s" : ""}` : ""}.`);
  }

  if (selected) {
    const { result, title } = selected;
    if (result.percentage === null) {
      summary.push(`No required skills are configured for ${title}, so a match score could not be calculated.`);
    } else if (result.missing.length === 0) {
      summary.push(`The resume covers every required skill for ${title} roles.`);
    } else {
      const m = result.missing;
      const list = m.length > 1 ? `${m.slice(0, -1).join(", ")} and ${m.at(-1)}` : m[0];
      summary.push(`To strengthen suitability for ${title} roles, the candidate should improve their knowledge of ${list}.`);
    }
  }

  const suggested = ranked.filter((r) => (r.percentage ?? 0) > 0).slice(0, 3);
  if (suggested.length > 0) {
    summary.push(
      `Best-matching roles: ${suggested.map((r) => `${r.job.title} (${r.percentage}%)`).join(", ")}.`,
    );
  }

  // Learning areas: missing skills from the selected role and top matches, most in-demand first.
  const demand = new Map<string, number>();
  for (const r of ranked) for (const s of r.missing) demand.set(s, (demand.get(s) ?? 0) + 1);
  const pool = new Set<string>([...(selected?.result.missing ?? []), ...suggested.flatMap((r) => r.missing)]);
  const learningAreas = [...pool].sort((a, b) => (demand.get(b) ?? 0) - (demand.get(a) ?? 0)).slice(0, 6);

  return { summary, suggestedRoles: suggested.map((r) => r.job.title), learningAreas };
}
