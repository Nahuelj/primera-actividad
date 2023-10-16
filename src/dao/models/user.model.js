import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: { type: String },
        email: { type: String, required: true },
        password: { type: String },
        github: {},
    },
    { timestamps: true },
);

export const UserModel = mongoose.model("User", userSchema);
