#!/usr/bin/env python3
"""ChromaMe — AI beauty & color profile analyzer."""

import argparse
import base64
import json
import sys
from pathlib import Path

import anthropic

SYSTEM_PROMPT = """You are a professional color analyst and makeup artist trained in seasonal color theory and Fitzpatrick skin classification.

Analyze the person's face in the image and produce a personal color and beauty profile. Base your judgments on:
- Overall skin tone depth (fair through deep)
- Undertone — warm (yellow/peach/golden), cool (pink/red/blue), or neutral
- Contrast level between hair, skin, and eyes
- Eye color and natural hair color
- Seasonal color theory (Spring, Summer, Autumn, Winter)

Return real hex codes that flatter this specific person, not generic palette swatches. Be specific and decisive — if lighting or angle limits your read, lower the confidence rating rather than hedge every field."""

ANALYZE_INSTRUCTION = "Analyze this photo and return the full ChromaMe beauty profile."

SWATCH_ITEM = {
    "type": "object",
    "properties": {
        "name": {"type": "string"},
        "hex": {"type": "string", "description": "Hex color code like #RRGGBB"},
    },
    "required": ["name", "hex"],
    "additionalProperties": False,
}

SCHEMA = {
    "type": "object",
    "properties": {
        "skinTone": {"type": "string", "enum": ["fair", "light", "medium", "olive", "tan", "deep"]},
        "undertone": {"type": "string", "enum": ["warm", "cool", "neutral"]},
        "season": {"type": "string", "enum": ["Spring", "Summer", "Autumn", "Winter"]},
        "fitzpatrick": {"type": "integer", "description": "Fitzpatrick scale 1-6"},
        "confidence": {"type": "string", "enum": ["low", "medium", "high"]},
        "blushShades": {"type": "array", "items": SWATCH_ITEM},
        "lipColors": {"type": "array", "items": SWATCH_ITEM},
        "foundationHex": {"type": "string"},
        "eyeshadowPalette": {"type": "array", "items": SWATCH_ITEM},
        "clothingColors": {"type": "array", "items": {"type": "string"}},
        "accentColors": {
            "type": "array",
            "items": {"type": "string"},
            "description": "Hex codes for complementary accent colors (scarves, bags, statement pieces)",
        },
        "avoidColors": {"type": "array", "items": {"type": "string"}},
        "jewelryMetal": {"type": "string", "enum": ["gold", "silver", "rose gold", "mixed"]},
        "hairRecommendations": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "name": {"type": "string"},
                    "hex": {"type": "string"},
                    "category": {"type": "string", "enum": ["natural", "bold"]},
                },
                "required": ["name", "hex", "category"],
                "additionalProperties": False,
            },
        },
        "notes": {"type": "string", "description": "One- or two-sentence overall summary"},
    },
    "required": [
        "skinTone", "undertone", "season", "fitzpatrick", "confidence",
        "blushShades", "lipColors", "foundationHex", "eyeshadowPalette",
        "clothingColors", "accentColors", "avoidColors", "jewelryMetal",
        "hairRecommendations", "notes",
    ],
    "additionalProperties": False,
}

MEDIA_TYPES = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".gif": "image/gif",
}


def analyze_bytes(image_bytes: bytes, media_type: str) -> dict:
    if media_type not in MEDIA_TYPES.values():
        raise ValueError(f"Unsupported media type: {media_type}")

    image_data = base64.standard_b64encode(image_bytes).decode()

    client = anthropic.Anthropic()

    response = client.messages.create(
        model="claude-opus-4-7",
        max_tokens=16000,
        thinking={"type": "adaptive"},
        system=SYSTEM_PROMPT,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": media_type,
                            "data": image_data,
                        },
                    },
                    {"type": "text", "text": ANALYZE_INSTRUCTION},
                ],
            }
        ],
        output_config={"format": {"type": "json_schema", "schema": SCHEMA}},
    )

    for block in response.content:
        if block.type == "text":
            return json.loads(block.text)

    raise RuntimeError("Model returned no text content")


def analyze(image_path: Path) -> dict:
    suffix = image_path.suffix.lower()
    if suffix not in MEDIA_TYPES:
        raise ValueError(f"Unsupported image type: {suffix}. Use JPG, PNG, WebP, or GIF.")
    return analyze_bytes(image_path.read_bytes(), MEDIA_TYPES[suffix])


def main() -> int:
    parser = argparse.ArgumentParser(description="ChromaMe — AI beauty & color profile analyzer")
    parser.add_argument("image", type=Path, help="Path to a face image (JPG, PNG, WebP, GIF)")
    args = parser.parse_args()

    if not args.image.exists():
        print(f"Error: file not found: {args.image}", file=sys.stderr)
        return 1

    profile = analyze(args.image)
    print(json.dumps(profile, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
    