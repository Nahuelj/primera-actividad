import { ProductManager } from "../dao/mongoDb/productManagerMongoDb.js";
import { io } from "../app.js";
import { ProductModel } from "../dao/models/product.model.js";

export const productManager = new ProductManager();

class Products_Controller {
    async init(req, res) {
        res.send("Servidor corriendo");
    }

    async getProducts(req, res) {
        const limit = parseInt(req.query.limit)
            ? parseInt(req.query.limit)
            : 10;
        const sort = req.body.sort ? req.body.sort : {};
        const query = req.body.query ? req.body.query : {};
        const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;

        const product = await productManager.getProducts(
            query,
            page,
            limit,
            sort,
        );
        res.json(product);
    }

    async getProductId(req, res) {
        const pid = req.params.pid; // si es fileSystem esto debe ser parseado a Num si es para mongo db esta bien como string
        const product = await productManager.getProductById(pid);
        req.logger.debug(`In productsController, getProductId: ${error}`);
        req.logger.error(`In productsController, getProductId: ${error}`);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(product);
    }

    async postProduct(req, res) {
        const product = req.body;
        const response = await productManager.addProduct(product);
        // Socket io /realTimeProducts
        const productsUpdated = await productManager.getProducts(
            {},
            1,
            100,
            {},
        );

        io.emit("update", productsUpdated);
        res.status(200).json({ product: response });
    }

    async putProducts(req, res) {
        const pid = req.params.pid; // si es fileSystem esto debe ser parseado a Num si es para mongo db esta bien como string
        const productUpdate = req.body;
        if (typeof productUpdate !== "object") {
            return res.status(400).json({
                message: "Invalid product data format, must be an object",
            });
        }
        const response = await productManager.updateProduct(pid, productUpdate);
        res.status(200).json({
            message: "The product was updated",
            response,
        });

        //Socket io /realTimeProducts
        const productsUpdated = productManager.getProducts();
        io.emit("update", productsUpdated);
    }

    async deleteProductId(req, res) {
        if (req.user.role === "user") {
            res.status(400).json({ message: "invalid credentials" });
        }

        const pid = req.params.pid; // si es fileSystem esto debe ser parseado a Num si es para mongo db esta bien como string
        if (!pid) {
            return res.status(400).json({ message: "product id not provided" });
        }
        if (req.user.role === "premium") {
            const productFound = await ProductModel.findOne({
                _id: pid,
            });
            if (productFound.owner === req.user.email) {
                const response = await productManager.deleteProduct(pid);
                res.status(200).json({
                    message: "product removed",
                    product: response,
                });
                //Socket io /realTimeProducts
                const productsUpdated = await productManager.getProducts();
                io.emit("update", productsUpdated);
            } else {
                res.status(400).json({
                    message: "you are not the owner of the product",
                });
            }
        } else if (req.user.role === "admin") {
            const response = await productManager.deleteProduct(pid);
            res.status(200).json({
                message: "product removed",
                product: response,
            });
            //Socket io /realTimeProducts
            const productsUpdated = await productManager.getProducts();
            io.emit("update", productsUpdated);
        }
    }
}

export const productsController = new Products_Controller();
