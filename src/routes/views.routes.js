import { Router } from "express";
import bcrypt from "bcrypt";
import { UserModel } from "../dao/models/user.model.js";
import session from "express-session";

export const viewsRouter = Router();

// AUTH
const auth1 = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect("/login");
    }
};

const auth2 = (req, res, next) => {
    if (req.session.user) {
        res.redirect("/products");
    } else {
        next();
    }
};

viewsRouter.get("/", async (req, res) => {
    res.redirect("login");
});

viewsRouter.get("/home", (req, res) => {
    res.render("home");
});

viewsRouter.get("/realtimeproducts", async (req, res) => {
    res.render("realTimeProducts");
});

viewsRouter.get("/chat", async (req, res) => {
    res.render("chat");
});

viewsRouter.get("/products", auth1, async (req, res) => {
    res.render("products");
});

viewsRouter.get("/carts/:id", (req, res) => {
    const cartId = req.params.id;
    res.setHeader("Content-Type", "text/html");
    res.render("carts", { cartId });
});

viewsRouter.get("/register", auth2, (req, res) => {
    res.render("register");
});

viewsRouter.get("/login", auth2, (req, res) => {
    res.render("login");
});

viewsRouter.get("/profile", auth1, (req, res) => {
    res.render("profile");
});

// DESPUES PASAR A RUTAS SESSION

viewsRouter.post("/session/singin", async (req, res) => {
    const { email, password, name } = req.body;

    if (email === "adminCoder@coder.com") {
        return res.send("no se puede establecer un user con este correo");
    }

    try {
        if (!email || !password || !name) {
            return res.send("missing data");
        }

        let salt = bcrypt.genSaltSync(10);
        const hashed_password = await bcrypt.hash(password, salt);

        const findUser = await UserModel.find({ email: email });

        if (findUser.length === 0) {
            const user = await UserModel.create({
                name,
                email,
                password: hashed_password,
            });

            res.redirect(`/login`);
        } else {
            res.send("error");
        }
    } catch (error) {
        console.error(error);
    }
});

viewsRouter.post("/session/login", async (req, res) => {
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

viewsRouter.get("/logout", (req, res) => {
    req.session.destroy((e) => console.log(e));
    res.redirect("/login");
});
