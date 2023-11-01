import { Router } from "express";
import { cartController } from "../controllers/carts.controller.js";

export const cartsRouter = Router();

cartsRouter.post("/carts", cartController.postCart);

cartsRouter.get("/carts", cartController.getCarts);

cartsRouter.get("/carts/:cid", cartController.getCartsById);

cartsRouter.get("/carts/:cid/products/:pid", cartController.getProductInCart);

cartsRouter.post("/carts/:cid/products/:pid", cartController.postProductInCart);

cartsRouter.delete(
    "/carts/:cid/products/:pid",
    cartController.deleteProductInCart,
);

cartsRouter.put("/carts/:cid", cartController.updateCart);

cartsRouter.put(
    "/carts/:cid/products/:pid",
    cartController.updateProductInCart,
);

cartsRouter.delete("/carts/:cid", cartController.deleteCart);
