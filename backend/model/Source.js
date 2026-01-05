import mongoose from "mongoose";

const sourceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },

    publisherType: {
      type: String,
      enum: ["news", "blogs", "social", "forums"],
      required: true
    },

    fetchMethod: {
      type: String,
      enum: ["rss", "api", "scraper"],
      required: true
    },

    endpoint: {
      type: String,
      required: true
    },

    country: String,
    
    language: {
      type: String,
      default: "en"
    },

    active: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export const Source = mongoose.model("Source", sourceSchema);
