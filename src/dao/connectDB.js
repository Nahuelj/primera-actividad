import mongoose from "mongoose";

export async function connectToDatabase() {
    try {
        await mongoose.connect(
            "mongodb+srv://nahueljosebenitez7:123Coder@cluster0.93y9tit.mongodb.net/ecommerce",
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            },
        );
        console.log("Successful connection to MongoDB");
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
}
