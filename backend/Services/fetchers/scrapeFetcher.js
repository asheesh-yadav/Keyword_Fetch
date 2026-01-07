import axios from "axios";
import * as cheerio from "cheerio";

export const fetchByScraping = async (source) => {
  try {
    const { data } = await axios.get(source.endpoint, {
      headers: { "User-Agent": "Mozilla/5.0" },
      timeout: 15000
    });

    const $ = cheerio.load(data);
    const articles = [];
    const cfg = source.scrapeConfig;

    if (!cfg?.articleSelector || !cfg?.linkSelector) {
      return [];
    }

    $(cfg.articleSelector).each((_, el) => {
      const linkEl = $(el).find(cfg.linkSelector).first();
      const url = linkEl.attr("href");

      if (!url) return;

      const title = cfg.titleSelector
        ? $(el).find(cfg.titleSelector).text().trim()
        : linkEl.text().trim();

      const dateText = cfg.dateSelector
        ? $(el).find(cfg.dateSelector).text().trim()
        : null;

      articles.push({
        title,
        url: url.startsWith("http")
          ? url
          : new URL(url, source.endpoint).href,
        publishedAt: dateText ? new Date(dateText) : new Date(),
        sourceName: source.name,
        sourceId: source._id,
        language: source.language,
        _needsContentFetch: !!cfg.contentSelector
      });
    });

    //  Fetch FULL article content if selector exists
    for (const article of articles) {
      if (!article._needsContentFetch) continue;

      try {
        const res = await axios.get(article.url, {
          headers: { "User-Agent": "Mozilla/5.0" }
        });

        const $$ = cheerio.load(res.data);
        article.description = $$(cfg.contentSelector).text().trim();
      } catch {
        article.description = "";
      }
    }

    console.log(`[SCRAPER] ${articles.length} fetched from ${source.name}`);
    return articles;

  } catch (err) {
    console.error(`[SCRAPER ERROR] ${source.name}`, err.message);
    return [];
  }
};
