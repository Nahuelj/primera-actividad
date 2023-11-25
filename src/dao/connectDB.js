import mongoose from "mongoose";
import dotenv from "dotenv";
import { logger } from "../config/winstongLogger.config.js";

dotenv.config({ path: "./.env" });

export async function connectToDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        logger.info("Successful connection to MongoDB");
    } catch (error) {
        logger.error(`MongoDB connection error: ${error}`);
    }
}
