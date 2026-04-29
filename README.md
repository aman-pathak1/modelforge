# ModelForge

![Vercel](https://img.shields.io/badge/Frontend-Vercel-black?style=flat-square&logo=vercel)
![HuggingFace](https://img.shields.io/badge/Backend-HuggingFace-yellow?style=flat-square&logo=huggingface)
![FastAPI](https://img.shields.io/badge/API-FastAPI-009688?style=flat-square&logo=fastapi)
![React](https://img.shields.io/badge/UI-React_18-61DAFB?style=flat-square&logo=react)
![sklearn](https://img.shields.io/badge/ML-scikit--learn-F7931E?style=flat-square&logo=scikitlearn)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

> Drop a CSV. Get a production-ready ML pipeline in minutes.

**Live Demo** → https://modelforge-vjtp-8zfx5br88-aman-pathak1s-projects.vercel.app/login
**Backend API** → https://aman12213-modelforge-backend.hf.space/health

---

## The Problem

Every time I got a new dataset I had to write the same boilerplate — load CSV, check types, handle missing values, try a few models, tune the best one, write the pipeline. It takes hours and most of it is copy-paste work.

ModelForge automates all of it. You upload a file, pick your target column, and walk away with real cross-validation scores, a tuned model, and Python code you can run immediately.

---

## What Actually Happens

```
CSV Upload
    │
    ├── Browser parses file (Reservoir Sampling for large files)
    ├── Welford stats computed locally (mean, std, skew, kurtosis)
    ├── Data quality issues flagged (leakage, missing, imbalance)
    │
    └── FastAPI Backend (HuggingFace)
            ├── Real sklearn training — 10 models, 5-fold CV
            ├── GridSearchCV on top 2 models
            ├── Real feature importance extracted
            └── Results sent back to frontend
```

---

## Features

### 🔐 Secure Authentication
- **Premium 3D Interface**: stunning 3D glassmorphism design for Login and Signup.
- **Auto-Verification**: Instant access after signup for a seamless developer experience.
- **JWT Protection**: Secure token-based session management.
- **Protected Routes**: Ensuring data privacy across the platform.

### Data Analysis
| What | How |
|---|---|
| Statistics | Welford online algorithm — single pass, numerically stable |
| Outlier detection | IQR method with configurable bounds |
| Normality test | Jarque-Bera proxy |
| Missing values | Per-column percentage with imputation strategy |
| Cardinality | Shannon entropy + recommended encoding |

### Data Quality Engine
Automatically detects and flags:

- Leaky columns — ID, UUID, hash-like patterns
- Constant columns — zero variance, useless for training
- High missing rate — above 10% warns, above 30% critical
- Class imbalance — flags when top class exceeds 90%
- High cardinality categoricals — recommends encoding strategy

Everything rolls into a **Health Score (0-100)** shown on the overview.

### Model Benchmark
Runs actual cross-validation on your data — not estimates.

**Classification (10 models)**
```
LGBMClassifier · XGBClassifier · RandomForestClassifier
GradientBoostingClassifier · ExtraTreesClassifier
LogisticRegression · SVC · KNeighborsClassifier
DecisionTreeClassifier · GaussianNB
```

**Regression (10 models)**
```
LGBMRegressor · XGBRegressor · RandomForestRegressor
GradientBoostingRegressor · ExtraTreesRegressor
Ridge · Lasso · ElasticNet · SVR · DecisionTreeRegressor
```

### Hyperparameter Tuning
GridSearchCV on top 2 models from the benchmark. Search grids cover parameters that actually move the needle — learning rate, tree depth, regularization strength.

### Data Cleaning Panel
Fix issues directly in the browser before training:

| Operation | Works On |
|---|---|
| Fill missing → mean / median | Numeric |
| Fill missing → most frequent | Categorical |
| Cap outliers at IQR bounds | Numeric |
| Drop rows with missing | Both |
| Drop column entirely | Both |

Download the cleaned CSV when done.

### Python Code Export
Generates a complete, runnable sklearn pipeline with your actual column names and types:

```python
# What gets generated
preprocessor = ColumnTransformer([
    ('num', numeric_pipeline, NUMERIC_COLS),
    ('cat_low', low_card_pipeline, low_card_cats),
    ('cat_high', high_card_pipeline, high_card_cats),
])

# With MLflow tracking
with mlflow.start_run():
    mlflow.log_metric("test_accuracy", accuracy)
    mlflow.sklearn.log_model(final_model, "model")
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS + Lucide Icons |
| Animations | **Framer Motion (3D Effects)** |
| Auth | JWT + React Router |
| Charts | Recharts |
| Backend | FastAPI + Python 3.11 |
| ML | scikit-learn + LightGBM + XGBoost |
| Container | Docker |
| Frontend Deploy | Vercel |
| Backend Deploy | HuggingFace Spaces |

---

## Running Locally

**Frontend**
```bash
git clone https://github.com/aman-pathak1/modelforge
cd modelforge
npm install
npm run dev
```

**Backend**
```bash
git clone https://github.com/aman-pathak1/modelforge-backend
cd modelforge-backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

If running backend locally, change the `BACKEND` constant in `src/App.jsx`:
```js
const BACKEND = "http://localhost:8000"
```

---

## API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/health` | GET | Check if backend is running |
| `/analyze` | POST | Full pipeline — CV + tuning + feature importance |
| `/predict` | POST | Single row prediction from trained model |

```bash
# Quick health check
curl https://aman12213-modelforge-backend.hf.space/health

# Response
{"status":"ok","lgbm":true,"xgb":true}
```

---

## Known Limitations

**Cold starts** — HuggingFace free tier sleeps after inactivity. First request can take 30-60 seconds. Everything after that is fast.

**Training time** — Depends on dataset size. Under 10k rows finishes in under 30 seconds. Larger datasets take longer, especially GradientBoosting and SVC.

**Live prediction** — Retrains on every request. Fine for demos, not how you'd do it in production.

**Max dataset size** — 500MB with reservoir sampling. Above that the browser will struggle before the backend even sees the file.

---

## Feedback

Something broken or have a suggestion — DM on LinkedIn.

If this was useful, a star on the repo helps more people find it.
