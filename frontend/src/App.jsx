import { useState } from "react";

import DNAAnimation from "./components/DNAAnimation";
import PromptPage from "./components/PromptPage";
import AnswerPage from "./components/AnswerPage";

import "./App.css";

function App() {
  const [page, setPage] = useState("home");
  const [prompt, setPrompt] = useState("");

  const handleTryPrionLM = () => {
    setPage("query");
  };

  const handleSubmit = () => {
    if (!prompt.trim()) return;

    setPage("answer");
  };

  const handleAskAgain = () => {
    setPrompt("");
    setPage("query");
  };

  if (page === "query") {
    return (
      <PromptPage
        prompt={prompt}
        setPrompt={setPrompt}
        onSubmit={handleSubmit}
      />
    );
  }

  if (page === "answer") {
    return (
      <AnswerPage
        prompt={prompt}
        onAskAgain={handleAskAgain}
      />
    );
  }

  return (
    <main className="hero">

      <div className="hero-atmosphere" />

      <div className="dna-background">
        <DNAAnimation />
      </div>

      <div className="hero-content">

        <div className="brand">
          <span className="brand-prion">
            Prion
          </span>

          <span className="brand-lm">
            LM
          </span>
        </div>

        <p className="tagline">
          A specialized AI system for prion disease research
        </p>

        <button
          className="try-button"
          onClick={handleTryPrionLM}
        >
          <span>Try PrionLM</span>
          <span className="arrow">→</span>
        </button>

      </div>

    </main>
  );
}

export default App;