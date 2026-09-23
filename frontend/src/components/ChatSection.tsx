import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, CornerDownLeft, Loader2, AlertCircle, RefreshCw, FileText, Check, Copy } from 'lucide-react';
import { askPrionLM, API_BASE_URL } from '../api/prionlm';
import { ChatResponse, ChatSource } from '../types';

interface QnAEntry {
  question: string;
  answer?: string;
  sources?: ChatSource[];
  error?: string;
}

export const ChatSection: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [currentQnA, setCurrentQnA] = useState<QnAEntry | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const answerSectionRef = useRef<HTMLDivElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [question]);

  // Scroll into answer when query is submitted
  useEffect(() => {
    if (currentQnA && answerSectionRef.current) {
      answerSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentQnA, isLoading]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = question.trim();
    if (!trimmed || isLoading) return;

    setIsLoading(true);
    setCurrentQnA({ question: trimmed });

    try {
      const response: ChatResponse = await askPrionLM(trimmed);
      setCurrentQnA({
        question: trimmed,
        answer: response.answer,
        sources: response.sources || [],
      });
      setQuestion('');
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Unable to communicate with the local Python RAG server.';
      setCurrentQnA({
        question: trimmed,
        error: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleReset = () => {
    setCurrentQnA(null);
    setQuestion('');
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-8 flex flex-col items-center">
      {/* Homepage Title & Subheading (shown prominently when no answer yet, or compact above) */}
      {!currentQnA && (
        <div className="text-center space-y-4 mb-8 sm:mb-12">
          {/* Large Title: PrionLM */}
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tight text-white">
            Prion<span className="text-sky-400">LM</span>
          </h1>

          {/* Subheading: Exact required text */}
          <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto font-normal leading-relaxed">
            A specialized prion biology-oriented AI assistant trained on medical researches and scientific literature
          </p>
        </div>
      )}

      {/* Large Question / Input Area in Center */}
      <div className="w-full">
        <form onSubmit={handleSubmit} className="relative w-full">
          <div className="relative flex flex-col rounded-2xl border border-slate-800 bg-slate-900/80 p-3 shadow-2xl backdrop-blur-xl transition focus-within:border-sky-500/50 focus-within:ring-1 focus-within:ring-sky-500/30">
            <textarea
              ref={textareaRef}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question about prion biology..."
              rows={2}
              className="w-full resize-none bg-transparent px-3 py-2 text-base sm:text-lg text-slate-100 placeholder-slate-500 focus:outline-none leading-relaxed"
            />

            {/* Bottom toolbar with Ask / Arrow button */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 px-2 text-xs text-slate-500">
              <span className="hidden sm:inline">
                Backend: <code className="text-sky-400/90 font-mono">{API_BASE_URL}</code>
              </span>
              <div className="flex items-center gap-2 ml-auto">
                <span className="hidden sm:inline text-[11px] text-slate-500">Press Enter ↵</span>
                <button
                  type="submit"
                  disabled={!question.trim() || isLoading}
                  className="flex items-center gap-1.5 rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400 disabled:opacity-30 disabled:cursor-not-allowed transition"
                  title="Ask PrionLM"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Thinking...</span>
                    </>
                  ) : (
                    <>
                      <span>Ask</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Answer Section */}
      {currentQnA && (
        <div ref={answerSectionRef} className="w-full mt-10 space-y-6 animate-in fade-in duration-300">
          {/* User's Question */}
          <div className="border-b border-slate-800 pb-4">
            <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">
              Your Question
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
              {currentQnA.question}
            </h2>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center gap-3 py-8 text-sky-400 font-mono text-sm">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Querying local RAG pipeline at {API_BASE_URL}...</span>
            </div>
          )}

          {/* Error Message if backend cannot be reached */}
          {currentQnA.error && !isLoading && (
            <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-5 text-sm text-red-200 space-y-3 backdrop-blur-md">
              <div className="flex items-center gap-2 font-semibold text-red-400">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>Backend Connection Error</span>
              </div>
              <p className="leading-relaxed text-slate-300">{currentQnA.error}</p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => handleSubmit()}
                  className="flex items-center gap-1.5 rounded-lg border border-red-800/80 bg-red-900/40 px-3 py-1.5 text-xs font-medium text-red-200 hover:bg-red-900/60 transition"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Retry Question</span>
                </button>
                <button
                  onClick={handleReset}
                  className="text-xs text-slate-400 hover:text-white underline transition"
                >
                  Clear and ask another question
                </button>
              </div>
            </div>
          )}

          {/* AI Answer */}
          {currentQnA.answer && !isLoading && (
            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/60 pb-2">
                <span className="font-semibold text-sky-400">PrionLM Answer</span>
                <button
                  onClick={() => handleCopy(currentQnA.answer || '')}
                  className="flex items-center gap-1 text-slate-400 hover:text-slate-200 transition"
                  title="Copy answer text"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-sky-400" />
                      <span className="text-sky-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Formatted Text Content */}
              <div className="prose prose-invert max-w-none text-slate-200 space-y-3 text-sm sm:text-base leading-relaxed">
                {renderFormattedAnswer(currentQnA.answer)}
              </div>

              {/* Retrieved Sources Underneath the Answer */}
              {currentQnA.sources && currentQnA.sources.length > 0 && (
                <div className="mt-8 pt-6 border-t border-slate-800/80 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    <FileText className="h-4 w-4 text-sky-400" />
                    <span>Retrieved Sources ({currentQnA.sources.length})</span>
                  </div>

                  <div className="space-y-3">
                    {currentQnA.sources.map((src, index) => (
                      <div
                        key={index}
                        className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 text-xs text-slate-300 backdrop-blur-sm space-y-2"
                      >
                        <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                          <span>Source #{index + 1}</span>
                          {src.metadata && Object.keys(src.metadata).length > 0 && (
                            <span className="truncate max-w-[280px]">
                              {Object.entries(src.metadata)
                                .map(([k, v]) => `${k}: ${String(v)}`)
                                .join(' | ')}
                            </span>
                          )}
                        </div>
                        <p className="leading-relaxed text-slate-300 whitespace-pre-wrap">
                          {src.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ask Another Question button */}
              <div className="pt-6 flex justify-center">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-5 py-2.5 text-sm font-medium text-slate-200 hover:border-sky-500/40 hover:text-white transition shadow-lg"
                >
                  <RefreshCw className="h-4 w-4 text-sky-400" />
                  <span>Ask another question</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Simple Markdown Paragraph & Bold Parser
function renderFormattedAnswer(text: string) {
  const paragraphs = text.split('\n\n');

  return paragraphs.map((para, pIdx) => {
    // Check for headings
    if (para.startsWith('### ')) {
      return (
        <h3 key={pIdx} className="text-base sm:text-lg font-bold text-sky-400 mt-4 mb-2">
          {para.replace('### ', '')}
        </h3>
      );
    }
    if (para.startsWith('#### ')) {
      return (
        <h4 key={pIdx} className="text-sm sm:text-base font-bold text-slate-200 mt-3 mb-1">
          {para.replace('#### ', '')}
        </h4>
      );
    }

    // Horizontal Rule
    if (para.trim() === '---') {
      return <hr key={pIdx} className="border-slate-800 my-3" />;
    }

    // Bullet lists
    if (para.includes('\n* ') || para.startsWith('* ') || para.includes('\n- ') || para.startsWith('- ')) {
      const items = para.split('\n').filter((line) => line.trim().length > 0);
      return (
        <ul key={pIdx} className="list-disc list-inside space-y-1.5 my-2 text-slate-200">
          {items.map((item, iIdx) => {
            const clean = item.replace(/^[\*\-]\s+/, '');
            return (
              <li key={iIdx} className="leading-relaxed">
                {renderInlineFormatting(clean)}
              </li>
            );
          })}
        </ul>
      );
    }

    return (
      <p key={pIdx} className="leading-relaxed">
        {renderInlineFormatting(para)}
      </p>
    );
  });
}

function renderInlineFormatting(text: string) {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={index} className="rounded bg-slate-800 px-1 py-0.5 font-mono text-xs text-sky-300">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}
