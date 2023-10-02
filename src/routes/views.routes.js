import { Router } from "express";
import bcrypt from "bcrypt";
import { UserModel } from "../dao/models/user.model.js";

export const viewsRouter = Router();

viewsRouter.get("/", async (req, res) => {
    res.render("home");
});

viewsRouter.get("/realtimeproducts", async (req, res) => {
    res.render("realTimeProducts");
});

viewsRouter.get("/chat", async (req, res) => {
    res.render("chat");
});

viewsRouter.get("/products", async (req, res) => {
    res.render("products");
});

viewsRouter.get("/carts/:id", (req, res) => {
    const cartId = req.params.id;
    res.setHeader("Content-Type", "text/html");
    res.render("carts", { cartId });
});

viewsRouter.get("/register", (req, res) => {
    res.render("register");
});

viewsRouter.post("/singin", async (req, res) => {
    const { email, password } = req.query;

    if (!email || !password) {
        return console.log("missing data");
    }

    let salt = bcrypt.genSaltSync(10);
    const hashed_password = bcrypt.hash(password, salt);

    const findUser = await UserModel.find({ email: email });

    if (findUser.length === 0) {
        const user = await UserModel.create({
            email,
            password: hashed_password,
        });

        return res.status(200).send("user created");
    } else {
        return res.send("user found");
    }
});
