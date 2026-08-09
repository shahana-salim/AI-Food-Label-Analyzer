import easyocr
import re
import tempfile
from PIL import Image, ImageEnhance

# Initialize the OCR reader
reader = easyocr.Reader(["en"])


def extract_text_from_image(image_file):
    """
    Extracts text from an uploaded image using EasyOCR
    with basic image preprocessing and rotation handling.
    """

    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp:

        for chunk in image_file.chunks():
            temp.write(chunk)

        temp_path = temp.name

    # Open and preprocess image
    image = Image.open(temp_path).convert("RGB")

    # Increase image size to help OCR detect small text
    width, height = image.size
    # image = image.resize((width * 2, height * 2), Image.Resampling.LANCZOS)

    # Improve contrast slightly
    image = ImageEnhance.Contrast(image).enhance(1.3)

    # Save processed image
    processed_path = temp_path.replace(".jpg", "_processed.jpg")
    image.save(processed_path)

    # OCR with rotation handling
    # results = reader.readtext(
    #     processed_path,
    #     detail=0,
    #     rotation_info=[90, 180, 270]
    # )

    results = reader.readtext(processed_path, detail=0)

    extracted_text = " ".join(results)

    return extracted_text


def clean_extracted_text(text):
    """
    Cleans OCR extracted text by removing extra spaces
    and unwanted characters.
    """

    # Replace multiple spaces/newlines with a single space
    text = re.sub(r"\s+", " ", text)

    # Remove unnecessary leading/trailing spaces
    text = text.strip()

    return text
