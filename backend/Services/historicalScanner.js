import { Article } from "../model/Article.js";
import { RuleMatch } from "../model/RuleMatch.js";
import { matchKeywords } from "./keywordMatcher.js";

/**
 * Scan ALL existing DB articles for a new rule
 */
export const scanExistingArticles = async (rule) => {
  console.log(`[HISTORICAL] Scanning DB for rule: ${rule.name}`);

  const articles = await Article.find({
    sourceId: { $in: rule.sources }
  }).lean();

  let matchCount = 0;

  for (const article of articles) {
    const text = `${article.title} ${article.description || ""}`;

    const matchedKeywords = matchKeywords(text, rule.keywords);
    if (!matchedKeywords.length) continue;

    await RuleMatch.findOneAndUpdate(
      {
        rule: rule._id,
        article: article._id
      },
      {
        matchedKeywords,
        matchedAt: new Date()
      },
      { upsert: true }
    );

    matchCount++;
  }

  console.log(
    `[HISTORICAL DONE] ${matchCount} articles matched for ${rule.name}`
  );
};