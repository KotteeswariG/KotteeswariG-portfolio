# ChromaMe

AI beauty & color profile analyzer. Upload a face photo and get back skin tone, undertone, color season, makeup palette, clothing colors, and hair recommendations — all powered by Claude Opus 4.7 Vision.

## Structure

```
chromame/
├── analyze.py          CLI + reusable analysis function
├── server.py           FastAPI backend (POST /api/analyze)
├── requirements.txt    Python deps
└── frontend/           Vite + React + Ant Design UI
```

## Backend

```bash
cd chromame
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
export ANTHROPIC_API_KEY="sk-ant-..."
python server.py            # runs on http://127.0.0.1:8000
```

The CLI still works standalone: `python analyze.py /path/to/photo.jpg`.

## Frontend

```bash
cd chromame/frontend
pnpm install
pnpm dev                    # runs on http://127.0.0.1:5173
```

The Vite dev server proxies `/api/*` to the FastAPI backend, so run both at once. Open `http://127.0.0.1:5173` and upload a photo.

## Model

`claude-opus-4-7` with adaptive thinking and structured-output JSON schema validation.
