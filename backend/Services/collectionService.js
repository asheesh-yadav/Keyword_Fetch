import { Source } from "../model/Source.js";
import { Article } from "../model/Article.js";
import { fetchFromRSS } from "./fetchers/rssFetcher.js";

/**
 * Collect articles globally (no rules, no alerts)
 */
export const collectArticles = async () => {
  console.log("[COLLECTOR] Running global article collection");

  const sources = await Source.find({
    active: true,
    fetchMethod: "rss"
  });

  for (const source of sources) {
    const articles = await fetchFromRSS(source);

    console.log(
      `[COLLECTOR] ${articles.length} fetched from ${source.name}`
    );

    for (const item of articles) {
      try {
        await Article.findOneAndUpdate(
          { url: item.url },
          {
            title: item.title,
            description: item.description,
            publishedAt: item.publishedAt,
            sourceName: source.name
          },
          { upsert: true }
        );
      } catch (err) {
        console.error("[COLLECTOR ERROR]", err.message);
      }
    }
  }
};
