"use server";

import { success } from "better-auth";
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
    const response = await (
      await auth
    ).api.signUpEmail({
      body: { email, password, name: fullName },
    });
    if (response) {
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
    }

    return { success: true };
  } catch (error) {
    console.log("Signup failed", error);
    return { success: false, error: "Sign up failed" + error };
  }
};

export const signInWithEmail = async ({ email, password }: SignInFormData) => {
  try {
    const response = await (
      await auth
    ).api.signInEmail({
      body: { email, password },
    });

    return { success: true };
  } catch (error) {
    console.log("Sign in failed", error);
    return { success: false, error: "Sign in failed" + error };
  }
};

export const signOut = async () => {
  try {
    await (await auth).api.signOut({ headers: await headers() });
    return { success: true };
  } catch (error) {
    console.log("Sign out failed", error);
    return { success: false, error: "Sign out failed" + error };
  }
};
