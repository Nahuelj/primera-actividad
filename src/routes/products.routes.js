import { Router } from "express";
import { productsController } from "../controllers/products.controller.js";

export const productsRouter = Router();

productsRouter.get("/", productsController.init);

productsRouter.get("/products", productsController.getProducts);

productsRouter.get("/products/:pid", productsController.getProductId);

productsRouter.post("/products", productsController.postProduct);

productsRouter.put("/products/:pid", productsController.putProducts);

productsRouter.delete("/products/:pid", productsController.deleteProductId);
