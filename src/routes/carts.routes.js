import { Router, response } from "express";
import { CartManager } from "../cartManager.js";
import { productManager } from "../routes/products.routes.js";

const cartManager = new CartManager();
export const cartsRouter = Router();

cartsRouter.post("/carts", (req, res) => {
    try {
        const newCart = req.body;
        if (!newCart) {
            return res.status(400).json({ message: "Nedd provide products" });
        }
        const response = cartManager.addCarts(newCart);
        return res.status(200).json({ message: response });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong " });
    }
});

cartsRouter.get("/carts", (req, res) => {
    try {
        const response = cartManager.getCarts();
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
});

cartsRouter.get("/carts/:cid", (req, res) => {
    try {
        const cid = parseInt(req.params.cid);
        const cart = cartManager.getCartById(cid);
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        const productsCart = cart.products;
        return res.status(200).json(productsCart);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
});

cartsRouter.post("/carts/:cid/product/:pid", (req, res) => {
    try {
        const cid = parseInt(req.params.cid);
        const pid = parseInt(req.params.pid);
        const productResponse = productManager.getProductById(pid);

        if (typeof productResponse === "object") {
            const productToCart = {
                id: productResponse.id,
                quantity: 1,
            };
            const response = cartManager.addProductToCart(cid, productToCart);
            return res.status(200).json(response);
        } else {
            return res.status(404).json({ message: productResponse });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
});
