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

export type {
  AttemptHistory,
  UserResponse,
  SubmitAnswerRequest,
  SubmitAnswerResponse,
};

