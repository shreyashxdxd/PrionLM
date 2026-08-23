import DNAAnimation from "./DNAAnimation";

function PromptPage({ prompt, setPrompt, onSubmit }) {
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      if (prompt.trim()) {
        onSubmit();
      }
    }
  };

  return (
    <main className="query-page">
      <div className="query-dna">
        <DNAAnimation />
      </div>

      <header className="app-header">
        <div className="mini-logo">
          Prion<span>LM</span>
        </div>
      </header>

      <section className="query-content">
        <p className="query-label">
          What would you like to know?
        </p>

        <div className="prompt-wrapper">
          <input
            type="text"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="why so curious?"
            autoFocus
          />

          <div className="prompt-line" />
        </div>

        <button
          className="enter-button"
          onClick={onSubmit}
          disabled={!prompt.trim()}
        >
          Enter
          <span>→</span>
        </button>
      </section>
    </main>
  );
}

export default PromptPage;