import cron from "node-cron";
import { MonitoringRule } from "../model/rule.js";
import { executeRule } from "../Services/ruleExecuter.js";


/**
 * Calculate next run time based on frequency
 */
const calculateNextRunAt = (frequency) => {
  const now = new Date();

  if (frequency === "daily") {
    now.setDate(now.getDate() + 1);
  } else {
    // default: hourly
    now.setHours(now.getHours() + 1);
  }
  return now;
};

/**
 * Rule Scheduler
 * Runs every minute
 */
export const startRuleScheduler = () => {
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();

      // const rulesToRun = await MonitoringRule.find({
      //   status: "active",
      //   $or: [
      //     { nextRunAt: { $lte: now } },
      //     { nextRunAt: { $exists: false } }
      //   ]
      // });

      // *****************For testing only — runs all active rules regardless of nextRunAt
const rulesToRun = await MonitoringRule.find({
  status: "active"
});

      for (const rule of rulesToRun) {
          console.log(
              `[SCHEDULER] Rule triggered: ${rule.name} (${rule._id})`
          );
          await executeRule(rule);
        rule.lastRunAt = now;
        rule.nextRunAt = calculateNextRunAt(rule.frequency);

        await rule.save();
      }
    } catch (error) {
      console.error("Rule scheduler error:", error);
    }
  });
};
