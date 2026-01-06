import { Source } from "../model/Source.js";
import { Article } from "../model/Article.js";
import { fetchFromRSS } from "./fetchers/rssFetcher.js";
import { fetchByScraping } from "./fetchers/scrapeFetcher.js";
import { fetchFromAPI } from "./fetchers/apiFetcher.js";

/**
 * Collect articles globally (no rules, no alerts)
 */
export const collectArticles = async () => {
  console.log("[COLLECTOR] Running global article collection");

 const sources = await Source.find({
  active: true
});

  for (const source of sources) {
    let articles = []; 
    
if (source.fetchMethod === "rss") {
  articles = await fetchFromRSS(source);
}
if (source.fetchMethod  === "scraper") {
   articles = await fetchByScraping(source);
}

if (source.fetchMethod === "api") {
  articles = await fetchFromAPI(source);
}

if (!articles.length) {
  console.log(`[COLLECTOR] 0 fetched from ${source.name}`);
  continue;
}

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
    sourceName: source.name,  
    sourceId: source._id,  
    language: source.language   
  },
  { upsert: true }
);
      } catch (err) {
        console.error("[COLLECTOR ERROR]", err.message);
      }
    }
  }
};
