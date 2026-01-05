import { Article } from "../model/Article.js";
import { Parser } from "json2csv";


/* GET /articles
/articles?page=2
/articles?search=Trump
/articles?from=2025-12-29&to=2025-12-31
/articles?source=Reuters
/articles?search=Trump&source=Reuters&from=2025-12-29   */

export const getArticles = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const {
      search,
      from,
      to,
      source,
      language  
    } = req.query;

    const filter = {};

    //  Text search
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    //  Date range filter
    if (from || to) {
      filter.publishedAt = {};
      if (from) filter.publishedAt.$gte = new Date(from);
      if (to) filter.publishedAt.$lte = new Date(to);
    }

    //  Source filter
    if (source && source!=="all") {
      filter.sourceId = source;
    }

       //Language filter (AUTO, NOT USER FORCED)
    if (language && language !== "all") {
      filter.language = language;
    } 

    const total = await Article.countDocuments(filter);

    const articles = await Article.find(filter)
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      articles
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ================== Export articles
export const exportArticlesCSV = async (req, res) => {
  try {
    const { search, from, to, source } = req.query;

    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    if (from || to) {
      filter.publishedAt = {};
      if (from) filter.publishedAt.$gte = new Date(from);
      if (to) filter.publishedAt.$lte = new Date(to);
    }

    if (source) {
      filter.sourceName = source;
    }

    const articles = await Article.find(filter)
      .sort({ publishedAt: -1 })
      .lean();

    const fields = [
      { label: "Title", value: "title" },
      { label: "Description", value: "description" },
      { label: "URL", value: "url" },
      { label: "Source", value: "sourceName" },
      { label: "Published At", value: "publishedAt" }
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(articles);

    res.header("Content-Type", "text/csv");
    res.attachment("articles_export.csv");
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
