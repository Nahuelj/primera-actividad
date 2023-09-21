import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    emisor: { type: String },
    message: { type: String },
});

export const MessageModel = mongoose.model("Message", messageSchema);
