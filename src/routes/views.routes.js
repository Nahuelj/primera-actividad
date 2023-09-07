import { Router } from "express";
import { productManager } from "./products.routes.js";

export const viewsRouter = Router();

viewsRouter.get("/", (req, res) => {
    const products = productManager.getProducts();
    const render = {
        products: products,
    };
    res.render("home", render);
});

viewsRouter.get("/realtimeproducts", (req, res) => {
    const products = productManager.getProducts();
    const render = {
        products: products,
    };
    res.render("realTimeProducts", render);
});
