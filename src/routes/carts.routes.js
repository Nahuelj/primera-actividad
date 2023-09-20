import { Router } from "express";
import { CartManager } from "../dao/mongoDb/cartManagerMongoDb.js";
import { productManager } from "../routes/products.routes.js";
import { CartModel } from "../dao/models/cart.model.js";
import mongoose from "mongoose";

const cartManager = new CartManager();
export const cartsRouter = Router();

cartsRouter.post("/carts", async (req, res) => {
    try {
        const newCart = req.body;
        if (!newCart) {
            return res.status(400).json({ message: "Nedd provide products" });
        }
        const response = await cartManager.addCarts(newCart.products);
        return res.status(200).json({ message: response });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong " });
    }
});

cartsRouter.get("/carts", async (req, res) => {
    try {
        const response = await cartManager.getCarts();
        if (!response) {
            return res.status(200).json({ message: "No added carts" });
        }
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
});

cartsRouter.get("/carts/:cid", async (req, res) => {
    try {
        const cid = req.params.cid; // con fs hay que parsear el req.params.cid
        const cart = await cartManager.getCartById(cid);
        if (typeof cart == "string") {
            return res.status(404).json({ message: cart });
        }
        const productsCart = cart.products;
        return res.status(200).json(productsCart);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
});

cartsRouter.get("/carts/:cid/products/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;

    const product = await cartManager.getProductInCart(cid, pid);
    res.status(200).json(product);
});

cartsRouter.post("/carts/:cid/products/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const { quantity } = req.body;
    const quantityVefiqued = quantity > 1 ? quantity : 1;

    const product = await productManager.getProductById(pid);
    const cart = await cartManager.getCartById(cid);

    if (typeof product !== "object") {
        return res.status(404).json({ message: "Product not found" });
    } else if (typeof cart !== "object") {
        return res.status(404).json({ message: "Cart not found" });
    }

    try {
        cart.products.push({ _id: product._id, quantity: quantityVefiqued });
        res.status(200).json({ message: "cart saved" });
    } catch (error) {
        console.error("error en el cath", error);
    }
});

// cartsRouter.post("/carts/:cid/product/:pid", async (req, res) => {
//     try {
//         const cid = req.params.cid; // con fs hay que parsear esto
//         const pid = req.params.pid; // y esto

//         si el producto ya existe sumamos 1 a quantity
//         const existProductInCart = await cartManager.getProductInCart(cid, pid);
//         console.log(existProductInCart);

//         if (typeof existProductInCart == "object") {
//             cartManager.updateProductInCart(cid, pid, {
//                 quantity: existProductInCart.quantity + 1,
//             });
//             const response = cartManager.getCartById(cid);
//             return res.status(200).json({
//                 message: response,
//             });
//         }

//         sino se procede a crear y agregar el product al carro
//         const productResponse = await productManager.getProductById(pid);
//         if (typeof productResponse === "object") {
//             const productToCart = {
//                 id: productResponse.id,
//                 quantity: 1,
//             };
//             const response = await cartManager.addProductToCart(
//                 cid,
//                 productToCart,
//             );
//             return res.status(200).json(response);
//         } else {
//             return res.status(404).json({ message: productResponse });
//         }
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ message: "Something went wrong" });
//     }
// });
