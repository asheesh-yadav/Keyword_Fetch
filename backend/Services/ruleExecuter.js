import { Source } from "../model/Source.js";
import { fetchFromRSS } from "./fetchers/rssFetcher.js";
import { Article } from "../model/Article.js";
import { RuleMatch } from "../model/RuleMatch.js";
import { matchKeywords } from "../Services/keywordMatcher.js";
import { sendAlertEmail } from "../utils/sendEmail.js";
import { fetchByScraping } from "./fetchers/scrapeFetcher.js";
import { fetchFromAPI } from "./fetchers/apiFetcher.js";

/**
 * Execute a monitoring rule
 */
export const executeRule = async (rule) => {
  console.log(`[EXECUTOR] Executing rule: ${rule.name}`);

  const sources = await Source.find({
    _id: { $in: rule.sources },
    active: true
  });

  for (const source of sources) {
       let articles = []; 
       
   if (source.fetchMethod === "rss") {
     articles = await fetchFromRSS(source);
   }
   if (source.fetchMethod === "scraper") {
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
      `[EXECUTOR] ${articles.length} articles fetched from ${source.name}`
    );

    for (const articleData of articles) {
      const textToMatch = `${articleData.title} ${articleData.description || ""}`;

      const matchedKeywords = matchKeywords(
        textToMatch,
        rule.keywords
      );

      // Ignore articles that don't match rule keywords
      if (matchedKeywords.length === 0) continue;

      try {
        // Save article globally (deduplicated by URL)
const article = await Article.findOneAndUpdate(
  { url: articleData.url },
  {
    title: articleData.title,
    description: articleData.description,
    publishedAt: articleData.publishedAt,
    sourceName: source.name,
    sourceId: source._id,
    language: source.language, 
  },
  { upsert: true, new: true }
);

        // Save rule-article match
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

if (rule.alertType === "instant" && !ruleMatch.notified) {
  // populate rule owner
  const populatedRule = await rule.populate("createdBy");

  const userEmail = populatedRule.createdBy.email;

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
  }
};
