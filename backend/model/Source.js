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
      required: true
    },
    scrapeConfig: {
  articleSelector: String,   // selector for each article block
  linkSelector: String,      // selector inside article
  titleSelector: String,     // optional
  dateSelector: String,      // optional
  contentSelector: String   // article page selector (IMPORTANT)
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
