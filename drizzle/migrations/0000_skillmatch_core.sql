CREATE TABLE public.jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  company text,
  description text NOT NULL DEFAULT '',
  required_skills text[] NOT NULL DEFAULT '{}',
  optional_skills text[] NOT NULL DEFAULT '{}',
  apply_url text,
  is_demo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.jobs TO anon, authenticated;
GRANT ALL ON public.jobs TO service_role;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Jobs are viewable by everyone" ON public.jobs FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_name text NOT NULL,
  filename text NOT NULL,
  file_type text NOT NULL,
  file_hash text NOT NULL UNIQUE,
  education text,
  experience text,
  extracted_skills text[] NOT NULL DEFAULT '{}',
  preferred_job_id uuid REFERENCES public.jobs(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'processed',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.resumes TO service_role;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id uuid NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
  job_id uuid NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  match_percentage numeric(5,2) NOT NULL,
  matched_skills text[] NOT NULL DEFAULT '{}',
  missing_skills text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (resume_id, job_id)
);
GRANT ALL ON public.analyses TO service_role;
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;

INSERT INTO public.jobs (title, company, description, required_skills, optional_skills, is_demo) VALUES
('Python Developer', 'Demo Co. — Northwind Labs', 'Build and maintain backend services and web APIs in Python.', ARRAY['Python','SQL','Django','Flask','Git'], ARRAY['REST API','PostgreSQL','Docker'], true),
('Web Developer', 'Demo Co. — Brightpage Studio', 'Create responsive, accessible websites and front-end interfaces.', ARRAY['HTML','CSS','JavaScript','Bootstrap','React'], ARRAY['TypeScript','Git'], true),
('Junior Software Developer', 'Demo Co. — Ridgeway Software', 'Entry-level role writing, testing and debugging application code.', ARRAY['Python','Java','SQL','Object-Oriented Programming','Git'], ARRAY['Data Structures'], true),
('Data Analyst', 'Demo Co. — Ledgerline Analytics', 'Turn business data into reports, dashboards and insights.', ARRAY['Python','SQL','Excel','Data Analysis','Data Visualization'], ARRAY['Power BI','Tableau','Statistics'], true),
('Machine Learning Engineer', 'Demo Co. — Vectorfield AI', 'Train, evaluate and deploy machine learning models.', ARRAY['Python','Machine Learning','Statistics','NumPy','Pandas'], ARRAY['Deep Learning','TensorFlow','Scikit-learn'], true),
('Full Stack Developer', 'Demo Co. — Harborline Tech', 'Work across front end and back end of modern web products.', ARRAY['JavaScript','React','Node.js','MongoDB','Git'], ARRAY['TypeScript','Docker'], true),
('Java Backend Developer', 'Demo Co. — Ironbridge Systems', 'Develop server-side applications and services in Java.', ARRAY['Java','Spring Boot','SQL','Object-Oriented Programming','Git'], ARRAY['MySQL','REST API'], true),
('Frontend Developer (Angular)', 'Demo Co. — Copperleaf Digital', 'Build single-page applications with Angular and TypeScript.', ARRAY['HTML','CSS','JavaScript','TypeScript','Angular'], ARRAY['Bootstrap','Git'], true);