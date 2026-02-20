"use server";

import { auth } from "../better-auth/Auth";
import { inngest } from "../inngest/client";
import { headers } from "next/headers";

export const signUpWithEmail = async ({
  email,
  password,
  fullName,
  country,
  investmentGoals,
  riskTolerance,
  preferredIndustry,
}: SignUpFormData) => {
  try {
    // console.log("🔍 SignUp data received:", {
    //   email,
    //   password: "***",
    //   fullName,
    //   country,
    //   investmentGoals,
    //   riskTolerance,
    //   preferredIndustry,
    // });

    const response = await (
      await auth
    ).api.signUpEmail({
      body: { email, password, name: fullName },
    });

    // console.log("✅ Auth signup response:", response);
    // console.log("📧 Email verified status:", response?.user?.emailVerified);

    if (response) {
      // if (!response.user.emailVerified) {
      //   // console.log("⚠️ Email not verified, user needs to verify email");
      // }

      // Send welcome email with Inngest
      // console.log("📧 Sending to Inngest with email:", email);
      await inngest.send({
        name: "app/user.created",
        data: {
          email,
          name: fullName,
          country,
          investmentGoals,
          riskTolerance,
          preferredIndustry,
        },
      });
      // console.log("✅ Inngest event sent");

      // Redirect to verification page
      return {
        success: true,
      };
    }

    return { success: false, error: "No response from signup" };
  } catch (error) {
    console.log("❌ Signup failed", error);
    return { success: false, error: "Sign up failed: " + error };
  }
};

export const signInWithEmail = async ({ email, password }: SignInFormData) => {
  try {
    await (
      await auth
    ).api.signInEmail({
      body: { email, password },
    });

    return { success: true };
  } catch (error) {
    // console.log("Sign in failed", error);
    return { success: false, error: "Sign in failed" + error };
  }
};

export const signOut = async () => {
  try {
    await (await auth).api.signOut({ headers: await headers() });
    return { success: true };
  } catch (error) {
    // console.log("❌ Signup failed", error);
    return { success: false, error: "Sign up failed: " + error };
  }
};
