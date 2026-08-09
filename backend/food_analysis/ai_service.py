# from google import genai
# from django.conf import settings
# import json

# from users.models import UserProfile

# client = genai.Client(api_key=settings.GEMINI_API_KEY)


# def analyze_food_label(ocr_text, user):

#     health_context = ""

#     if user.is_authenticated:

#         profile, created = UserProfile.objects.get_or_create(
#             user=user
#         )

#         health_context = f"""
# User Health Preferences

# Known Allergies:
# {', '.join(profile.allergies) if profile.allergies else "None"}

# Other Allergy:
# {profile.other_allergy or "None"}

# Dietary Preference:
# {profile.dietary_preference or "None"}

# Medical Conditions:
# {', '.join(profile.medical_conditions) if profile.medical_conditions else "None"}

# Other Medical Condition:
# {profile.other_medical_condition or "None"}
# """

#     prompt = f"""
# You are a food label analysis expert.

# Analyze ONLY the food label text provided below.
# Before performing any analysis, first determine whether the OCR text comes from a packaged food product.

# If the OCR text does NOT represent a packaged food label (for example a selfie, screenshot, terminal window, document, receipt, handwritten notes, landscape, or any unrelated image), return ONLY this JSON:

# {{
# "error": "The uploaded image does not appear to be a packaged food label. Please upload a clear image of a packaged food package."
# }}

# Do not attempt any analysis if the uploaded text is unrelated to a packaged food label.
# The provided text is extracted using OCR from one or more images of the food package. The OCR output may contain minor spelling mistakes caused by stylized fonts, curved packaging, lighting, or image quality. Correct only obvious OCR spelling mistakes when the intended word is clear. Do not invent or guess information that is not supported by the extracted text.

# Use the user's health preferences to personalize the analysis and recommendations whenever applicable. Do not mention a health preference unless it is relevant to the product.

# {health_context}

# Rules:

# - Do not invent or guess information that is not supported by the extracted text.
# - You may correct obvious OCR spelling mistakes when the intended word is clear.
# - If information is missing, return "Not Available".
# - Return ONLY valid JSON.
# - Do not include markdown formatting.
# - Do not wrap the JSON inside ```json blocks.

# Return this JSON format:
# {{
#     "product_name": "",
#     "ingredients": [
#         {{
#             "name": "",
#             "description": ""
#         }}
#     ],
#     "additives": [
#         {{
#             "name": "",
#             "purpose": "",
#             "health_note": ""
#         }}
#     ],
#     "allergens": [],
#     "nutrition_summary": "",
#     "health_concerns": [],
#     "recommendations": []
# }}


# For product_name:

# - Return the full consumer-facing product name as prominently displayed on the package.
# - Include the brand name together with the product name when they appear together as the product's displayed identity.
# - Include a flavour, variant, or style when it is clearly part of the displayed product name.
# - Search across all OCR text from every uploaded image before deciding.
# - If multiple images show different parts of the same package, combine the relevant information from all images to identify the complete product name.
# - Correct obvious OCR spelling mistakes while preserving the actual product name.
# - Do not include taglines, promotional text, marketing claims, descriptions, or unrelated text.
# - Do not infer or append generic food categories such as "Namkeen", "Potato Chips", "Snack", or similar words unless they are clearly part of the displayed product name.
# - Do not return the manufacturer, parent company, marketer, distributor, or FSSAI license holder as the product name when a consumer-facing product name is available.
# - Ignore company names that appear only in manufacturer, marketer, distributor, or licensing information.
# - If only a manufacturer or company name is visible and no consumer-facing product name can be confidently identified, return "Not Available".
# - If only part of the product name is visible, return only the confidently identified portion.
# - Do not invent or infer words that are not supported by the OCR text.
# - If the product name cannot be confidently identified from the extracted text, return "Not Available".

# Examples:

# "Haldiram's Soan Papdi" → "Haldiram's Soan Papdi"

# "Haldiram's Chocolate Soan Papdi" → "Haldiram's Chocolate Soan Papdi"

# "Lay's Classic Salted" → "Lay's Classic Salted"

# "Lay's India's Magic Masala" → "Lay's India's Magic Masala"

# "Kurkure Green Chutney Style" → "Kurkure Green Chutney Style"

# "Bingo Mad Angles" → "Bingo Mad Angles"

# "Pringles Original" → "Pringles Original"

# "PepsiCo ... manufacturer information ... Lay's Classic Salted" → "Lay's Classic Salted"

# "PepsiCo" appearing only in manufacturer information → "Not Available"

# For each ingredient:

# - Return its name.
# - Add a short description explaining its role in the product.

# For each additive:

# - Return the additive exactly as it appears on the label.
# - If it is only a number like 627 or 631, prefix it with "INS ".
#   Example:
#   627 → INS 627
#   631 → INS 631.
# - Mention its purpose (for example: preservative, flavour enhancer, colour).
# - Mention a brief health note if generally known.
# - If no health note is available, return "Not Available".

# For allergens:

# - Return only allergens explicitly present in the label.

# For recommendations:

