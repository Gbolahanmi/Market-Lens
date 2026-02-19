import mongoose, { Document, Schema } from "mongoose";

export interface AlertDocument extends Document {
  userId: string;
  symbol: string;
  company: string;
  priceTarget?: number;
  alertType: "above" | "below" | "change"; // Alert if price goes above, below, or changes by %
  threshold?: number; // Percentage change or price point
  isActive: boolean;
  createdAt: Date;
  triggeredAt?: Date;
}

const AlertSchema = new Schema<AlertDocument>({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  symbol: {
    type: String,
    required: true,
    uppercase: true,
  },
  company: {
    type: String,
    default: "",
  },
  priceTarget: {
    type: Number,
  },
  alertType: {
    type: String,
    enum: ["above", "below", "change"],
    default: "change",
  },
  threshold: {
    type: Number,
    default: 5, // 5% change by default
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
  triggeredAt: {
    type: Date,
  },
});

// Compound index for user + symbol to ensure one active alert per stock
AlertSchema.index({ userId: 1, symbol: 1, isActive: 1 });

export const Alert =
  mongoose.models.Alert || mongoose.model<AlertDocument>("Alert", AlertSchema);
