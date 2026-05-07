"use server";

import { EndSessionResult, StartSessionResult } from "@/types";
import { connectToDatabase } from "@/database/mongoose";
import VoiceSession from "@/database/models/voiceSession.model";
import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";

export const startVoiceSession = async (
  bookId: string,
): Promise<StartSessionResult> => {
  try {
    await connectToDatabase();

    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return { success: false, error: "Unauthorized" };
    }

    const { getUserPlan } = await import("@/lib/subscription.server");
    const { PLAN_LIMITS, getCurrentBillingPeriodStart } =
      await import("@/lib/subscription-constants");

    const plan = await getUserPlan();
    const limits = PLAN_LIMITS[plan];
    const billingPeriodStart = getCurrentBillingPeriodStart();

    const mongoSession = await mongoose.startSession();
    mongoSession.startTransaction();

    try {
      const sessionCount = await VoiceSession.countDocuments({
        clerkId,
        billingPeriodStart,
      }).session(mongoSession);

      if (sessionCount >= limits.maxSessionsPerMonth) {
        await mongoSession.abortTransaction();
        const { revalidatePath } = await import("next/cache");
        revalidatePath("/");
        return {
          success: false,
          error: `You have reached the monthly session limit for your ${plan} plan (${limits.maxSessionsPerMonth}). Please upgrade for more sessions.`,
          isBillingError: true,
        };
      }

      const [session] = await VoiceSession.create(
        [{ clerkId, bookId, startedAt: new Date(), billingPeriodStart, durationSeconds: 0 }],
        { session: mongoSession },
      );

      await mongoSession.commitTransaction();

      return {
        success: true,
        sessionId: session._id.toString(),
        maxDurationMinutes: limits.maxDurationPerSession,
      };
    } catch (e) {
      await mongoSession.abortTransaction();
      throw e;
    } finally {
      await mongoSession.endSession();
    }
  } catch (e) {
    console.error("Error starting voice session", e);
    return {
      success: false,
      error: "Failed to start voice session. Please try again later.",
    };
  }
};

export const endVoiceSession = async (
  sessionId: string,
  durationSeconds: number,
): Promise<EndSessionResult> => {
  try {
    await connectToDatabase();

    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return { success: false, error: "Unauthorized" };
    }

    const result = await VoiceSession.findOneAndUpdate(
      { _id: sessionId, clerkId },
      { endedAt: new Date(), durationSeconds },
    );

    if (!result) return { success: false, error: "Voice session not found." };

    return { success: true };
  } catch (e) {
    console.error("Error ending voice session", e);
    return {
      success: false,
      error: "Failed to end voice session. Please try again later.",
    };
  }
};
