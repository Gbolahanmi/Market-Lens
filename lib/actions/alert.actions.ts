"use server";

import { Alert } from "@/database/models/alert.models";
import dbConnect from "@/database/mongoose";
import { auth } from "@/lib/better-auth/Auth";
import { headers } from "next/headers";

export async function createAlert(
  symbol: string,
  company: string,
  alertType: "above" | "below" | "change",
  threshold: number = 5,
  priceTarget?: number,
) {
  try {
    const session = await (
      await auth
    ).api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { error: "Not authenticated", success: false, data: null };
    }

    await dbConnect();

    console.log(`📢 Creating alert for ${symbol} (${alertType})`);

    // Check if alert already exists
    const existingAlert = await Alert.findOne({
      userId: session.user.id,
      symbol: symbol.toUpperCase(),
      isActive: true,
    });

    if (existingAlert) {
      return {
        error: "Alert already exists for this stock",
        success: false,
        data: null,
      };
    }

    const alert = await Alert.create({
      userId: session.user.id,
      symbol: symbol.toUpperCase(),
      company,
      alertType,
      threshold,
      priceTarget,
      isActive: true,
      createdAt: new Date(),
    });

    console.log(`✅ Created alert for ${symbol}`);

    return {
      success: true,
      error: null,
      data: {
        id: alert._id.toString(),
        userId: alert.userId,
        symbol: alert.symbol,
        company: alert.company,
        alertType: alert.alertType,
        threshold: alert.threshold,
        priceTarget: alert.priceTarget,
        isActive: alert.isActive,
      },
    };
  } catch (error) {
    console.error(`❌ Error creating alert:`, error);
    return {
      error: error instanceof Error ? error.message : "Failed to create alert",
      success: false,
      data: null,
    };
  }
}

export async function getUserAlerts(symbol?: string) {
  try {
    const session = await (
      await auth
    ).api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { error: "Not authenticated", data: [] };
    }

    await dbConnect();

    const query: any = { userId: session.user.id };
    if (symbol) {
      query.symbol = symbol.toUpperCase();
    }

    const alerts = await Alert.find(query).sort({ createdAt: -1 });

    return {
      data: alerts.map((alert) => ({
        id: alert._id.toString(),
        userId: alert.userId,
        symbol: alert.symbol,
        company: alert.company,
        alertType: alert.alertType,
        threshold: alert.threshold,
        priceTarget: alert.priceTarget,
        isActive: alert.isActive,
        createdAt: alert.createdAt,
      })),
      error: null,
    };
  } catch (error) {
    console.error(`❌ Error fetching alerts:`, error);
    return { error: "Failed to fetch alerts", data: [] };
  }
}

export async function deleteAlert(alertId: string) {
  try {
    const session = await (
      await auth
    ).api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { error: "Not authenticated", success: false };
    }

    await dbConnect();

    console.log(`🗑️ Deleting alert ${alertId}`);

    await Alert.findOneAndDelete({
      _id: alertId,
      userId: session.user.id,
    });

    console.log(`✅ Deleted alert ${alertId}`);
    return { success: true, error: null };
  } catch (error) {
    console.error(`❌ Error deleting alert:`, error);
    return {
      error: error instanceof Error ? error.message : "Failed to delete alert",
      success: false,
    };
  }
}

export async function updateAlertStatus(alertId: string, isActive: boolean) {
  try {
    const session = await (
      await auth
    ).api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { error: "Not authenticated", success: false };
    }

    await dbConnect();

    console.log(`⚙️ Updating alert ${alertId} status to ${isActive}`);

    await Alert.findOneAndUpdate(
      { _id: alertId, userId: session.user.id },
      { isActive },
    );

    console.log(`✅ Updated alert ${alertId}`);
    return { success: true, error: null };
  } catch (error) {
    console.error(`❌ Error updating alert:`, error);
    return {
      error: error instanceof Error ? error.message : "Failed to update alert",
      success: false,
    };
  }
}
