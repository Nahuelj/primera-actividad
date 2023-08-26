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

productsRouter.post("/products", (req, res) => {
    try {
        const product = req.body;
        const response = Manager.addProduct(product);
        res.status(200).json({ message: response });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
});

productsRouter.put("/products/:pid", (req, res) => {
    try {
        const pid = parseInt(req.params.pid);
        const productUpdate = req.body;
        if (typeof productUpdate !== "object") {
            return res.status(400).json({
                message: "Invalid product data format, must be an object",
            });
        }
        const response = Manager.updateProduct(pid, productUpdate);
        return res
            .status(200)
            .json({ message: "The product was updated", response });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
});

productsRouter.delete("/products/:pid", (req, res) => {
    try {
        const pid = parseInt(req.params.pid);
        if (!pid) {
            return res.status(400).json({ message: "product id not provided" });
        }
        const response = Manager.deleteProduct(pid);
        return res.status(200).json({ message: response });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
});
