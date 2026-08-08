def chunk_text(text, chunk_size=300, overlap=50):
    """
    Split text into overlapping chunks.

    Args:
        text (str): Cleaned text.
        chunk_size (int): Number of words per chunk.
        overlap (int): Shared words between consecutive chunks.

    Returns:
        list: List of chunks.
    """

    words = text.split()

    chunks = []

    step = chunk_size - overlap

    for i in range(0, len(words), step):

        chunk = words[i:i + chunk_size]

        if not chunk:
            break

        chunks.append(" ".join(chunk))

    return chunks