from pathlib import Path

from src.ingestion.pdf_reader import extract_text
from src.ingestion.text_cleaner import clean_text
from src.ingestion.chunker import chunk_text
from src.embeddings.embedder import Embedder
from src.vector_store.faiss_store import FAISSStore


def main():

    books_path = Path("data/books")

    pdf_files = list(books_path.glob("*.pdf"))

    print(f"Found {len(pdf_files)} books.\n")

    embedder = Embedder()
    vector_store = None

    for pdf in pdf_files:

        print(f"\nProcessing: {pdf.name}")

        text = extract_text(str(pdf))

        cleaned = clean_text(text)

        chunks = chunk_text(cleaned)

        print(f"Chunks Created: {len(chunks)}")

        embeddings = embedder.embed_batch(chunks)
        if vector_store is None:
            vector_store = FAISSStore(embeddings.shape[1])

        print(f"Embeddings Generated: {len(embeddings)}")
        metadata = []

        for i, chunk in enumerate(chunks):

            metadata.append(
                {
                    "source": pdf.name,
                    "chunk_id": i,
                    "text": chunk
                }
            )

        vector_store.add(embeddings, metadata)

        print("Added to FAISS.")

    if vector_store is not None:
        vector_store.save("knowledge_base")

        print("\nKnowledge base saved successfully!")


if __name__ == "__main__":
    main()