import re


def split_sentences(text):
    """
    Split text into sentences while avoiding common scientific
    abbreviations and decimal numbers.
    """

    # Protect common abbreviations
    abbreviations = [
        "e.g.", "i.e.", "etc.", "et al.",
        "Fig.", "Figs.", "Dr.", "Mr.", "Mrs.",
        "vs.", "approx."
    ]

    for abbr in abbreviations:
        text = text.replace(abbr, abbr.replace(".", "<DOT>"))

    # Protect decimal numbers
    text = re.sub(r"(\d)\.(\d)", r"\1<DOT>\2", text)

    # Split after sentence-ending punctuation
    sentences = re.split(r"(?<=[.!?])\s+", text)

    # Restore protected dots
    sentences = [
        sentence.replace("<DOT>", ".").strip()
        for sentence in sentences
        if sentence.strip()
    ]

    return sentences


def chunk_text(text, chunk_size=300, overlap=50):
    """
    Create chunks of approximately chunk_size words while
    keeping complete sentences together.

    Chunks overlap using complete sentences.
    """

    sentences = split_sentences(text)

    chunks = []
    current_sentences = []
    current_words = 0

    for sentence in sentences:

        sentence_words = sentence.split()
        sentence_length = len(sentence_words)

        # Add sentence if it fits
        if current_words + sentence_length <= chunk_size:

            current_sentences.append(sentence)
            current_words += sentence_length

        else:

            # Save current chunk
            if current_sentences:
                chunks.append(" ".join(current_sentences))

            # Build overlap from the end of the previous chunk
            overlap_sentences = []
            overlap_words = 0

            for previous_sentence in reversed(current_sentences):

                previous_length = len(previous_sentence.split())

                if overlap_words + previous_length <= overlap:
                    overlap_sentences.insert(0, previous_sentence)
                    overlap_words += previous_length
                else:
                    break

            current_sentences = overlap_sentences + [sentence]
            current_words = overlap_words + sentence_length

    # Save final chunk
    if current_sentences:
        chunks.append(" ".join(current_sentences))

    return chunks


if __name__ == "__main__":

    from src.ingestion.pdf_reader import extract_text
    from src.ingestion.text_cleaner import clean_text

    pdf_path = "data/books/Prion Biology and Diseases_removed.pdf"

    text = extract_text(pdf_path)
    cleaned = clean_text(text)

    print("RAW TEXT LENGTH:", len(text))
    print("CLEANED TEXT LENGTH:", len(cleaned))
    print("NEWLINE COUNT:", cleaned.count("\n"))
    print("PARAGRAPH COUNT:", cleaned.count("\n\n"))

    chunks = chunk_text(cleaned)

    print(f"\nTotal Chunks: {len(chunks)}")

    if len(chunks) > 0:
        print("\nChunk 1")
        print("-" * 40)
        print(chunks[0])

    if len(chunks) > 1:
        print("\nChunk 2")
        print("-" * 40)
        print(chunks[1])