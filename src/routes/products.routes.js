import { Router } from "express";
import { ProductManager } from "../dao/mongoDb/productManagerMongoDb.js";
import { io } from "../app.js";

export const productManager = new ProductManager();

export const productsRouter = Router();

productsRouter.get("/", (req, res) => {
    res.send("Servidor corriendo");
});

productsRouter.get("/products", async (req, res) => {
    const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
    const sort = req.body.sort ? req.body.sort : {};
    const query = req.body.query ? req.body.query : {};
    const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;

    const product = await productManager.getProducts(query, page, limit, sort);
    res.json(product);
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
        const productsUpdated = await productManager.getProducts();
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
        res.status(200).json({ message: "product removed", product: response });
        //Socket io /realTimeProducts
        const productsUpdated = await productManager.getProducts();
        io.emit("update", productsUpdated);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
});
