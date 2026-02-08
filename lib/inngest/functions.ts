import { sendWelcomeEmail } from "../nodemailer";
import { inngest } from "./client";
import { PERSONALIZED_WELCOME_EMAIL_PROMPT } from "./prompts";

export const sendSignUpEmail = inngest.createFunction(
  { id: "send-signup-email" },
  { event: "app/user.created" },
  async ({ event, step }) => {
    const userProfile = `- country: ${event.data.country}
    - Investment goals: ${event.data.investmentGoals}
    - Risk Tolerance: ${event.data.riskTolerance}
    - Preferred Industry: ${event.data.preferredIndustry}`;
    // TODO: Implement email sending logic

    const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace(
      "{{user_profile}}",
      userProfile,
    );

    const response = await step.ai.infer("generate-welcome-intro", {
      model: step.ai.models.gemini({ model: "gemini-2.0-flash-lite" }),
      body: {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      },
    });

    await step.run("send-email", async () => {
      const candidates = response.candidates;
      const firstCandidate = candidates ? candidates[0] : null;
      const content = firstCandidate ? firstCandidate.content : null;
      const parts = content ? content.parts : null;
      const part = parts ? parts[0] : null;

      const introText =
        part && "text" in part
          ? part.text
          : "Welcome to MarketLens. We have the tools to track your investments effectively and make informed decisions!";

      const {
        data: { email, name },
      } = event;

      return await sendWelcomeEmail({ email, name, intro: introText });
    });
    return {
      success: true,
      message: "Welcome email sent successfully",
    };
  },
);
