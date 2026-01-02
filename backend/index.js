import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import sourceRoutes from './routes/source.routes.js'
import RuleRoutes from "./routes/rules.routes.js";
import articleRoutes from "./routes/articles.routes.js";
import { startCollectionScheduler } from "./cron/collectionScheduler.js";
import { startRuleScheduler } from './cron/ruleScheduler.js';
import { startDailyDigestScheduler } from './cron/dailyDigestScheduler.js';
import cors from "cors";
// import { ensureSystemUser } from "./seed/systemUser.js";
// import { MonitoringRule } from './model/rule.js';

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(cors());

// const fixCreatedBy = async () => {
//   const USER_ID = new mongoose.Types.ObjectId("6956353bb592ecba4d5dbc93");

//   const result = await MonitoringRule.updateMany(
//     {},
//     { $set: { createdBy: USER_ID } }
//   );

//   console.log(`[FIX] Rules updated: ${result.modifiedCount}`);
// };


mongoose.connect(process.env.MONGO_URL)
  .then(async() => {
    console.log("MongoDB connected");
       // Ensure system user + rule ownership
    // await ensureSystemUser();
    // await fixCreatedBy();

    startCollectionScheduler(); 
    startRuleScheduler();
    startDailyDigestScheduler();


    app.listen(process.env.PORT || 5000, () => {
      console.log("Server running");
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Routes
app.use("/api/sources", sourceRoutes);
app.use("/api/rules", RuleRoutes);
app.use("/api/articles", articleRoutes);


app.get("/",(req,res)=>{
    res.status(200).json({message:"This is home root"});
})
