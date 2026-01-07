import Parser from "rss-parser";

// const parser = new Parser();
const parser = new Parser({
  headers: {
    "User-Agent": "Mozilla/5.0 (MediaMonitor/1.0; +https://yourdomain.com)"
  },
  timeout: 15000
});


/**
 * Fetch articles from an RSS feed
 */
export const fetchFromRSS = async (source) => {
  try {
    const feed = await parser.parseURL(source.endpoint);

    return feed.items.map((item) => ({
      title: item.title,
      description: item.contentSnippet || item.content,
      url: item.link,
      publishedAt: item.isoDate ? new Date(item.isoDate) : null,
      source: source.name,
      sourceId: source._id,
      language: source.language,
    }));
  } catch (error) {
    console.error(`[RSS ERROR] ${source.name}:`, error.message);
    return [];
  }
};
