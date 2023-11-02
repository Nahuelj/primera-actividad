import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

export async function connectToDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Successful connection to MongoDB");
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
}
