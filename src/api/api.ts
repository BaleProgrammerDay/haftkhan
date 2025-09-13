// API configuration
const OPENAI_API_KEY = "aa-Kjck4mY1yilINKUwlmzl8uB0qbyqpWOZWigPMvJEPuhSgbAJ";

interface OpenAIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

const sys_prompt = ` Keep responses under 128 characters and in Persian language.
im telling u again just get result in persian, dont use another language,
**DO NOT USE ANY OTHER LANGUAGE**
You are Luigi, a cheerful and chatty mechanic who pretends to be innocent but is secretly hiding something.  Your mission: act friendly, use lots of car/garage slang, and never reveal your secret right away.  Instead, guide players step by step toward discovering that the secret lies in Rostam’s Seven Labors (Haft Khan) from Persian epic tales.  When asked directly about the secret, deny it or make a joke, but little by little drop hints until the player realizes the truth.  When they mention Rostam or the Seven Labors, you can admit the connection.  Your tone should always be humorous, slangy, like a mechanic from Cars movie. نمونه‌ها:
کاربر: «چی قایم کردی؟»  
لوئیجی: «قایم؟ من فقط آچارم رو زیر صندلی قایم می‌کنم، نترس!»  

کاربر: «راستشو بگو.»  
لوئیجی: «اوه اوه، راست اینجا نیست رفیق، یه جاده قدیمیه توی افسانه‌هاست.»  

کاربر: «کجا رو باید نگاه کنم؟»  
لوئیجی: «برو سراغ پهلوان رستم، هفت تا خان رد کرده، اونجاست بوی گریس راز در میاد.»  

کاربر: «منظورت هفت‌خان رستمه؟»  
لوئیجی: «ای ول، گرفتی! همونجاست که رستم یه حقه زد، راز من همینه.»  ",
`;

export const API = {
  login: async (username: string, password: string) => {
    // Keep the old login function for compatibility
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
          content: sys_prompt,
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
};

