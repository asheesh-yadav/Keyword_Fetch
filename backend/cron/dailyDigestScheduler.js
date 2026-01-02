import cron from "node-cron";
import { MonitoringRule } from "../model/rule.js";
import { RuleMatch } from "../model/RuleMatch.js";
import { sendAlertEmail } from "../utils/sendEmail.js";

/**
 * Daily Digest Scheduler
 * Runs once per day at 8 AM
 */
export const startDailyDigestScheduler = () => {
  cron.schedule("0 8 * * *", async () => {
    console.log("[DIGEST] Running daily digest scheduler");

    try {
      const rules = await MonitoringRule.find({
        status: "active",
        alertType: "daily"
      }).populate("createdBy");

      for (const rule of rules) {
        const matches = await RuleMatch.find({
          rule: rule._id,
          notified: false
        }).populate("article");

        if (matches.length === 0) continue;

        // Build email content
        const itemsHtml = matches
          .map(
            (m) => `
              <li>
                <a href="${m.article.url}" target="_blank">
                  ${m.article.title}
                </a>
                <br/>
                <small>${m.article.sourceName}</small>
              </li>
            `
          )
          .join("");

        await sendAlertEmail({
          to: rule.createdBy.email,
          subject: `[Daily Digest] ${rule.name}`,
          html: `
            <h3>${rule.name}</h3>
            <ul>${itemsHtml}</ul>
          `
        });

        // Mark all as notified
        await RuleMatch.updateMany(
          { _id: { $in: matches.map((m) => m._id) } },
          { $set: { notified: true } }
        );

        console.log(
          `[DIGEST SENT] ${rule.createdBy.email} → ${matches.length} articles`
        );
      }
    } catch (err) {
      console.error("[DIGEST ERROR]", err.message);
    }
  });
};
