import mongoose from "mongoose";

const monitoringRuleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    keywords: {
      type: [String],
      required: true,
      validate: {
        validator: arr => arr.length > 0,
        message: "At least one keyword is required"
      }
    },

    sources: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Source",
        required: true
      }
    ],

    language: {
      type: String,
      default: "en"
    },

    frequency: {
      type: String,
      enum: ["hourly", "daily"],
      default: "hourly"
    },

    status: {
      type: String,
      enum: ["active", "paused"],
      default: "active"
    },

    lastRunAt: {
      type: Date
    },

    nextRunAt: {
      type: Date
    },

   createdBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true
},
alertType: {
  type: String,
  enum: ["instant", "daily"],
  default: "daily"
}
  },
  {
    timestamps: true
  }
);

export const MonitoringRule = mongoose.model("MonitoringRule", monitoringRuleSchema);
