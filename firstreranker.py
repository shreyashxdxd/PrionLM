from sentence_transformers import CrossEncoder


class Reranker:

    def __init__(
        self,
        model_name="cross-encoder/ms-marco-MiniLM-L-6-v2"
    ):
        print("Loading reranker model...")

        self.model = CrossEncoder(model_name)

        print("Reranker loaded successfully!")

    def rerank(self, question, results, top_k=5):
        """
        Rerank retrieved chunks based on their relevance
        to the question.
        """

        pairs = [
            (question, result["text"])
            for result in results
        ]

        scores = self.model.predict(pairs)

        ranked_results = []

        for result, score in zip(results, scores):

            result = result.copy()

            result["rerank_score"] = float(score)

            ranked_results.append(result)

        ranked_results.sort(
            key=lambda x: x["rerank_score"],
            reverse=True
        )

        return ranked_results[:top_k]