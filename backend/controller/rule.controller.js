import { MonitoringRule } from "../model/rule.js";
import { RuleMatch } from "../model/RuleMatch.js";
import { Source } from "../model/Source.js";
import mongoose from "mongoose";

/**
 * Create a monitoring rule
 * POST /api/rules
 */
const SYSTEM_USER_ID = new mongoose.Types.ObjectId(
  "6956353bb592ecba4d5dbc93"
);

export const createMonitoringRule = async (req, res) => {
  try {
    const {
      name,
      keywords,
      sources,
      frequency = "hourly",
      language = "en",
      alertType = "daily"
    } = req.body;

    // Basic validation
    if (!name || !Array.isArray(keywords) || keywords.length === 0) {
      return res.status(400).json({
        message: "Rule name and at least one keyword are required"
      });
    }

    if (!Array.isArray(sources) || sources.length === 0) {
      return res.status(400).json({
        message: "At least one source is required"
      });
    }

    // Validate sources
    const validSources = await Source.find({
      _id: { $in: sources },
      active: true
    });

    if (validSources.length !== sources.length) {
      return res.status(400).json({
        message: "One or more sources are invalid or inactive"
      });
    }

    // Create rule
    const rule = await MonitoringRule.create({
      name,
      keywords,
      sources,
      frequency,
      language,
      alertType,
      createdBy: SYSTEM_USER_ID
    });

    return res.status(201).json(rule);

  } catch (error) {
    console.error("Create rule error:", error);
    return res.status(500).json({
      message: error.message
    });
  }
};


/**
 * Get all monitoring rules
 * GET /api/rules
 */
export const getMonitoringRules = async (req, res) => {
  try {
    const rules = await MonitoringRule.find()
      .populate("sources", "name publisherType active")
      .sort({ createdAt: -1 });

    return res.status(200).json(rules);
  } catch (error) {
    console.error("Get rules error:", error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};


/**
 * Pause / Resume a monitoring rule
 * PATCH /api/rules/:id/toggle
 */
export const toggleMonitoringRuleStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const rule = await MonitoringRule.findById(id);
    if (!rule) {
      return res.status(404).json({
        message: "Monitoring rule not found"
      });
    }

    rule.status = rule.status === "active" ? "paused" : "active";
    await rule.save();

    return res.status(200).json(rule);
  } catch (error) {
    console.error("Toggle rule error:", error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

// ==================== Article rule
export const getRuleArticles = async (req, res) => {
  try {
    const { ruleId } = req.params;

    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const skip = (page - 1) * limit;

    const matches = await RuleMatch.find({ rule: ruleId })
      .populate("article")
      .sort({ matchedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await RuleMatch.countDocuments({ rule: ruleId });

    const articles = matches.map(m => ({
      id: m.article._id,
      title: m.article.title,
      description: m.article.description,
      url: m.article.url,
      source: m.article.sourceName,
      publishedAt: m.article.publishedAt,
      matchedKeywords: m.matchedKeywords,
      matchedAt: m.matchedAt
    }));

    res.json({
      ruleId,
      page,
      limit,
      total,
      count: articles.length,
      articles
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
