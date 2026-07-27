from google import genai
from django.conf import settings
import json

client = genai.Client(api_key=settings.GEMINI_API_KEY)


def analyze_food_label(ocr_text):
    prompt = f"""
You are a food label analysis expert.

Analyze ONLY the food label text provided below.

Rules:
- Do not guess or invent information.
- If information is missing, return "Not Available".
- Return ONLY valid JSON.
- Do not include markdown formatting.
- Do not wrap the JSON inside ```json blocks.

Return this JSON format:
{{
    "product_name": "",
    "ingredients": [
        {{
            "name": "",
            "description": ""
        }}
    ],
    "additives": [
        {{
            "name": "",
            "purpose": "",
            "health_note": ""
        }}
    ],
    "allergens": [],
    "nutrition_summary": "",
    "health_concerns": [],
    "recommendations": []
}}

For each ingredient:
- Return its name.
- Add a short description explaining its role in the product.

For each additive:
- Return the additive exactly as it appears on the label.
If it is only a number like 627 or 631, prefix it with "INS ".
Example:
627 → INS 627
631 → INS 631.
- Mention its purpose (for example: preservative, flavour enhancer, colour).
- Mention a brief health note if generally known.
- If no health note is available, return "Not Available".

For allergens:
- Return only allergens explicitly present in the label.

For recommendations:
- Provide practical advice based on the product and its nutritional information.
- Keep each recommendation short and easy to understand.

Keep all descriptions concise (1–2 sentences).

Food Label Text:

{ocr_text}
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt
    )

    response_text = response.text.strip()

    # Remove markdown code fences if Gemini returns them
    if response_text.startswith("```json"):
        response_text = response_text.replace("```json", "", 1)

    if response_text.endswith("```"):
        response_text = response_text[:-3]

    response_text = response_text.strip()

    try:
        return json.loads(response_text)

    except json.JSONDecodeError:
        return {
            "error": "Failed to parse Gemini response.",
            "raw_response": response.text,
        }