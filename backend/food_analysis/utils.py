import easyocr
import re
import tempfile

# Initialize the OCR reader
reader = easyocr.Reader(["en"])


def extract_text_from_image(image_file):
    """
    Extracts text from an uploaded image using EasyOCR.
    """

    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp:

        for chunk in image_file.chunks():
            temp.write(chunk)

        temp_path = temp.name

    results = reader.readtext(temp_path, detail=0)

    extracted_text = " ".join(results)

    return extracted_text


def clean_extracted_text(text):
    """
    Cleans OCR extracted text by removing extra spaces and unwanted characters.
    """

    # Replace multiple spaces/newlines with a single space
    text = re.sub(r"\s+", " ", text)

    # Remove unnecessary leading/trailing spaces
    text = text.strip()

    return text