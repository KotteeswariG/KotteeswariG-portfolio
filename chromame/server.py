"""FastAPI server exposing analyze.py as POST /api/analyze."""

from dotenv import load_dotenv
from fastapi import FastAPI, File, HTTPException, UploadFile

load_dotenv()

from analyze import MEDIA_TYPES, analyze_bytes

app = FastAPI(title="ChromaMe")


@app.post("/api/analyze")
async def analyze_endpoint(image: UploadFile = File(...)) -> dict:
    filename = (image.filename or "").lower()
    suffix = "." + filename.rsplit(".", 1)[-1] if "." in filename else ""
    media_type = MEDIA_TYPES.get(suffix)
    if not media_type:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported image type: {suffix or 'unknown'}. Use JPG, PNG, WebP, or GIF.",
        )

    image_bytes = await image.read()
    try:
        return analyze_bytes(image_bytes, media_type)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {e}") from e


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000)
