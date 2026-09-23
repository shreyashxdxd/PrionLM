from src.retrieval.retriever import Retriever
from src.generator import Generator


class RAG:

    def __init__(self):
        print("Initializing PrionLM...")

        self.retriever = Retriever()
        self.generator = Generator()

        print("PrionLM initialized successfully!")

    def answer(self, question, k=5):
        """
        Retrieve relevant chunks and generate an answer.
        """

        print("\nRetrieving relevant information...")

        results = self.retriever.search(question, k=k)

        # Combine retrieved chunks into context
        context_parts = []

        for i, result in enumerate(results, start=1):
            context_parts.append(
                f"[SOURCE {i}]\n{result['text']}"
            )

        context = "\n\n".join(context_parts)

        print("\n===== CONTEXT SENT TO LLM =====")

        for i, result in enumerate(results, start=1):
            print(f"\n[SOURCE {i}]")
            print(result["text"])

        print("\n===== END CONTEXT =====")

        print("Generating answer...")

        answer = self.generator.generate(
            question,
            context
        )

        return answer


if __name__ == "__main__":

    rag = RAG()

    question = "Types of Prion Diseases"

    answer = rag.answer(question)

    print("\nPRIONLM ANSWER")
    print("=" * 60)
    print(answer)