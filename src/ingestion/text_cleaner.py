import re
from collections import Counter


def clean_text(text):
    """
    Clean extracted PDF text while preserving useful sentence structure
    and removing common PDF artifacts.
    """

    # Normalize line endings
    text = text.replace("\r\n", "\n")
    text = text.replace("\r", "\n")

    # Remove hyphenation caused by PDF line wrapping.
    # Example:
    # neurode-
    # generative
    # -> neurodegenerative
    text = re.sub(r"-\n\s*", "", text)

    # Replace tabs with spaces
    text = text.replace("\t", " ")

    # Remove isolated page numbers.
    # Examples:
    # "42"
    # " 42 "
    text = re.sub(r"(?m)^\s*\d+\s*$", "", text)

    # Remove common page-number + author/header combinations.
    # Example:
    # "2\nS.B. Prusiner"
    text = re.sub(
        r"(?m)^\s*\d+\s*\n\s*[A-Z][A-Za-z.\- ]{2,40}\s*$",
        "",
        text
    )

    # Collapse excessive spaces within lines
    text = re.sub(r"[ ]{2,}", " ", text)

    # Remove spaces at the beginning/end of lines
    text = re.sub(r"(?m)^[ ]+|[ ]+$", "", text)

    # Preserve blank lines
    text = re.sub(r"\n[ ]*\n+", "\n\n", text)

    # Remove spaces around paragraph breaks
    text = re.sub(r" *\n\n *", "\n\n", text)

    return text.strip()