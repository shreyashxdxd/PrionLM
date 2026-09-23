import { ChatRequest, ChatResponse } from '../types';

/**
 * Base URL for the local Python RAG backend.
 * Configured via Vite environment variable VITE_API_URL, defaulting to http://localhost:8000.
 */
export const API_BASE_URL: string =
  (import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:8000';

/**
 * Communicates with the local Python RAG server endpoint:
 * POST http://localhost:8000/api/chat
 *
 * @param question - The user's question about prion biology
 * @returns Promise<ChatResponse> - The generated answer and retrieved sources
 */
export async function askPrionLM(question: string): Promise<ChatResponse> {
  const trimmed = question.trim();
  if (!trimmed) {
    throw new Error('Question cannot be empty');
  }

  const endpoint = `${API_BASE_URL}/api/chat`;

  try {
    const payload: ChatRequest = { question: trimmed };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let errorDetail = `Server responded with status ${response.status}`;
      try {
        const errorJson = await response.json();
        if (errorJson?.detail) {
          errorDetail = typeof errorJson.detail === 'string' ? errorJson.detail : JSON.stringify(errorJson.detail);
        } else if (errorJson?.message) {
          errorDetail = errorJson.message;
        }
      } catch {
        // Fallback to status text
        if (response.statusText) {
          errorDetail = response.statusText;
        }
      }
      throw new Error(errorDetail);
    }

    const data = (await response.json()) as ChatResponse;

    return {
      answer: data.answer || '',
      sources: Array.isArray(data.sources) ? data.sources : [],
    };
  } catch (err: unknown) {
    if (err instanceof TypeError && err.message.toLowerCase().includes('fetch')) {
      throw new Error(
        `Unable to reach local backend at ${API_BASE_URL}. Please ensure your Python FastAPI server is running on http://localhost:8000.`
      );
    }
    if (err instanceof Error) {
      throw err;
    }
    throw new Error('An unknown error occurred while communicating with the local RAG backend.');
  }
}
