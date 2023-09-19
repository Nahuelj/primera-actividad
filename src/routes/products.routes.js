import { Router } from "express";
import { ProductManager } from "../dao/mongoDb/productManagerMongoDb.js";
import { io } from "../app.js";

export const productManager = new ProductManager();

export const productsRouter = Router();

productsRouter.get("/", (req, res) => {
    res.send("Servidor corriendo");
});

productsRouter.get("/products", async (req, res) => {
    const limit = parseInt(req.query.limit);
    const products = await productManager.getProducts();
    if (limit) {
        const limitedProducts = products.slice(0, limit);
        return res.json(limitedProducts);
    }
    res.json(products);
});

productsRouter.get("/products/:pid", async (req, res) => {
    const pid = req.params.pid; // si es fileSystem esto debe ser parseado a Num si es para mongo db esta bien como string
    const product = await productManager.getProductById(pid);
    console.log(product);
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
});

productsRouter.post("/products", async (req, res) => {
    try {
        const product = req.body;
        const response = await productManager.addProduct(product);
        res.status(200).json({ product: response });
        // Socket io /realTimeProducts
        const productsUpdated = productManager.getProducts();
        io.emit("update", productsUpdated);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
});

productsRouter.put("/products/:pid", async (req, res) => {
    try {
        const pid = req.params.pid; // si es fileSystem esto debe ser parseado a Num si es para mongo db esta bien como string
        const productUpdate = req.body;
        if (typeof productUpdate !== "object") {
            return res.status(400).json({
                message: "Invalid product data format, must be an object",
            });
        }
        const response = await productManager.updateProduct(pid, productUpdate);
        res.status(200).json({ message: "The product was updated", response });

        //Socket io /realTimeProducts
        const productsUpdated = productManager.getProducts();
        io.emit("update", productsUpdated);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
});

productsRouter.delete("/products/:pid", async (req, res) => {
    try {
        const pid = req.params.pid; // si es fileSystem esto debe ser parseado a Num si es para mongo db esta bien como string
        if (!pid) {
            return res.status(400).json({ message: "product id not provided" });
        }
        const response = await productManager.deleteProduct(pid);
        res.status(200).json({ message: response });
        //Socket io /realTimeProducts
        const productsUpdated = productManager.getProducts();
        io.emit("update", productsUpdated);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
});
