import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    products: [
        {
            name: String,
            quantity: Number,
            id: Number,
        },
    ],
    id: {
        type: Number,
        required: true,
    },
});

export const CartModel = mongoose.model("Cart", cartSchema);
