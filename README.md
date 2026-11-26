# Career Fit Skill Compass

PROJECT TITLE

SKILLMATCH – SMART RESUME ANALYZER AND JOB RECOMMENDATION SYSTEM

1. PROJECT OVERVIEW

SkillMatch is a Python-based Smart Resume Analyzer and Job Recommendation System designed to help job seekers understand their skills, analyze their resumes, identify missing qualifications, and discover suitable job opportunities.



The main purpose of SkillMatch is to connect a candidate's existing skills with the skills required by different job roles.



In the traditional job application process, candidates often apply for jobs without knowing whether their qualifications and technical skills match the job requirements. They may not understand which skills are missing from their resumes or what they should learn to improve their employment opportunities.



SkillMatch solves this problem by automatically extracting information from uploaded resumes, identifying technical skills, comparing those skills with predefined job requirements, calculating skill match percentages, identifying skill gaps, and recommending suitable job roles.



The application uses Python for its backend processing, Flask for web application development, SQLite for database management, and Natural Language Processing (NLP) techniques for text processing and skill identification.



The system provides an easy-to-use interface where candidates can upload their resumes and receive a structured analysis report.



2. MAIN PURPOSE OF THE PROJECT

The main purpose of SkillMatch is to simplify the resume evaluation and job search process.



The system aims to:



Analyze resumes automatically.



Extract candidate information and technical skills.



Compare extracted skills with job requirements.



Calculate a resume-to-job matching percentage.



Identify skills that are available and missing.



Recommend suitable job roles based on the candidate's skills.



Detect duplicate resume uploads.



Generate a detailed resume analysis report.



Suggest skills that candidates should learn to improve their job eligibility.



Provide a simple platform for understanding career opportunities.



3. PROBLEM STATEMENT

Many job seekers find it difficult to identify job opportunities that match their educational qualifications and technical skills.



Traditional resume evaluation requires candidates or recruiters to manually read resumes and compare them with job descriptions. This process can be time-consuming and may not clearly identify the candidate's skill gaps.



Candidates may also apply for jobs without understanding the technical requirements of the selected roles.



The major problems are:



Manual resume analysis takes time and effort.



Candidates may not know which technical skills are mentioned in their resumes.



It is difficult to compare resume skills with multiple job descriptions manually.



Missing skills are not always clearly identified.



Job seekers may apply for unsuitable job roles.



Candidates do not always receive useful recommendations for improving their skills.



Repeated uploads of the same resume may create duplicate records.



Therefore, an automated resume analysis and job recommendation system is required to make the process easier, faster, and more informative.



4. OBJECTIVES

The primary objectives of SkillMatch are:



To develop a user-friendly web application using Python.



To allow candidates to upload resumes in PDF and DOCX formats.



To extract text and relevant information from uploaded resumes.



To identify technical and professional skills using text-processing techniques.



To compare extracted skills with predefined job requirements.



To calculate the percentage of matching skills for each job role.



To identify missing skills and display skill-gap information.



To recommend job roles based on the candidate's skills.



To detect duplicate resume uploads.



To generate a clear and understandable analysis report.



5. TARGET USERS

The system is mainly designed for:



Job Seekers

Candidates who want to analyze their resumes and understand their suitability for different job roles.



Fresh Graduates

Students and recent graduates who want to identify their technical skills and discover suitable entry-level job opportunities.



Working Professionals

People who want to evaluate their existing skills and identify areas for professional improvement.



Recruiters

Recruiters who may use the system as an initial resume-screening and skill-comparison aid. It should not replace human evaluation or final hiring decisions.



6. TECHNOLOGY STACK

The application should use the following technologies.



Frontend Technologies

HTML5:

Used to create the structure of the website, including forms, buttons, navigation menus, tables, and content sections.



CSS3:

Used to design the website, customize colors, spacing, typography, and page layouts.



Bootstrap:

Used to create responsive layouts, navigation bars, upload forms, tables, buttons, and other interface components.



JavaScript:

Used for basic frontend interactions, form validation, upload feedback, and dynamic interface behavior where necessary.



Backend Technologies

Python:

The main programming language used for application logic, resume processing, skill extraction, comparison, and recommendation generation.



Flask:

A Python web framework used to connect the frontend with backend functions and manage application routes.



Database

SQLite:

Used to store candidate information, uploaded resume records, extracted skills, job details, and analysis results.



Resume Processing Libraries

PyPDF2:

