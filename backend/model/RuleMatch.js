import mongoose from "mongoose";

const ruleMatchSchema = new mongoose.Schema(
  {
    rule: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MonitoringRule",
      required: true,
      index: true
    },

    article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article",
      required: true,
      index: true
    },

    matchedKeywords: {
      type: [String],
      required: true
    },

    matchedAt: {
      type: Date,
      default: Date.now
    },
notified: {
  type: Boolean,
  default: false
}

  },
  {
    timestamps: true
  }
);

// Prevent duplicate matches (same rule + same article)
ruleMatchSchema.index({ rule: 1, article: 1 }, { unique: true });

export const RuleMatch = mongoose.model("RuleMatch", ruleMatchSchema);
