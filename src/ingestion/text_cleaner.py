import re


def clean_text(text):
    """
    Cleans extracted PDF text while preserving paragraphs.
    """

    # Fix words split across lines
    text = re.sub(r'-\n', '', text)

    # Preserve paragraph breaks
    text = re.sub(r'\n\s*\n', '<PARAGRAPH>', text)

    # Replace remaining newlines with spaces
    text = re.sub(r'\n', ' ', text)

    # Remove multiple spaces
    text = re.sub(r'\s+', ' ', text)

    # Restore paragraphs
    text = text.replace('<PARAGRAPH>', '\n\n')

    return text.strip()