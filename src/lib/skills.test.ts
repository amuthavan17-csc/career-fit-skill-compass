import { describe, expect, it } from "vitest";
import { extractCandidateDetails, extractSkills, matchSkills, rankJobs } from "./skills";

describe("skill extraction", () => {
  it("finds the skills in the spec example sentence", () => {
    expect(extractSkills("I have experience in Python programming, HTML, CSS, MySQL, and Flask.")).toEqual(
      ["Python", "HTML", "CSS", "MySQL", "Flask"],
    );
  });

  it("does not treat JavaScript as Java", () => {
    const skills = extractSkills("Skills: JavaScript, React");
    expect(skills).toContain("JavaScript");
    expect(skills).not.toContain("Java");
  });

  it("does not treat C++ or C# as C", () => {
    const skills = extractSkills("Languages: C++, C#");
    expect(skills).toEqual(expect.arrayContaining(["C++", "C#"]));
    expect(skills).not.toContain("C");
  });

  it("finds C when listed on its own", () => {
    expect(extractSkills("Languages: C, C++, Java")).toEqual(expect.arrayContaining(["C", "C++", "Java"]));
  });

  it("counts repeated mentions only once", () => {
    expect(extractSkills("Python python PYTHON")).toEqual(["Python"]);
  });

  it("reads education and experience labels", () => {
    const d = extractCandidateDetails("Name: John\nEducation: B.Tech Computer Science\nExperience: Fresher");
    expect(d.education).toBe("B.Tech Computer Science");
    expect(d.experience).toBe("Fresher");
  });
});

describe("skill gap matching", () => {
  it("scores the Python Developer example at 40%", () => {
    const r = matchSkills(["Python", "SQL", "HTML", "CSS"], ["Python", "SQL", "Django", "Flask", "Git"]);
    expect(r.percentage).toBe(40);
    expect(r.matched).toEqual(["Python", "SQL"]);
    expect(r.missing).toEqual(["Django", "Flask", "Git"]);
  });

  it("returns no score instead of dividing by zero when a job has no required skills", () => {
    expect(matchSkills(["Python"], []).percentage).toBeNull();
  });

  it("ignores duplicate candidate skills", () => {
    expect(matchSkills(["Python", "python", "Python"], ["Python", "Java"]).percentage).toBe(50);
  });

  it("does not let Java satisfy a JavaScript requirement", () => {
    expect(matchSkills(["Java"], ["JavaScript"]).percentage).toBe(0);
  });

  it("sorts jobs from highest to lowest match", () => {
    const ranked = rankJobs(["HTML", "CSS", "JavaScript"], [
      { id: "1", title: "Python Developer", required_skills: ["Python", "SQL", "Django", "Flask", "Git"] },
      { id: "2", title: "Web Developer", required_skills: ["HTML", "CSS", "JavaScript", "Bootstrap", "React"] },
    ]);
    expect(ranked.map((r) => r.percentage)).toEqual([60, 0]);
  });
});
