import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        thumbnails: [String],
        code: { type: String, required: true, unique: true },
        stock: {
            type: Number,
            required: true,
        },
        status: {
            type: Boolean,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
    },
    { timestamps: true },
);

export const ProductModel = mongoose.model("Product", productSchema);
