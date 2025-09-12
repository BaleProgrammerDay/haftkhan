const base_url = "https://api.example.com";

const POST_OPTIONS = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};

const POST_REQUEST = async (url: string, body: { [key in string]: any }) => {
  const _url = `${base_url}${url}`;
  const response = await fetch(_url, {
    ...POST_OPTIONS,
    body: JSON.stringify(body),
  });
  return response.json();
};

export const API = {
  login: async (username: string, password: string) => {
    return await POST_REQUEST("/login", {
      username,
      password,
    });
  },
  getLuigiResponse: async (
    userMessage: string,
    conversationHistory: Array<{ role: "user" | "luigi"; message: string }>
  ) => {
    return Promise.resolve({
      message: "این پیام برای تست است",
    });
    return await POST_REQUEST("/conversation/luigi", {
      userMessage,
      conversationHistory,
    });
  },
};

