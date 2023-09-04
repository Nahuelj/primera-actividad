import { Router } from "express";
import { ProductManager } from "../productManager.js";
import { io } from "../app.js";

export const productManager = new ProductManager();

export const productsRouter = Router();

productsRouter.get("/", (req, res) => {
    res.send("Servidor corriendo");
});

productsRouter.get("/products", (req, res) => {
    const limit = parseInt(req.query.limit);
    const products = productManager.getProducts();
    if (limit) {
        const limitedProducts = products.slice(0, limit);
        return res.json(limitedProducts);
    }
    res.json(products);
});

productsRouter.get("/products/:pid", (req, res) => {
    const pid = parseInt(req.params.pid);
    const product = productManager.getProductById(pid);
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
});

productsRouter.post("/products", (req, res) => {
    try {
        const product = req.body;
        const response = productManager.addProduct(product);
        res.status(200).json({ message: response });
        //Socket io /realTimeProducts
        const productsUpdated = productManager.getProducts();
        io.emit("update", productsUpdated);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
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
        const response = productManager.updateProduct(pid, productUpdate);
        res.status(200).json({ message: "The product was updated", response });

        //Socket io /realTimeProducts
        const productsUpdated = productManager.getProducts();
        io.emit("update", productsUpdated);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
});

productsRouter.delete("/products/:pid", (req, res) => {
    try {
        const pid = parseInt(req.params.pid);
        if (!pid) {
            return res.status(400).json({ message: "product id not provided" });
        }
        const response = productManager.deleteProduct(pid);
        res.status(200).json({ message: response });
        //Socket io /realTimeProducts
        const productsUpdated = productManager.getProducts();
        io.emit("update", productsUpdated);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
});
