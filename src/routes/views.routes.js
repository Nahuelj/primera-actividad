import { Router } from "express";

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
