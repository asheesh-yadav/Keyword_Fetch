import express from "express";
import { createSource, getSources, toggleSourceStatus } from "../controller/source.controller.js";


const router = express.Router();

// POST /api/sources
router.post("/", createSource);
router.get("/", getSources);
router.patch("/:id/toggle", toggleSourceStatus);
export default router;
