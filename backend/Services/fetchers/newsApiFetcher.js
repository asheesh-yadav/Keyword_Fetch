import axios from "axios";

import dotenv from 'dotenv'
dotenv.config();

const NEWS_API_KEY = process.env.NEWS_API_KEY;

export const fetchFromNewsAPI = async ({ keywords, language }) => {
  if (!keywords || keywords.length === 0) return [];

  const query = keywords.slice(0, 5).join(" OR ");

  try {
    const res = await axios.get("https://newsapi.org/v2/everything", {
      params: {
        q: query,
        language: language !== "all" ? language : undefined,
        sortBy: "publishedAt",
        pageSize: 20,
        apiKey: NEWS_API_KEY
      },
      timeout: 15000
    });

    return (res.data.articles || []).map((a) => ({
      title: a.title,
      description: a.description,
      url: a.url,
      publishedAt: a.publishedAt ? new Date(a.publishedAt) : new Date(),
      sourceName: a.source?.name || "NewsAPI",
      language: language || "en"
    }));
  } catch (err) {
    console.error("[NEWSAPI ERROR]", err.response?.data || err.message);
    return [];
  }
};
