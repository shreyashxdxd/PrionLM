from sentence_transformers import SentenceTransformer


class Embedder:
    def __init__(self, model_name="BAAI/bge-small-en-v1.5"):
        """
        Load the embedding model.
        """
        print("Loading embedding model...")
        self.model = SentenceTransformer(model_name)
        print("Model loaded successfully!")

    def embed(self, text):
        """
        Generate an embedding for a single text.
        """
        return self.model.encode(text)

    def embed_batch(self, texts):
        """
        Generate embeddings for multiple texts.
        """
        return self.model.encode(texts)

if __name__ == "__main__":

    embedder = Embedder()

    text = "Prions are infectious proteins."

    embedding = embedder.embed(text)

    print(f"Embedding Dimension: {len(embedding)}")

    print()

    print("First 10 values:")

    print(embedding[:10])