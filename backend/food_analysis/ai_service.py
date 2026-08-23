from google import genai
from google.genai import types
from django.conf import settings
import json

from users.models import UserProfile


client = genai.Client(api_key=settings.GEMINI_API_KEY)


def analyze_food_label(user, images):

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

Analyze ONLY the uploaded food package images.

Before performing any analysis, first determine whether the uploaded images
represent a packaged food product.

Use the uploaded images as the primary and only source of information.

Use all uploaded images together. They may show the front, back,
ingredients, nutrition facts, allergens, manufacturer information,
or other parts of the same food package.

If the uploaded images do NOT represent a packaged food label
(for example a selfie, screenshot, terminal window, document, receipt,
handwritten notes, landscape, or any unrelated image), return ONLY this JSON:

{{
"error": "The uploaded image does not appear to be a packaged food label. Please upload a clear image of a packaged food package."
}}

Do not attempt any analysis if the uploaded images are unrelated to a packaged food label.

Do not invent or guess information that is not visible or supported
by the uploaded images.

Use the user's health preferences to personalize the analysis and recommendations whenever applicable.

Do not mention a health preference unless it is relevant to the product.

{health_context}

Rules:

- Do not invent or guess information that is not supported by the uploaded images.
- If information is missing or cannot be clearly read, return "Not Available".
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

- Return the full consumer-facing product name as prominently displayed on the package.
- Include the brand name together with the product name when they appear together as the displayed identity.
- Include a flavour, variant, or style when it is clearly part of the displayed product name.
- Search across all uploaded images before deciding.
- If multiple images show different parts of the same package, combine the relevant information from all images to identify the complete product name.
- Do not include taglines, promotional text, marketing claims, descriptions, or unrelated text.
- Do not infer or append generic food categories such as "Namkeen", "Potato Chips", "Snack", or similar words unless they are clearly part of the displayed product name.
- Do not return the manufacturer, parent company, marketer, distributor, or FSSAI license holder as the product name when a consumer-facing product name is available.
- Ignore company names that appear only in manufacturer, marketer, distributor, or licensing information.
- If only a manufacturer or company name is visible and no consumer-facing product name can be confidently identified, return "Not Available".
- If only part of the product name is visible, return only the confidently identified portion.
- Do not invent or infer words that are not supported by the uploaded images.
- If the product name cannot be confidently identified from the uploaded images, return "Not Available".

Examples:

"Haldiram's Soan Papdi" → "Haldiram's Soan Papdi"

"Haldiram's Chocolate Soan Papdi" → "Haldiram's Chocolate Soan Papdi"

"Lay's Classic Salted" → "Lay's Classic Salted"

"Lay's India's Magic Masala" → "Lay's India's Magic Masala"

"Kurkure Green Chutney Style" → "Kurkure Green Chutney Style"

"Bingo Mad Angles" → "Bingo Mad Angles"

"Pringles Original" → "Pringles Original"

"PepsiCo ... manufacturer information ... Lay's Classic Salted" → "Lay's Classic Salted"

"PepsiCo" appearing only in manufacturer information → "Not Available"

For each ingredient:

- Return its name.
- Add a short description explaining its role in the product.
- Carefully inspect all uploaded images for the complete ingredient list.
- Do not omit clearly visible ingredients.
- If an ingredient is part of a compound ingredient, preserve the compound ingredient structure when clearly shown on the package.

For each additive:

- Carefully inspect the ingredients and additive information in all uploaded images.
- Return the additive exactly as it appears on the label whenever possible.
- If it is only a number like 627 or 631, prefix it with "INS ".

Examples:
627 → INS 627
631 → INS 631

- Preserve INS numbers exactly as shown on the package.
- Do not substitute one INS number for another.
- Mention its purpose, for example: preservative, flavour enhancer, colour.
- Mention a brief health note if generally known.
- If no health note is available, return "Not Available".

For allergens:

- Return only allergens explicitly present in the label.
- Carefully inspect ingredient statements and allergen declarations across all uploaded images.

For nutrition information:

- Carefully read the nutrition table directly from the uploaded images.
- Preserve numerical values exactly as shown on the package.
- Include the serving size when available.
- Include energy, carbohydrates, total sugars, added sugars, protein, total fat, saturated fat, trans fat, sodium, and other available nutrition values.
- Do not replace numerical nutrition information with general descriptions such as "high in sugar" when numerical values are clearly visible.
- If a nutrition value is not available or cannot be clearly read, return "Not Available".

For recommendations:

- Provide practical advice based on the product, nutritional information, and the user's health preferences.
- If the product contains an allergen listed in the user's health preferences, clearly warn the user.
- When a product contains ingredients that match the user's recorded allergies, use wording similar to:
  "This product contains Wheat and Tomato Powder, both of which match your recorded allergies."
- If the product conflicts with the user's dietary preference, mention the conflict.
- If the nutritional content or ingredients may not be suitable for any of the user's medical conditions, briefly explain why.
- If there are no conflicts with the user's health preferences, mention that it appears suitable based on the available information.
- Keep each recommendation short and easy to understand.

Keep all descriptions concise (1–2 sentences).
"""

    try:

        image_parts = []

        for image in images:

            image.seek(0)

            image_bytes = image.read()

            mime_type = getattr(
                image,
                "content_type",
                "image/jpeg"
            )

            image_parts.append(
                types.Part.from_bytes(
                    data=image_bytes,
                    mime_type=mime_type
                )
            )

        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=image_parts + [prompt]
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
            "raw_response": response_text,
        }