Used to extract text from text-based PDF resumes.



python-docx:

Used to extract text from DOCX resumes.



Natural Language Processing

NLTK:

Used for basic text processing, tokenization, normalization, and preparation of resume content for skill extraction.



Additional Python Libraries

Regular Expressions (re):

Used to identify patterns and match skill names in resume text.



hashlib:

Used to generate SHA-256 hashes for duplicate resume detection.



os and pathlib:

Used for file handling and directory management.



Werkzeug:

Used for secure filename handling and Flask-related file upload utilities.



Development Tools

Visual Studio Code:

Used to write and manage Python, HTML, CSS, and JavaScript code.



Web Browser:

Used to run and test the SkillMatch application.



Git and GitHub:

Can be used for version control and project source-code management.



7. SYSTEM ARCHITECTURE

The SkillMatch application should follow a simple three-layer architecture.



Layer 1: Presentation Layer

This is the frontend interface used by the candidate.



Technologies:



HTML5



CSS3



Bootstrap



JavaScript



Responsibilities:



Display the home page.



Provide the resume upload form.



Display candidate analysis results.



Show skill match percentages.



Display missing skills.



Show job recommendations.



Display the final report.



Layer 2: Application Layer

This is the backend processing layer.



Technologies:



Python



Flask



PyPDF2



python-docx



NLTK



Responsibilities:



Receive uploaded resumes.



Validate file formats.



Extract text from resumes.



Process and normalize the extracted text.



Identify candidate skills.



Compare skills with job requirements.



Calculate matching percentages.



Identify missing skills.



Generate job recommendations.



Detect duplicate resumes.



Layer 3: Data Layer

Technology:



SQLite



Responsibilities:



Store candidate details.



Store resume information.



Store extracted skill records.



Store job descriptions and required skills.



Store analysis results.



Maintain resume hash records for duplicate detection.



Overall Architecture Flow

Candidate

→ SkillMatch Website

→ Resume Upload

→ Flask Backend

→ Resume Text Extraction

→ Text Processing

→ Skill Identification

→ Job Skill Comparison

→ Match Percentage Calculation

→ Skill Gap Analysis

→ Job Recommendations

→ SQLite Database

→ Final Analysis Report



8. MODULE-WISE PROJECT DESCRIPTION

The entire application should be divided into the following modules.



MODULE 1: USER INTERFACE AND RESUME UPLOAD

Description:



This module provides the main interface through which users interact with SkillMatch.



Candidates can open the website, enter their details, select a preferred job role, and upload their resumes.



The application should accept PDF and DOCX files.



Key Features:



Display a professional home page.



Provide a resume upload section.



Allow the user to enter their name.



Allow selection of a preferred job role.



Accept PDF and DOCX resume formats.



Validate the uploaded file format.



Display upload success or error messages.



Send the uploaded file to the Flask backend.



Expected Output:



"Resume uploaded successfully."



The system should then proceed to resume processing.



MODULE 2: RESUME TEXT EXTRACTION

Description:



This module extracts readable text from the uploaded resume.



When a candidate uploads a PDF file, PyPDF2 should be used to extract its text.



When a candidate uploads a DOCX file, python-docx should be used to extract its paragraphs and readable text.



The extracted text should be sent to the text-processing module.



Key Features:



Identify the uploaded file format.



Extract text from PDF documents.



Extract text from DOCX documents.



Collect readable resume content.



Handle empty or unsupported documents.



Display an appropriate error when text cannot be extracted.



Example Input:



A candidate uploads a resume containing:



Name: John



Education: B.Tech Computer Science



Technical Skills:

Python, HTML, CSS, SQL, Java



Experience: Fresher



Example Extracted Output:



Candidate Name: John



Education: B.Tech Computer Science



Skills:



Python



HTML



CSS



SQL



Java



Experience: Fresher



Important Limitation:



The first version should support text-based PDF and DOCX files. Image-only or scanned PDFs require OCR, which can be added as a future enhancement.



MODULE 3: TEXT PROCESSING AND SKILL EXTRACTION

Description:



This module identifies the candidate's skills from the extracted resume text.



NLTK should be used for basic NLP preprocessing.



The system should also maintain a predefined skill dictionary containing recognized technical skills and their aliases.



Examples of skills:



Programming Languages:



Python



Java



C



C++



JavaScript



Web Technologies:



HTML



CSS



Bootstrap



React



Angular



Database Technologies:



SQL



MySQL



PostgreSQL



