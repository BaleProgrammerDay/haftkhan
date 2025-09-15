interface AttemptHistory {
  answer: string;
  at: string;
  correct: boolean;
  question_id: number;
}

interface UserResponse {
  last_solved_question: number;
  per_question: Record<
    number,
    {
      attempt_history: AttemptHistory[];
      prompt_history: string[] | null;
    }
  >;
  total_score: number;
  username: string;
}

interface SubmitAnswerRequest {
  question_id: number;
  answer: string;
}

interface SubmitAnswerResponse {
  ok: boolean;
  description: string;
}

interface PromptRequest {
  user_prompt: string;
  system_prompt_id: number;
}

interface PromptResponse {
  result: string;
}
interface PromptErrorResponse {
  ok: boolean;
  description: string;
}

export type {
  AttemptHistory,
  UserResponse,
  SubmitAnswerRequest,
  SubmitAnswerResponse,
  PromptRequest,
  PromptResponse,
  PromptErrorResponse,
};

