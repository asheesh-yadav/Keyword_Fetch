import cron from "node-cron";
import { collectArticles } from "../Services/collectionService.js";

// collectArticles()
/**
 * Global article collection scheduler
 * Runs every hour
 */
export const startCollectionScheduler = () => {
  cron.schedule("0 * * * *", async () => {
    try {
      await collectArticles();
    } catch (err) {
      console.error("[COLLECTION SCHEDULER ERROR]", err.message);
    }
  });
};
