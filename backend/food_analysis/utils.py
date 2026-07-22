import easyocr

# Initialize the OCR reader
reader = easyocr.Reader(['en'])

def extract_text_from_image(image_path):
    """
    Extracts text from an image using EasyOCR.
    """
    results = reader.readtext(image_path, detail=0)

    extracted_text = " ".join(results)

    return extracted_text

import re

def clean_extracted_text(text):
    """
    Cleans OCR extracted text by removing extra spaces and unwanted characters.
    """

    # Replace multiple spaces/newlines with a single space
    text = re.sub(r"\s+", " ", text)

    # Remove unnecessary leading/trailing spaces
    text = text.strip()

    return text