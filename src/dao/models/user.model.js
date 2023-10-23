import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        first_name: { type: String },
        last_name: { type: String },
        age: { type: String },
        cartId: { type: String },
        role: { type: String },
        email: { type: String, required: true },
        password: { type: String },
        github: {},
    },
    { timestamps: true },
);

export const UserModel = mongoose.model("User", userSchema);
