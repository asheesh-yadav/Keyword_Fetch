import { MonitoringRule } from "../model/rule.js";
import { User } from "../model/User.js";


export const ensureSystemUser = async () => {
  // 1. Check if system user already exists
  let systemUser = await User.findOne({ email: "ashhustle5@gmail.com" });

  // 2. Create if missing
  if (!systemUser) {
    systemUser = await User.create({
      name: "System User",
      email: "ashhustle5@gmail.com"
    });

    console.log("[SEED] System user created");
  }

  // 3. Attach system user to rules without owner
  const result = await MonitoringRule.updateMany(
    { createdBy: { $exists: false } },
    { $set: { createdBy: systemUser._id } }
  );

  if (result.modifiedCount > 0) {
    console.log(
      `[SEED] ${result.modifiedCount} rule(s) assigned to System User`
    );
  }

  return systemUser;
};
