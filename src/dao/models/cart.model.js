import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    products: [
        {
            _id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            quantity: { type: Number },
        },
    ],
});

export const CartModel = mongoose.model("Cart", cartSchema);
