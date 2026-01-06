import axios from "axios";

const GNEWS_API_KEY = "69e059092645b73c55b498afbf858252";

// Map country → language
const langMap = {
  JP: "ja",
  IN: "hi",
  CN: "zh",
  KR: "ko"
};

export const fetchFromAPI = async (source) => {
    if (!GNEWS_API_KEY) {
  console.error("[API ERROR] GNEWS_API_KEY missing in env");
  return [];
}
  try {
    const lang =
      langMap[source.country] ||
      source.language ||
      "en";

    const res = await axios.get(
      "https://gnews.io/api/v4/search",
      {
        params: {
          q: source.name||rule.keywords.join(" OR "),
          lang,
          max: 10,
          token: GNEWS_API_KEY
        }
      }
    );

    return res.data.articles.map((a) => ({
      title: a.title,
      description: a.description || "",
      url: a.url,
      publishedAt: new Date(a.publishedAt),
      source: source.name,
      sourceId: source._id,
      language: lang
    }));
  } catch (err) {
    console.error(`[API ERROR] ${source.name}`, err.response?.data || err.message);
    return [];
  }
};
