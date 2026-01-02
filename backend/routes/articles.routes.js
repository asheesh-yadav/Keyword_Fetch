import express from "express";
import { exportArticlesCSV, getArticles } from "../controller/articles.controller.js";

const router = express.Router();

router.get("/", getArticles);
router.get("/export", exportArticlesCSV);

export default router;