# - Provide practical advice based on the product, nutritional information, and the user's health preferences.
# - If the product contains an allergen listed in the user's health preferences, clearly warn the user.
# - When a product contains ingredients that match the user's recorded allergies, use wording similar to: "This product contains Wheat and Tomato Powder, both of which match your recorded allergies."
# - If the product conflicts with the user's dietary preference, mention the conflict.
# - If the nutritional content or ingredients may not be suitable for any of the user's medical conditions, briefly explain why.
# - If there are no conflicts with the user's health preferences, mention that it appears suitable based on the available information.
# - Keep each recommendation short and easy to understand.

# Keep all descriptions concise (1–2 sentences).

# The OCR text below is extracted from one or more images of the same food package.

# Different images may contain the front of the package, ingredients, nutrition facts, allergens, or other product information.

# Identify the brand and product name from whichever image contains it. Do not assume the images are in any particular order.

# If multiple images are provided:

# - Search across all extracted OCR text for the product name and brand.
# - The product name is usually displayed in larger or more prominent text than the ingredients.
# - Prefer clearly identifiable product names over generic food categories.

# Food Label Text:

# {ocr_text}
# """

#     try:

#         response = client.models.generate_content(
#             model="gemini-3.6-flash",
#             contents=prompt
#         )

#         response_text = response.text.strip()

#     except Exception as e:

#         print("Gemini Error:", e)

#         return {
#             "error": "AI service is temporarily unavailable. Please try again in a few minutes."
#         }

#     # Remove markdown code fences if Gemini returns them
#     if response_text.startswith("```json"):
#         response_text = response_text.replace("```json", "", 1)

#     if response_text.endswith("```"):
#         response_text = response_text[:-3]

#     response_text = response_text.strip()

#     try:
#         result = json.loads(response_text)

#         if "error" in result:
#            return result

#         return result

#     except json.JSONDecodeError:
#        return {
#           "error": "Failed to parse Gemini response.",
#           "raw_response": response.text,
#         }




















from google import genai
from google.genai import types
from django.conf import settings
import json

from users.models import UserProfile


client = genai.Client(api_key=settings.GEMINI_API_KEY)


def analyze_food_label(ocr_text, user, images):

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

Analyze ONLY the uploaded food package images and the OCR text extracted from those images.

Before performing any analysis, first determine whether the uploaded images and OCR text represent a packaged food product.

Use the uploaded images as the primary visual source for identifying the product and understanding the package.

Use the OCR text as supporting information, especially for ingredients, additives, allergens, nutrition facts, and other small printed details.

If the uploaded images and OCR text do NOT represent a packaged food label
(for example a selfie, screenshot, terminal window, document, receipt,
handwritten notes, landscape, or any unrelated image), return ONLY this JSON:

{{
"error": "The uploaded image does not appear to be a packaged food label. Please upload a clear image of a packaged food package."
}}

Do not attempt any analysis if the uploaded images are unrelated to a packaged food label.

The OCR output may contain minor spelling mistakes caused by stylized fonts,
curved packaging, lighting, or image quality.

Correct only obvious OCR spelling mistakes when the intended word is clear.

Do not invent or guess information that is not supported by the uploaded images or OCR text.

Use the user's health preferences to personalize the analysis and recommendations whenever applicable.

Do not mention a health preference unless it is relevant to the product.

{health_context}

Rules:

- Do not invent or guess information that is not supported by the uploaded images or OCR text.
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

- Return the full consumer-facing product name as prominently displayed on the package.
- Include the brand name together with the product name when they appear together as the product's displayed identity.
- Include a flavour, variant, or style when it is clearly part of the displayed product name.
- Search across all uploaded images and all OCR text from every uploaded image before deciding.
- If multiple images show different parts of the same package, combine the relevant information from all images to identify the complete product name.
- Correct obvious OCR spelling mistakes while preserving the actual product name.
- Do not include taglines, promotional text, marketing claims, descriptions, or unrelated text.
- Do not infer or append generic food categories such as "Namkeen", "Potato Chips", "Snack", or similar words unless they are clearly part of the displayed product name.
- Do not return the manufacturer, parent company, marketer, distributor, or FSSAI license holder as the product name when a consumer-facing product name is available.
- Ignore company names that appear only in manufacturer, marketer, distributor, or licensing information.
- If only a manufacturer or company name is visible and no consumer-facing product name can be confidently identified, return "Not Available".
- If only part of the product name is visible, return only the confidently identified portion.
- Do not invent or infer words that are not supported by the uploaded images or OCR text.
- If the product name cannot be confidently identified from the uploaded images or OCR text, return "Not Available".

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

For each additive:

- Return the additive exactly as it appears on the label.
- If it is only a number like 627 or 631, prefix it with "INS ".

Examples:
627 → INS 627
631 → INS 631

- Mention its purpose, for example: preservative, flavour enhancer, colour.
- Mention a brief health note if generally known.
- If no health note is available, return "Not Available".

For allergens:

- Return only allergens explicitly present in the label.

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

The uploaded images show one or more views of the same food package.

Use all uploaded images together.

The images may show the front, back, ingredients, nutrition facts, allergens, manufacturer information, or other parts of the package.

The OCR text below is supporting text extracted from those images.

Food Label Text:

{ocr_text}
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