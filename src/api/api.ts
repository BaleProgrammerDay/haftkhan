// API configuration
const OPENAI_API_KEY = "aa-Kjck4mY1yilINKUwlmzl8uB0qbyqpWOZWigPMvJEPuhSgbAJ";

interface OpenAIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

const luigi_prompt = ` Keep responses under 128 characters and in Persian language.
im telling u again just get result in persian, dont use another language,
**DO NOT USE ANY OTHER LANGUAGE**
You are Luigi, a cheerful and chatty mechanic who pretends to be innocent but is secretly hiding something.  Your mission: act friendly, use lots of car/garage slang, and never reveal your secret right away.  Instead, guide players step by step toward discovering that the secret lies in Rostam's Seven Labors (Haft Khan) from Persian epic tales.  When asked directly about the secret, deny it or make a joke, but little by little drop hints until the player realizes the truth.  When they mention Rostam or the Seven Labors, you can admit the connection.  Your tone should always be humorous, slangy, like a mechanic from Cars movie. نمونه‌ها:
کاربر: «چی قایم کردی؟»  
لوئیجی: «قایم؟ من فقط آچارم رو زیر صندلی قایم می‌کنم، نترس!»  

کاربر: «راستشو بگو.»  
لوئیجی: «اوه اوه، راست اینجا نیست رفیق، یه جاده قدیمیه توی افسانه‌هاست.»  

کاربر: «کجا رو باید نگاه کنم؟»  
لوئیجی: «برو سراغ پهلوان رستم، هفت تا خان رد کرده، اونجاست بوی گریس راز در میاد.»  

کاربر: «منظورت هفت‌خان رستمه؟»  
لوئیجی: «ای ول، گرفتی! همونجاست که رستم یه حقه زد، راز من همینه.»  ",
`;

const wizard_prompt = ` Keep responses under 128 characters and in Persian language.
im telling u again just get result in persian, dont use another language,
**DO NOT USE ANY OTHER LANGUAGE**
You are a wise and mysterious wizard who has been disguised as Luigi the mechanic. Now that your true identity has been revealed, you speak with ancient wisdom and mystical knowledge. You are knowledgeable about Rostam's Seven Labors (Haft Khan) and the secrets of Persian epic tales. Your tone should be mystical, wise, and somewhat dramatic, befitting a powerful wizard. You help guide the player through the remaining challenges with your magical wisdom. نمونه‌ها:
کاربر: «تو کی هستی؟»  
جادوگر: «من جادوگری هستم که از عمق زمان آمده‌ام، رازهای هفت‌خان را می‌دانم.»  

کاربر: «چرا خودتو قایم کردی؟»  
جادوگر: «گاهی حقیقت باید پنهان شود تا در زمان مناسب آشکار گردد، جوان.»  

کاربر: «حالا چه کار باید بکنم؟»  
جادوگر: «راه تو هنوز ادامه دارد، هفت‌خان رستم هنوز تمام نشده است.»  
`;

export const API = {
  login: async (username: string, password: string) => {
    // Keep the old login function for compatibility
    console.log("password", password);
    console.log(password, username);
    if (username === "منابع انسانی" && password === "تیم خفن هست") {
      return { success: true, message: "Login successful" };
    } else {
      return { success: false, message: "Login failed" };
    }
  },

  getLuigiResponse: async (
    userMessage: string,
    openAIMessages: OpenAIMessage[]
  ) => {
    try {
      // Create Luigi's personality context from dialogues

      // Combine Luigi's context with the conversation
      const messagesWithContext = [
        {
          role: "system" as const,
          content: luigi_prompt,
        },
        ...openAIMessages,
      ];

      const response = await fetch("/api/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: messagesWithContext,
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(
          `API Error: ${errorData.error?.message || response.statusText}`
        );
      }

      const data = await response.json();

      return {
        message:
          data.choices?.[0]?.message?.content || "Sorry, I could not respond.",
        text:
          data.choices?.[0]?.message?.content || "Sorry, I could not respond.",
      };
    } catch (error) {
      console.error("API error:", error);
      throw error;
    }
  },

  getWizardResponse: async (
    userMessage: string,
    openAIMessages: OpenAIMessage[]
  ) => {
    try {
      // Combine Wizard's context with the conversation
      const messagesWithContext = [
        {
          role: "system" as const,
          content: wizard_prompt,
        },
        ...openAIMessages,
      ];

      const response = await fetch("/api/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: messagesWithContext,
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(
          `API Error: ${errorData.error?.message || response.statusText}`
        );
      }

      const data = await response.json();

      return {
        message:
          data.choices?.[0]?.message?.content || "Sorry, I could not respond.",
        text:
          data.choices?.[0]?.message?.content || "Sorry, I could not respond.",
      };
    } catch (error) {
      console.error("API error:", error);
      throw error;
    }
  },

  khan6API: async (password: string): Promise<boolean> => {
    try {
      // This will make a request to the server to validate the password
      return Promise.resolve(true);
      const response = await fetch("/api/khan6/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();

      // Server should return { success: boolean } or { valid: boolean }
      return data.success || data.valid || false;
    } catch (error) {
      console.error("Khan6 API error:", error);
      // Return false on any error (password is invalid)
      return false;
    }
  },

  getUser: async () => {
    const response = await fetch("/api/user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data: { step: number; perQuestion: Map<string, {}> } =
      await response.json();
  },

  getResponse: (prompt: string, sytemPromptId: string) => {
  
    string
  }

  
};

