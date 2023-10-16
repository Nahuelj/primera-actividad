import { Router } from "express";

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
    res.render(`products`);
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
