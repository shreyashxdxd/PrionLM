from sentence_transformers import SentenceTransformer


class Embedder:

    def __init__(self, model_name="BAAI/bge-small-en-v1.5"):

        print("Loading embedding model...")

        self.model = SentenceTransformer(model_name)

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