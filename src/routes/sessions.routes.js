import { Router } from "express";
import bcrypt from "bcrypt";
import { UserModel } from "../dao/models/user.model.js";
import passport from "passport";

export const sessionsRouter = Router();

sessionsRouter.post(
    "/session/register",
    passport.authenticate("register", {
        failureRedirect: "/failregister",
        successRedirect: "/succesRedirect",
    }),
    async (req, res) => {
        res.send({ status: "succes", message: "user registered" });
    },
);

sessionsRouter.post("/session/login", async (req, res) => {
    const { email, password } = req.body;

    if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
        req.session.user = {
            name: "admin",
            email: "adminCoder@coder.com",
        };
        return res.redirect(`/products?name=Admin`);
    }
    try {
        if (!email || !password) {
            return res.send("missing data");
        }

        const findUser = await UserModel.findOne({ email: email });

        if (!findUser) {
            res.send("user not found");
        } else {
            const compare = await bcrypt.compare(password, findUser.password);

            if (compare) {
                // Contraseña correcta
                req.session.user = {
                    name: findUser.name,
                    email: findUser.email,
                };
                res.redirect(`/products?name=${findUser.name}`);
            } else {
                // Contraseña incorrecta
                res.send("incorrect password");
            }
        }
    } catch (error) {
        console.error(error);
    }
});

sessionsRouter.get("/logout", (req, res) => {
    req.session.destroy((e) => console.log(e));
    res.redirect("/login");
});
