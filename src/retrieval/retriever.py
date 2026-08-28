from src.embeddings.embedder import Embedder
from src.vector_store.faiss_store import FAISSStore


class Retriever:

    def __init__(self, knowledge_base="knowledge_base"):

        print("Loading knowledge base...")

        self.embedder = Embedder()

        self.vector_store = FAISSStore.load(knowledge_base)

        print("Knowledge base loaded successfully!")

    def search(self, question, k=5):
        """
        Search the knowledge base for the most relevant chunks.
        """

        print("\nEmbedding question...")

        question_embedding = self.embedder.embed(question)

        print("Searching FAISS...")

        results = self.vector_store.search(question_embedding, k)

        return results

if __name__ == "__main__":

    retriever = Retriever()

    question = "How are prion diseases transmitted?"

    results = retriever.search(question)

    print("\nTop Results\n")

    for i, result in enumerate(results, start=1):

        print(f"Result {i}")
        print("-" * 40)

        print(result["text"][:300])

        print()