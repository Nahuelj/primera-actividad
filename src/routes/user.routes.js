import { UserModel } from "../dao/models/user.model.js";
import { Router } from "express";

export const routerUser = Router();

routerUser.post("/user/premium", async (req, res) => {
    const { email } = req.body;

    const userFound = await UserModel.findOne({ email: email });

    if (userFound == []) {
        res.status(404).json("user not found");
    }

    if (userFound.role == "user") {
        const User = await UserModel.findOneAndUpdate(
            { email: email },
            { role: "premium" },
        );
        res.status(200).json("usuario pasado a premium");
    } else if (userFound.role == "admin") {
        res.status(200).json("usuario admin no puede ser premiums");
    } else if (userFound.role == "premium") {
        const User = await UserModel.findOneAndUpdate(
            { email: email },
            { role: "user" },
        );
        res.status(200).json("usuario pasado a user");
    }
});
