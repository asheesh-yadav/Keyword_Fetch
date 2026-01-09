import { Source } from "../model/Source.js";
import { Article } from "../model/Article.js";
import { RuleMatch } from "../model/RuleMatch.js";

import { fetchFromRSS } from "./fetchers/rssFetcher.js";
import { fetchByScraping } from "./fetchers/scrapeFetcher.js";
import { fetchFromAPI } from "./fetchers/apiFetcher.js";           // GNews
import { fetchFromNewsAPI } from "./fetchers/newsApiFetcher.js";  // NewsAPI

import { matchKeywords } from "../Services/keywordMatcher.js";
import { sendAlertEmail } from "../utils/sendEmail.js";
import { MonitoringRule } from "../model/rule.js";

/**
 * Execute a monitoring rule
 * Priority:
 * 1. GNews API
 * 2. NewsAPI (fallback)
 * 3. RSS / Scraper (fallback)
 */
export const executeRule = async (rule) => {
  console.log(`[EXECUTOR] Executing rule: ${rule.name}`);

  let allArticles = [];

  /* -------------------------------------------------
      1 PRIMARY: GNEWS API
  ------------------------------------------------- */
  let apiArticles = await fetchFromAPI({
    keywords: rule.keywords,
    language: rule.language
  });

  if (apiArticles.length) {
    console.log(`[EXECUTOR] ${apiArticles.length} articles fetched from GNews`);
    allArticles = apiArticles;
  }

  /* -------------------------------------------------
      2 FALLBACK: NEWSAPI
  ------------------------------------------------- */
  if (!apiArticles.length) {
    console.log("[EXECUTOR] GNews empty → falling back to NewsAPI");

    const newsApiArticles = await fetchFromNewsAPI({
      keywords: rule.keywords,
      language: rule.language
    });

    if (newsApiArticles.length) {
      console.log(
        `[EXECUTOR] ${newsApiArticles.length} articles fetched from NewsAPI`
      );
      allArticles = newsApiArticles;
    }
  }

  /* -------------------------------------------------
      3 FALLBACK: RSS + SCRAPER
  ------------------------------------------------- */
  if (!allArticles.length) {
    console.log("[EXECUTOR] APIs empty → falling back to sources");

    const sources = await Source.find({
      _id: { $in: rule.sources },
      active: true,
      fetchMethod: { $in: ["rss", "scraper"] }
    });

    for (const source of sources) {
      let articles = [];

      if (source.fetchMethod === "rss") {
        articles = await fetchFromRSS(source);
      }

      if (source.fetchMethod === "scraper") {
        articles = await fetchByScraping(source);
      }

      if (!articles.length) {
        console.log(
          `[EXECUTOR] 0 fetched from ${source.name} (${source.fetchMethod})`
        );
        continue;
      }

      console.log(
        `[EXECUTOR] ${articles.length} articles fetched from ${source.name}`
      );

      allArticles = allArticles.concat(articles);
    }
  }

  /* -------------------------------------------------
      MATCH, SAVE & ALERT
  ------------------------------------------------- */
  for (const articleData of allArticles) {
    const textToMatch = `${articleData.title} ${articleData.description || ""}`;

    const matchedKeywords = matchKeywords(
      textToMatch,
      rule.keywords
    );

    if (matchedKeywords.length === 0) continue;

    try {
      // Save article globally (deduplicated by URL)
      const article = await Article.findOneAndUpdate(
        { url: articleData.url },
        {
          title: articleData.title,
          description: articleData.description,
          publishedAt: articleData.publishedAt,
          sourceName: articleData.sourceName || "API",
          sourceId: articleData.sourceId || null,
          language: articleData.language || rule.language
        },
        { upsert: true, new: true }
      );

      // Save rule-article relationship
      const ruleMatch = await RuleMatch.findOneAndUpdate(
        {
          rule: rule._id,
          article: article._id
        },
        {
          matchedKeywords,
          matchedAt: new Date()
        },
        { upsert: true, new: true }
      );

      console.log(
        `[MATCHED] ${rule.name} → ${article.title} → ${matchedKeywords.join(", ")}`
      );

      /* -------------------------------------------------
          INSTANT ALERT
      ------------------------------------------------- */
      if (rule.alertType === "instant" && !ruleMatch.notified) {
        if (!rule.createdBy?.email) {
          console.warn("[ALERT] Rule has no user email, skipping alert");
          continue;
        }
        const userEmail = rule.createdBy.email;
        
        await sendAlertEmail({
          to: userEmail,
          subject: `[Alert] New article matched: ${rule.name}`,
          html: `
            <h3>${article.title}</h3>
            <p><strong>Source:</strong> ${article.sourceName}</p>
            <p><a href="${article.url}" target="_blank">Read article</a></p>
          `
        });

        ruleMatch.notified = true;
        await ruleMatch.save();

        console.log(`[ALERT SENT] ${userEmail} → ${article.title}`);
      }
    } catch (error) {
      console.error("[EXECUTOR ERROR]", error.message);
    }
  }
};
