from src.embeddings.embedder import Embedder
from src.vector_store.faiss_store import FAISSStore
from src.retrieval.reranker import Reranker


class Retriever:

    def __init__(self, knowledge_base="knowledge_base"):

        print("Loading knowledge base...")

        self.embedder = Embedder()

        self.vector_store = FAISSStore.load(
            knowledge_base
        )

        self.reranker = Reranker()

        print("Knowledge base loaded successfully!")

    def search(self, question, k=20, top_k=5):
        """
        Retrieve candidates using FAISS and then
        rerank them using the cross-encoder.
        """

        print("\nEmbedding question...")

        question_embedding = self.embedder.embed(
            question
        )

        print("Searching FAISS...")

        candidates = self.vector_store.search(
            question_embedding,
            k
        )

        print(f"FAISS returned {len(candidates)} candidates.")

        print("Reranking candidates...")

        results = self.reranker.rerank(
            question,
            candidates,
            top_k
        )

        return results


if __name__ == "__main__":

    retriever = Retriever()

    question = "What is CJD?"

    results = retriever.search(
        question,
        k=20,
        top_k=5
    )

    print("\nTop Results\n")

    for i, result in enumerate(results, start=1):

        print(f"Result {i}")
        print("-" * 40)

        print(
            f"Rerank Score: "
            f"{result['rerank_score']:.4f}"
        )

        print(
            f"Source: "
            f"{result.get('source', 'Unknown')}"
        )

        print(
            f"Chunk ID: "
            f"{result.get('chunk_id', 'Unknown')}"
        )

        print()

        print(result["text"][:500])

        print()