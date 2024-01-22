import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    code: { type: String, required: true },
    purchase_datetime: { type: Date, default: Date.now },
    amount: { type: Number, required: true },
    purchaser: { type: String, required: true },
});

export const ticketModel = mongoose.model("Ticket", ticketSchema);
