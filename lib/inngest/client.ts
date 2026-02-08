import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "marketlens",
  ai: {
    gemini: {
      apiKey: process.env.GEMINI_KEY,
      // apiSecret: process.env.GEMINI_SECRET,
    },
  },
});
