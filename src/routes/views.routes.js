import { Router } from "express";
import { productManager } from "./products.routes.js";
import { cartManager } from "../routes/carts.routes.js";

export const viewsRouter = Router();

viewsRouter.get("/", async (req, res) => {
    const products = await productManager.getProducts();
    res.render("home", { products });
});

viewsRouter.get("/realtimeproducts", async (req, res) => {
    const products = await productManager.getProducts();
    res.render("realTimeProducts", { products });
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
