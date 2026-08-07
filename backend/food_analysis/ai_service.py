from google import genai
from django.conf import settings
import json

from users.models import UserProfile

client = genai.Client(api_key=settings.GEMINI_API_KEY)


def analyze_food_label(ocr_text, user):

    health_context = ""

    if user.is_authenticated:

        profile, created = UserProfile.objects.get_or_create(
            user=user
        )

        health_context = f"""
User Health Preferences

Known Allergies:
{', '.join(profile.allergies) if profile.allergies else "None"}

Other Allergy:
{profile.other_allergy or "None"}

Dietary Preference:
{profile.dietary_preference or "None"}

Medical Conditions:
{', '.join(profile.medical_conditions) if profile.medical_conditions else "None"}

Other Medical Condition:
{profile.other_medical_condition or "None"}
"""

    prompt = f"""
You are a food label analysis expert.

Analyze ONLY the food label text provided below.
Before performing any analysis, first determine whether the OCR text comes from a packaged food product.

If the OCR text does NOT represent a packaged food label (for example a selfie, screenshot, terminal window, document, receipt, handwritten notes, landscape, or any unrelated image), return ONLY this JSON:

{{
"error": "The uploaded image does not appear to be a packaged food label. Please upload a clear image of a packaged food package."
}}

Do not attempt any analysis if the uploaded text is unrelated to a packaged food label.
The provided text is extracted using OCR from one or more images of the food package. The OCR output may contain minor spelling mistakes caused by stylized fonts, curved packaging, lighting, or image quality. Correct only obvious OCR spelling mistakes when the intended word is clear. Do not invent or guess information that is not supported by the extracted text.

Use the user's health preferences to personalize the analysis and recommendations whenever applicable. Do not mention a health preference unless it is relevant to the product.

{health_context}

Rules:

- Do not invent or guess information that is not supported by the extracted text.
- You may correct obvious OCR spelling mistakes when the intended word is clear.
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


For product_name:

- Return only the primary product name or brand name prominently displayed on the package.
- Do not include flavour names, taglines, product variants, or generic food categories unless they are part of the main product name.
- Search across all OCR text from every uploaded image before deciding.
- Correct obvious OCR spelling mistakes while preserving the actual product name.
- If only the main product name is visible, return that alone.
- Do not infer or append words such as "Namkeen", "Potato Chips", "Snack", or similar generic food categories unless they are clearly printed as part of the primary product name.
- If the primary product name cannot be confidently identified, return "Not Available".

Examples:

"Kyrkure" → "Kurkure"

"Kyrkure CHUTNHY STYLR" → "Kurkure"

"LAYS Classic Salted" → "Lay's"

"Lay's India's Magic Masala" → "Lay's"

"Bingo Mad Angles" → "Bingo"

"Pringles Original" → "Pringles"

- If only part of the product name is visible, return only the visible portion.
- If the product name cannot be identified from the extracted text, return "Not Available".

For each ingredient:

- Return its name.
- Add a short description explaining its role in the product.

For each additive:

- Return the additive exactly as it appears on the label.
- If it is only a number like 627 or 631, prefix it with "INS ".
  Example:
  627 → INS 627
  631 → INS 631.
- Mention its purpose (for example: preservative, flavour enhancer, colour).
- Mention a brief health note if generally known.
- If no health note is available, return "Not Available".

For allergens:

- Return only allergens explicitly present in the label.

For recommendations:

- Provide practical advice based on the product, nutritional information, and the user's health preferences.
- If the product contains an allergen listed in the user's health preferences, clearly warn the user.
- When a product contains ingredients that match the user's recorded allergies, use wording similar to: "This product contains Wheat and Tomato Powder, both of which match your recorded allergies."
- If the product conflicts with the user's dietary preference, mention the conflict.
- If the nutritional content or ingredients may not be suitable for any of the user's medical conditions, briefly explain why.
- If there are no conflicts with the user's health preferences, mention that it appears suitable based on the available information.
- Keep each recommendation short and easy to understand.

Keep all descriptions concise (1–2 sentences).

The OCR text below is extracted from one or more images of the same food package.

Different images may contain the front of the package, ingredients, nutrition facts, allergens, or other product information.

Identify the brand and product name from whichever image contains it. Do not assume the images are in any particular order.

If multiple images are provided:

- Search across all extracted OCR text for the product name and brand.
- The product name is usually displayed in larger or more prominent text than the ingredients.
- Prefer clearly identifiable product names over generic food categories.

Food Label Text:

{ocr_text}
"""

    try:

        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt
        )

        response_text = response.text.strip()

    except Exception as e:

        print("Gemini Error:", e)

        return {
            "error": "AI service is temporarily unavailable. Please try again in a few minutes."
        }

    # Remove markdown code fences if Gemini returns them
    if response_text.startswith("```json"):
        response_text = response_text.replace("```json", "", 1)

    if response_text.endswith("```"):
        response_text = response_text[:-3]

    response_text = response_text.strip()

    try:
        result = json.loads(response_text)

        if "error" in result:
           return result

        return result

    except json.JSONDecodeError:
       return {
          "error": "Failed to parse Gemini response.",
          "raw_response": response.text,
        }
