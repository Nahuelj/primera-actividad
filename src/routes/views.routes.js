import { Router } from "express";
import { productManager } from "./products.routes.js";

export const viewsRouter = Router();

viewsRouter.get("/", async (req, res) => {
    const products = await productManager.getProducts();
    console.log(products);
    res.render("home", { products });
});

viewsRouter.get("/realtimeproducts", async (req, res) => {
    const products = await productManager.getProducts();
    console.log(products);
    res.render("realTimeProducts", { products });
});

viewsRouter.get("/chat", async (req, res) => {
    res.render("chat");
});

viewsRouter.get("/products", async (req, res) => {
    res.render("products");
});
