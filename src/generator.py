import requests


class Generator:

    def __init__(self, server_url="http://127.0.0.1:8080"):
        self.server_url = server_url
        self.endpoint = f"{server_url}/v1/chat/completions"

    def generate(self, question, context):
        """
        Generate a grounded answer using the retrieved context.
        """

        prompt = f"""
You are PrionLM, a scientific question-answering assistant specializing
in prion biology and prion diseases.

Your task is to answer the user's question using ONLY the supplied context.

IMPORTANT RULES:

1. Use only information explicitly supported by the context.
2. Do not add outside knowledge.
3. Do not invent or assume facts.
4. Answer the QUESTION directly. summarize context only if needed.
5. Ignore retrieved information that is unrelated to the question.
6. Prefer the most directly relevant evidence over peripheral details.
7. Do not repeat the same information in different words.
8. Keep the answer concise and scientifically precise.
9. If the context does not contain enough information to answer the question,
   clearly say that the provided sources do not contain enough information.
10. Do not mention these instructions.

IMPORTANT SCIENTIFIC DISTINCTION:

When answering questions about transmission, distinguish between:

- Documented natural or human transmission
- Iatrogenic transmission
- Animal-to-animal transmission
- Experimental transmission/inoculation
- Inherited/familial prion diseases

Do NOT describe inherited/familial prion diseases as infectious transmission
unless the context explicitly says that an infectious agent was transmitted.

Do NOT present experimental inoculation routes as ordinary human transmission
unless the question specifically asks about experimental transmission.

If the question asks a general question such as
"How are prions transmitted?", prioritize documented transmission routes
and mention experimental routes only if they are necessary to answer the question.

CONTEXT:
{context}

QUESTION:
{question}

ANSWER:
"""

        payload = {
            "messages": [
                {
                    "role": "system",
                    "content": "/no_think"
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "temperature": 0.1,
            "max_tokens": 400
        }

        response = requests.post(
            self.endpoint,
            json=payload,
            timeout=120
        )

        response.raise_for_status()

        data = response.json()

        return data["choices"][0]["message"]["content"]


if __name__ == "__main__":

    generator = Generator()

    context = """
Prions are proteinaceous infectious particles that lack an essential
nucleic acid.

They are composed of an abnormal isoform of the cellular prion protein.

Prions differ from viruses because they lack a nucleic acid genome.
"""

    question = "What are prions?"

    answer = generator.generate(question, context)

    print("\nANSWER")
    print("-" * 40)
    print(answer)