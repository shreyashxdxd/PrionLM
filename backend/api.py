from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from src.rag import RAG


app = FastAPI(title="PrionLM API")


# Allow the React frontend to communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    question: str


print("Loading PrionLM RAG pipeline...")
rag = RAG()
print("PrionLM API ready!")


@app.get("/api/status")
def status():
    return {
        "status": "online",
        "service": "PrionLM",
        "mode": "local"
    }


@app.post("/api/chat")
def chat(request: ChatRequest):

    question = request.question.strip()

    if not question:
        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty."
        )

    try:
        print(f"\nUser question: {question}")

        # Retrieve relevant documents
        results = rag.retriever.search(
            question,
            k=5
        )

        # Build context for SmolLM
        context_parts = []

        for i, result in enumerate(results, start=1):
            context_parts.append(
                f"[SOURCE {i}]\n{result['text']}"
            )

        context = "\n\n".join(context_parts)

        # Generate answer using local SmolLM server
        answer = rag.generator.generate(
            question,
            context
        )

        # Return answer + retrieved sources to frontend
        sources = []

        for i, result in enumerate(results, start=1):
            sources.append({
                "id": i,
                "text": result.get("text", ""),
                "metadata": {
                    key: value
                    for key, value in result.items()
                    if key != "text"
                }
            })

        return {
            "answer": answer,
            "sources": sources
        }

    except Exception as e:

        print("\nPrionLM API ERROR:")
        print(e)

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )