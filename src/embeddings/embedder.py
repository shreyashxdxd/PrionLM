from pathlib import Path
from sentence_transformers import SentenceTransformer


class Embedder:

    def __init__(self, model_name=None):

        print("Loading embedding model...")

        model_path = (
            Path(__file__).resolve().parents[2]
            / "models"
            / "bge-small-en-v1.5"
        )

        self.model = SentenceTransformer(
            str(model_path),
            local_files_only=True
        )

        print("Model loaded successfully!")

    def embed(self, text):

        return self.model.encode(
            text,
            normalize_embeddings=True
        )

    def embed_batch(self, texts):

        return self.model.encode(
            texts,
            normalize_embeddings=True
        )


if __name__ == "__main__":

    embedder = Embedder()

    text = "Prions are infectious proteins."

    embedding = embedder.embed(text)

    print(f"Embedding Dimension: {len(embedding)}")

    print("\nFirst 10 values:")

    print(embedding[:10])