MongoDB



Frameworks:



Flask



Django



Node.js



Other Technical Skills:



Data Structures



Machine Learning



Artificial Intelligence



Git



Data Analysis



Process:



Receive the extracted resume text.



Convert text into a consistent lowercase format for matching.



Normalize common skill aliases.



Tokenize and process text using NLTK where appropriate.



Compare the processed content against the skill dictionary.



Identify recognized skills.



Remove repeated skill entries.



Store the extracted skills.



Example:



Resume Text:



"I have experience in Python programming, HTML, CSS, MySQL, and Flask."



Extracted Skills:



Python



HTML



CSS



MySQL



Flask



Important Matching Rule:



The system must avoid inaccurate partial matches.



For example, JavaScript must not automatically be treated as Java, and C must not be treated as a match inside C++.



The skill extraction process should use exact skill names, phrase matching, aliases, and suitable word-boundary checks.



NLTK is used for text processing; skill identification is performed using the configured skill dictionary and matching logic. The first version does not require a trained machine-learning model.



MODULE 4: SKILL GAP ANALYZER

Description:



The Skill Gap Analyzer is one of the main features of SkillMatch.



It compares the candidate's extracted skills with the required skills of a selected job role.



The system identifies which skills are available in the resume and which skills are missing.



Process:



Retrieve candidate skills.



Retrieve the selected job's required skills.



Compare both skill lists.



Identify matched skills.



Identify missing skills.



Calculate the skill matching percentage.



Display recommendations for missing skills.



Matching Formula:



Skill Match Percentage = (Number of Matched Required Skills / Total Number of Required Skills) × 100



Example:



Selected Job Role: Python Developer



Required Skills:



Python



SQL



Django



Flask



Git



Candidate Skills:



Python



SQL



HTML



CSS



Comparison:



Python – Matched



SQL – Matched



Django – Missing



Flask – Missing



Git – Missing



Matched Skills: 2



Missing Skills: 3



Total Required Skills: 5



Calculation:



(2 / 5) × 100 = 40%



Expected Output:



Job Role: Python Developer



Skill Match Score: 40%



Matched Skills:



Python



SQL



Missing Skills:



Django



Flask



Git



Recommendation:



The candidate should learn Django, Flask, and Git to improve their match with the selected Python Developer role.



Important Rule:



The matching percentage must always be calculated from the actual skill comparison. It must not be randomly generated or fixed to a particular value.



If a job has no required skills configured, the system should display an appropriate message instead of attempting division by zero.



MODULE 5: SMART JOB RECOMMENDATION SYSTEM

Description:



This module recommends job roles based on the candidate's extracted skills.



The system compares the candidate's skills against multiple job records stored in the database.



Each job record should contain:



Job title.



Company name, if applicable.



Job description.



Required technical skills.



Optional additional skills.



The system calculates a separate matching percentage for each job.



It then sorts the recommended jobs from the highest match percentage to the lowest.



Example Job Database:



Job 1:

Job Role: Python Developer



Required Skills:

Python, SQL, Django, Flask, Git



Job 2:

Job Role: Web Developer



Required Skills:

HTML, CSS, JavaScript, Bootstrap, React



Job 3:

Job Role: Junior Software Developer



Required Skills:

Python, Java, SQL, OOP, Git



Example Candidate Skills:



Python, HTML, CSS, SQL



Example Recommendation Output:



Python Developer

Match Percentage: 40%



Web Developer

Match Percentage: 40%



Junior Software Developer

Match Percentage: 40%



The percentages above are illustrative calculations based on the example skills and job lists.



Key Features:



Compare candidate skills with multiple jobs.



Calculate an individual match score for each job.



Display matched skills.



Display missing skills.



Sort jobs by match percentage.



Show job titles and descriptions.



Display company information when available.



Provide application links only when valid links are stored in the job database.



Important Rule:



The initial application should use a predefined job database or manually entered job records.



It must not claim to provide real-time job vacancies unless a genuine job API or verified external data source is integrated.



Sample company names and sample job records must be clearly identified as demonstration data.



MODULE 6: DUPLICATE RESUME DETECTION

Description:



This module checks whether an identical resume file has already been uploaded.



It prevents repeated storage and unnecessary processing of exactly identical files.



The system should use the Python hashlib library to generate a SHA-256 hash of the uploaded file.



Process:



Receive the uploaded resume.



Read the file contents.



Generate a SHA-256 hash.



Search the database for the same hash.



