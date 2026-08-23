import DNAAnimation from "./DNAAnimation";

function AnswerPage({ prompt, onAskAgain }) {
  return (
    <main className="answer-page">
      <div className="answer-dna">
        <DNAAnimation />
      </div>

      <header className="app-header">
        <div className="mini-logo">
          Prion<span>LM</span>
        </div>
      </header>

      <section className="answer-content">

        <div className="current-prompt">
          <span>{prompt}</span>
        </div>

        <article className="answer-card">
          <div className="answer-heading">
            Answer
          </div>

          <div className="answer-text">
            <p>
              This is where PrionLM's generated answer will
              appear.
            </p>

            <p>
              The final version will retrieve relevant
              scientific knowledge from the PrionLM knowledge
              base and use the language model to generate a
              grounded response.
            </p>
          </div>
        </article>

        <button
          className="ask-again-button"
          onClick={onAskAgain}
        >
          Ask again
          <span>→</span>
        </button>

      </section>
    </main>
  );
}

export default AnswerPage;