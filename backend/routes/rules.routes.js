import express from "express";
import { createMonitoringRule, deleteMonitoringRule, getMonitoringRules, getRuleArticles, toggleMonitoringRuleStatus } from "../controller/rule.controller.js";


const router = express.Router();

// POST /api/rules
router.post("/", createMonitoringRule);
router.get("/", getMonitoringRules);
router.patch("/:id/toggle", toggleMonitoringRuleStatus);
router.delete("/:id", deleteMonitoringRule);

// articleRule
router.get("/:ruleId/articles", getRuleArticles);
export default router;
