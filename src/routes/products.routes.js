import { Router } from "express";
import { Manager } from "../app.js";
export const productsRouter = Router();

productsRouter.get("/", (req, res) => {
    res.send("Servidor corriendo");
});

productsRouter.get("/products", (req, res) => {
    const limit = parseInt(req.query.limit);
    const products = Manager.getProducts();
    if (limit) {
        const limitedProducts = products.slice(0, limit);
        return res.json(limitedProducts);
    }
    return res.json(products);
});

productsRouter.get("/products/:pid", (req, res) => {
    const pid = parseInt(req.params.pid);
    const product = Manager.getProductById(pid);
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }
    return res.json(product);
});

productsRouter.post("/products", (res, req) => {
    const product = req.body;
    Manager.addProduct(product);
});
