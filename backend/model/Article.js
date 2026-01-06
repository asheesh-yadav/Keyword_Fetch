import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
  {
  sourceId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Source"
 },
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      default: ""
    },

    url: {
      type: String,
      required: true,
      unique: true, // ensures no duplicate articles
      trim: true
    },

    publishedAt: {
      type: Date
    },

    sourceName: {
      type: String
    },

    language: {
      type: String,
      default: "en"
    }
  },
  { timestamps: true }
);

// Index to improve query performance
articleSchema.index({ publishedAt: -1 });
articleSchema.index({ sourceName: 1 });
articleSchema.index({ sourceId: 1 });

export const Article = mongoose.model("Article", articleSchema);
