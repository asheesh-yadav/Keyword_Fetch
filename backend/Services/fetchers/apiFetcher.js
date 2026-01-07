import axios from "axios";
import dotenv from 'dotenv'
dotenv.config();

const GNEWS_API_KEY = process.env.GNEWS_API_KEY;

export const fetchFromAPI = async ({ keywords, language }) => {
  if (!keywords || keywords.length === 0) return [];

  const query = keywords.slice(0, 5).join(" OR ");

  try {
    const res = await axios.get("https://gnews.io/api/v4/search", {
      params: {
        q: query,
        lang: language !== "all" ? language : undefined,
        max: 20,
        sortby: "publishedAt",
        token: GNEWS_API_KEY
      },
      timeout: 15000
    });

    return (res.data.articles || []).map((a) => ({
      title: a.title,
      description: a.description,
      url: a.url,
      publishedAt: new Date(a.publishedAt),
      sourceName: a.source?.name || "GNews",
      language: language || "en"
    }));
  } catch (err) {
    console.error("[GNEWS ERROR]", err.response?.data || err.message);
    return [];
  }
};
