# Chick

Find Your First 100 Customers — AI-powered community GTM intelligence.

## Quickstart

**Backend:**
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# paste your OpenAI API key into .env
uvicorn main:app --reload --port 8000
```

**Frontend:**
Open `frontend/index.html` (two-panel dashboard) or `frontend/map.html` (network-map prototype) directly in a browser. No build step.
