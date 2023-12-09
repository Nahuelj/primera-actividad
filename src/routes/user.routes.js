import { UserModel } from "../dao/models/user.model.js";
import { Router } from "express";

export const routerUserPremium = Router();

routerUserPremium.put("/users/premium/:uid", async (req, res) => {
    const { uid } = req.params;

    const userFound = await UserModel.findOne({ _id: uid });

    if (userFound == []) {
        res.status(404).json("user not found");
    }

    if (userFound.role == "user") {
        const User = await UserModel.findOneAndUpdate(
            { _id: uid },
            { role: "premium" },
        );
        res.status(200).json("usuario pasado a premium");
    } else if (userFound.role == "admin") {
        res.status(200).json("usuario admin no puede ser premiums");
    } else if (userFound.role == "premium") {
        const User = await UserModel.findOneAndUpdate(
            { _id: uid },
            { role: "user" },
        );
        res.status(200).json("usuario pasado a user");
    }
});