If the hash already exists, identify the upload as a duplicate.



If the hash does not exist, save the resume record and continue processing.



Example:



Resume Filename: John_Resume.pdf



File Hash: Generated SHA-256 value



Database Check: No matching hash found.



Output:



"Resume uploaded successfully. No duplicate detected."



Second Upload:



Resume Filename: John_Resume_Copy.pdf



If the file contents are identical to the previously uploaded resume:



Output:



"Duplicate resume detected. This identical file has already been uploaded."



Important Rule:



Duplicate detection should be based on file content, not only on filenames.



If the same resume is modified or reformatted, its file hash may change. Detecting semantically similar resumes is a separate advanced feature and is not guaranteed in the first version.



MODULE 7: FINAL RESUME ANALYSIS REPORT

Description:



This module combines the information produced by the other modules and generates a complete candidate analysis report.



The report should be easy to read and should show the candidate's resume information, extracted skills, job match score, skill gaps, and recommended job roles.



Report Contents:



Candidate Information:



Candidate Name.



Education, if extracted.



Experience, if extracted.



Resume Filename.



Resume Analysis:



Extracted Skills.



Number of Identified Skills.



Processing Status.



Skill Gap Analysis:



Selected Job Role.



Required Skills.



Matched Skills.



Missing Skills.



Matching Percentage.



Job Recommendations:



Recommended Job Titles.



Company Names, when available.



Match Percentages.



Missing Skills for each recommended role.



Duplicate Detection:



Original or Duplicate Status.



Final Recommendation:



Suitable job roles based on the calculated matches.



Skills the candidate should improve.



Suggested learning areas.



Example Final Report:



SKILLMATCH – RESUME ANALYSIS REPORT



Candidate Name: John



Education: B.Tech Computer Science



Experience: Fresher



Resume Status: Successfully Processed



Extracted Skills:



Python



HTML



CSS



SQL



Selected Job Role: Python Developer



Required Skills:



Python



SQL



Django



Flask



Git



Matched Skills:



Python



SQL



Missing Skills:



Django



Flask



Git



Skill Match Percentage: 40%



Recommended Job Roles:



Python Developer



Web Developer



Junior Software Developer



Duplicate Detection: No Duplicate Found



Final Recommendation:



The candidate has a basic technical foundation in Python, SQL, HTML, and CSS.



The candidate should improve their knowledge of Django, Flask, and Git to strengthen their suitability for Python Developer roles.



The final recommendation must be generated from the actual analysis results, not from hardcoded example values.



The report may be displayed on the website and optionally downloaded as a PDF.



9. JOB SKILL DATABASE

The application should have a predefined job database that contains multiple job roles and their required skills.



Suggested initial job roles:



Python Developer

Required Skills:



Python



SQL



Django



Flask



Git



Web Developer

Required Skills:



HTML



CSS



JavaScript



Bootstrap



React



Junior Software Developer

Required Skills:



Python



Java



SQL



Object-Oriented Programming



Git



Data Analyst

Required Skills:



Python



SQL



Excel



Data Analysis



Data Visualization



Machine Learning Engineer

Required Skills:



Python



Machine Learning



Statistics



NumPy



Pandas



These job roles should be stored in SQLite.



The database should allow new job roles and skill requirements to be added without changing the main matching algorithm.



10. MATCHING ALGORITHM

The matching algorithm is the central logic of SkillMatch.



It compares the candidate's unique normalized skills with the required skills of each job.



The algorithm should:



Read the candidate's extracted skills.



Read the required skills for a job.



Normalize skill names and aliases.



Compare the two sets.



Create a list of matched skills.



Create a list of missing skills.



Calculate the matching percentage.



Return the result.



Pseudocode:



START



Receive candidate skills.



Receive job required skills.



Normalize both skill lists.



Compare candidate skills with required skills.



Find matched skills.



Find missing skills.



IF total required skills is greater than zero:



Calculate match percentage.

ELSE:



Display "No job requirements available."

Display matched skills.



Display missing skills.



Display match percentage.



END



Matching Formula:



Match Percentage = (Matched Skills / Total Required Skills) × 100



Use unique skills so repeated mentions of the same skill do not increase the score.



All skill comparisons should be based on normalized canonical skill names.



11. DATABASE DESIGN

SQLite should be used to manage application information.



The recommended database tables

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://career-fit-skill-compass.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6ce85f2c-0862-50e5-be57-6f63a9cd6666).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
