export interface ChatSource {
  text: string;
  metadata?: Record<string, unknown>;
}

export interface ChatRequest {
  question: string;
}

export interface ChatResponse {
  answer: string;
  sources?: ChatSource[];
}

export interface QnAPair {
  id: string;
  question: string;
  answer: string;
  sources: ChatSource[];
  timestamp: string;
}
