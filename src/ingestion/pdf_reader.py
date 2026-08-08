import fitz


def extract_text(pdf_path):
    """
    Extracts all text from a PDF.

    Args:
        pdf_path (str): Path to the PDF file.

    Returns:
        str: Extracted text.
    """

    document = fitz.open(pdf_path)

    text = ""

    for page in document:
        text += page.get_text()

    document.close()

    return text