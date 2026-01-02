import { Source } from "../model/Source.js";


/**
 * Create a new source
 * POST /api/sources
 */
export const createSource = async (req, res) => {
  try {
    const { name, publisherType, fetchMethod, endpoint, country, language } =
      req.body;

    if (!name || !publisherType || !fetchMethod || !endpoint) {
      return res.status(400).json({
        message: "Required fields are missing"
      });
    }

    const existing = await Source.findOne({ name });
    if (existing) {
      return res.status(409).json({
        message: "Source already exists"
      });
    }

    const source = await Source.create({
      name,
      publisherType,
      fetchMethod,
      endpoint,
      country,
      language
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
