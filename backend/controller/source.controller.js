import { Source } from "../model/Source.js";


/**
 * Create a new source
 * POST /api/sources
 */
export const createSource = async (req, res) => {
  try {
    const {
      name,
      publisherType,
      fetchMethod,
      endpoint,
      country,
      language,
      scrapeConfig
    } = req.body;

    // Basic required fields
    if (!name || !publisherType || !fetchMethod || !endpoint) {
      return res.status(400).json({
        message: "Required fields are missing"
      });
    }

    // Scraper-specific validation
    if (fetchMethod === "scraper") {
      if (!scrapeConfig) {
        return res.status(400).json({
          message: "scrapeConfig is required for scraper sources"
        });
      }

      const {
        articleSelector,
        linkSelector,
        titleSelector,
        dateSelector,
        contentSelector
      } = scrapeConfig;

      if (!articleSelector || !linkSelector) {
        return res.status(400).json({
          message:
            "scrapeConfig.articleSelector and scrapeConfig.linkSelector are required"
        });
      }

      // Soft warning (NOT error)
      if (!contentSelector) {
        console.warn(
          `[WARN] Source "${name}" created without contentSelector. Keyword matching may be weak.`
        );
      }
    }

    // Prevent duplicate source names
    const existing = await Source.findOne({ name });
    if (existing) {
      return res.status(409).json({
        message: "Source already exists"
      });
    }

    // Create source
    const source = await Source.create({
      name,
      publisherType,
      fetchMethod,
      endpoint,
      country,
      language,
      scrapeConfig
    });

    return res.status(201).json(source);

  } catch (error) {
    console.error("Create source error:", error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};



/**
 * Get all sources
 * GET /api/sources
 */
export const getSources = async (req, res) => {
  try {
    const sources = await Source.find().sort({ createdAt: -1 });
    return res.status(200).json(sources);
  } catch (error) {
    console.error("Get sources error:", error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};


/**
 * Enable / Disable a source
 * PATCH /api/sources/:id/toggle
 */
export const toggleSourceStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const source = await Source.findById(id);
    if (!source) {
      return res.status(404).json({
        message: "Source not found"
      });
    }

    source.active = !source.active;
    await source.save();

    return res.status(200).json(source);
  } catch (error) {
    console.error("Toggle source error:", error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};
