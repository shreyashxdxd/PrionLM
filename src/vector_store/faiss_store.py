import faiss
import numpy as np
import json
from pathlib import Path


class FAISSStore:

    def __init__(self, dimension):

        self.index = faiss.IndexFlatL2(dimension)

        self.metadata = []

    def add(self, embeddings, metadata):

        embeddings = np.array(embeddings, dtype=np.float32)

        self.index.add(embeddings)

        self.metadata.extend(metadata)

    def search(self, query_embedding, k=5):
        """
        Search for the k most similar embeddings.
        """

        query_embedding = np.array([query_embedding], dtype=np.float32)

        distances, indices = self.index.search(query_embedding, k)

        results = []

        for idx in indices[0]:

            results.append(self.metadata[idx])

        return results

    def save(self, directory):
        """
        Save the FAISS index and metadata.
        """

        directory = Path(directory)

        directory.mkdir(parents=True, exist_ok=True)

        faiss.write_index(
            self.index,
            str(directory / "faiss.index")
        )

        with open(directory / "metadata.json", "w", encoding="utf-8") as f:
            json.dump(
                self.metadata,
                f,
                indent=4,
                ensure_ascii=False
            )

    @classmethod
    def load(cls, directory):
        """
        Load a FAISS index and metadata from disk.
        """

        directory = Path(directory)

        index = faiss.read_index(
            str(directory / "faiss.index")
        )

        with open(directory / "metadata.json", "r", encoding="utf-8") as f:
            metadata = json.load(f)

        store = cls(index.d)

        store.index = index
        store.metadata = metadata

        return store 

if __name__ == "__main__":

    store = FAISSStore(4)

    embeddings = [
        [1.0, 2.0, 3.0, 4.0],
        [4.0, 3.0, 2.0, 1.0],
        [0.5, 0.5, 0.5, 0.5]
    ]

    metadata = [
        {"text": "Chunk 1"},
        {"text": "Chunk 2"},
        {"text": "Chunk 3"}
    ]

    store.add(embeddings, metadata)

    print("Stored vectors:", store.index.ntotal)

    # Step 2 starts here
    query = [1.0, 2.0, 3.0, 4.0]

    results = store.search(query, k=2)

    print("\nSearch Results:")

    for result in results:
        print(result)

    store.save("knowledge_base")

    loaded_store = FAISSStore.load("knowledge_base")

    print("\nLoaded vectors:", loaded_store.index.ntotal)