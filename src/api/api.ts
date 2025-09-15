import {
  SubmitAnswerRequest,
  SubmitAnswerResponse,
  UserResponse,
  PromptRequest,
  PromptResponse,
  PromptErrorResponse,
} from "./types";

const POST_REQUEST = async (url: string, body: any) => {
  return await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
};

const GET_REQUEST = async (url: string) => {
  return await fetch(url, {
    method: "GET",
  });
};

export const API = {
  getUser: async (): Promise<UserResponse | null> => {
    const request = await GET_REQUEST("/api/user");

    const data = await request.json();

    if (data.username) {
      return data as UserResponse;
    } else {
      return null;
    }
  },
  login: async (username: string, password: string) => {
    const request = await POST_REQUEST("/api/login", { username, password });

    const data = await request.json();

    if (data.ok) {
      return { success: true, message: "Login successful" };
    } else {
      return { success: false, message: "Login failed" };
    }
  },
  submitAnswer: async (requestData: SubmitAnswerRequest) => {
    const request = await POST_REQUEST("/api/submit_answer", requestData);

    const data = await request.json();

    return data as SubmitAnswerResponse;
  },
  prompt: async (prompt: PromptRequest) => {
    try {
      const request = await POST_REQUEST("/api/prompt", prompt);

      const data: PromptResponse | PromptErrorResponse = await request.json();

      if ("ok" in data && !data.ok) {
        throw new Error(data.description);
      } else {
        return data as PromptResponse;
      }
    } catch (error) {
      console.error("API error:", error);
      throw error;
    }
  },
};

