[README.md](https://github.com/user-attachments/files/30534057/README.md)
# AI Resume Analyzer

An AI-powered resume analysis tool that gives an ATS (Applicant Tracking System) score, company-wise scoring, strengths, weaknesses, improvement suggestions, and best-fit job role recommendations — built as a combined LLM + NLP assignment.

This project has two connected parts:
1. **A full-stack web app** (zero-code build using an AI agent) that lets users upload a resume and get instant ATS analysis.
2. **An NLP pipeline** trained on a Kaggle resume dataset that classifies resumes into job categories and powers the keyword-matching logic used in the app's ATS score.

---

## 🔗 Links

- **Live app:** `<add your Vercel link here once deployed>`
- **Local demo:** Runs at `http://localhost:3000` after setup (see below)
- **NLP notebook:** [`nlp/NLP_Resume_Classifier.ipynb`](./nlp/NLP_Resume_Classifier.ipynb)

---

## Part 1 — LLM App (Zero-Code Build)

### Tech Stack
- **Frontend/Backend:** Next.js 14 (App Router) + Tailwind CSS
- **File parsing:** `pdf-parse` (PDF), `mammoth` (DOCX)
- **ATS Scoring:** Rule-based / TF-IDF keyword match with per-company weight profiles
  - 45 pts — keyword match
  - 25 pts — role fit
  - 15 pts — resume sections present
  - 8 pts — bullet point usage
  - 7 pts — resume length
- **AI feedback:** Google Gemini API (`gemini-2.5-flash`) for strengths, weaknesses, and suggestions
- **Deployment:** Vercel, with `GEMINI_API_KEY` stored as an environment variable

### Features
| Feature | Description |
|---|---|
| Resume upload | Drag-and-drop PDF/DOCX upload |
| Company selector | TCS, Infosys, Google, Amazon, Microsoft, Accenture |
| ATS Score | 0–100 score from keyword match, formatting, and sections |
| Company-wise score | Score varies per company based on keyword weighting |
| Strengths / Weaknesses | AI-generated from resume content |
| Suggestions | 3–5 actionable improvement tips |
| Role recommendation | Top 3 best-fit job roles |
| UI | Animated circular ATS score gauge, glassmorphism results panel |

### Prompt Used
```
Build a full-stack "AI Resume Analyzer" web app using Next.js (App Router) and Tailwind CSS.

Features:
- Upload a resume (PDF or DOCX)
- Select a target job role and company from a dropdown (TCS, Infosys, Google, Amazon, Microsoft, Accenture)
- Calculate an ATS score (0-100) using a rule-based/TF-IDF keyword match against the selected role+company, plus formatting checks (sections present, bullet usage, length)
- Show a different ATS score per selected company (vary keyword weighting per company)
- List strengths, weaknesses, and 3-5 actionable improvement suggestions (use an LLM API call for this text generation)
- Recommend top 3 best-fit job roles based on resume content
- Keep the LLM API key in an environment variable (.env.local), never hardcoded
- Add a simple, clean UI with a circular/gauge score display
- Make sure it's deployable on Vercel with no extra config

Set up the Next.js project, install all dependencies, write all the code, and run it locally so I can test it.
```

### Running Locally
```bash
git clone https://github.com/Ayush-Vaishnav/resume-analyzer.git
cd resume-analyzer
npm install
```

Create a `.env.local` file in the project root:
```
GEMINI_API_KEY=your_gemini_api_key_here
```
Get a free key at [aistudio.google.com](https://aistudio.google.com).

```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

---

## Part 2 — NLP Assignment (Resume Classification)

### Dataset
[Kaggle "Resume Dataset" by Snehaan Bhawal](https://www.kaggle.com/datasets/snehaanbhawal/resume-dataset) — 2,484 resumes across 24 job categories.

### Pipeline
1. Load resume text data with pandas
2. Clean text — lowercase, remove stopwords/punctuation, lemmatize
3. Extract features with TF-IDF (unigrams + bigrams)
4. Extract skills/keywords using a curated skill dictionary
5. Train classifiers — Logistic Regression and Linear SVM — for category prediction
6. Evaluate with accuracy, precision, recall, and F1-score
7. Visualize confusion matrix and top keywords per category
8. Bonus: cosine-similarity resume ↔ job-description matcher (the same logic used for the ATS score in the app)

### Results (on real dataset)
| Model | Accuracy | Precision | Recall | F1-score |
|---|---|---|---|---|
| Logistic Regression | 67.2% | 0.680 | 0.672 | 0.662 |
| Linear SVM | **74.0%** | 0.743 | 0.740 | 0.736 |

### Running the Notebook
1. Download `Resume.csv` from the [Kaggle dataset](https://www.kaggle.com/datasets/snehaanbhawal/resume-dataset)
2. Place it in the same folder as `NLP_Resume_Classifier.ipynb`
3. Open in Jupyter/Colab and run all cells

---

## How the Two Parts Connect

The NLP notebook's TF-IDF vectorization and cosine-similarity resume-matching function (`ats_score()`) is the same core technique used to power the **ATS keyword-match scoring** inside the web app — both parts share the same underlying NLP approach, applied first for offline analysis/classification (Part 2) and then productionized into a live scoring API (Part 1).

---

## Project Structure
```
resume-analyzer/
├── app/
│   ├── api/analyze/route.ts   # Analysis API endpoint
│   ├── page.tsx                # Main page
│   └── globals.css
├── components/
│   ├── UploadForm.tsx
│   ├── ScoreGauge.tsx
│   ├── ResultsPanel.tsx
│   └── JobRoles.tsx
├── lib/
│   ├── atsScorer.ts             # TF-IDF scoring engine
│   ├── keywords.ts              # Company/role keyword dictionaries
│   ├── llmClient.ts             # Gemini API wrapper
│   └── parseResume.ts           # PDF/DOCX text extraction
├── nlp/
│   └── NLP_Resume_Classifier.ipynb
├── .env.local                   # API key (gitignored)
└── README.md
```

---

## Submission Checklist
- [x] GitHub repo link (this repo, with README)
- [ ] Live Vercel link
- [x] Prompt(s) used (documented above)
- [ ] Screenshot / short demo recording
