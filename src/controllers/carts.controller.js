import { cartManager } from "../dao/mongoDb/cartManagerMongoDb.js";
import { productManager } from "../dao/mongoDb/productManagerMongoDb.js";
import {
    validateStock,
    amount,
    deletedPurchasedProducts,
} from "../services/validateStock.service.js";
import { ticketModel } from "../dao/models/ticket.model.js";
import { v4 } from "uuid";

class Cart_Controller {
    async postCart(req, res) {
        try {
            const newCart = req.body;
            logger.info(`${newCart}`);
            if (!newCart) {
                return res
                    .status(400)
                    .json({ message: "Debe proporcionar productos" });
            }
            const response = await cartManager.addCarts(newCart.products);
            return res.status(200).json({ message: response });
        } catch (error) {
            req.logger.debug(`In cart controller, postCart${error}`);
            req.logger.error(`In cart controller, postCart${error}`);
            return res.status(500).json({ message: "Algo salió mal" });
        }
    }

    async getCarts(req, res) {
        try {
            const response = await cartManager.getCarts();
            if (!response) {
                return res
                    .status(200)
                    .json({ message: "No hay carritos agregados" });
            }
            return res.status(200).json(response);
        } catch (error) {
            res.logger.debug(`In cart controller, getCarts${error}`);
            res.logger.error(`In cart controller, getCarts${error}`);
            return res.status(500).json({ message: "Algo salió mal" });
        }
    }

    async getCartsById(req, res) {
        try {
            const cid = req.params.cid; // con fs hay que parsear el req.params.cid
            const cart = await cartManager.getCartById(cid);
            if (typeof cart == "string") {
                return res.status(404).json({ message: cart });
            }
            const productsCart = cart.products;
            res.set("Content-Type", "application/json");
            return res.status(200).json(productsCart);
        } catch (error) {
            res.logger.debug(`In cart controller, getCartsById${error}`);
            res.logger.error(`In cart controller, getCartsById${error}`);
            return res.status(500).json({ message: "Algo salió mal" });
        }
    }

    async getProductInCart(req, res) {
        const cid = req.params.cid;
        const pid = req.params.pid;

        const product = await cartManager.getProductInCart(cid, pid);
        res.status(200).json(product);
    }

    async postProductInCart(req, res) {
        const user = req.user;
        const cid = req.params.cid;
        const pid = req.params.pid;

        const { quantity } = req.body;
        const quantityVefiqued = quantity > 1 ? quantity : 1;

        const product = await productManager.getProductById(pid);

        if (product.owner === user.email) {
            return res.status(401).json({
                message: "You cannot add the product to the same owner",
            });
        }

        const cart = await cartManager.getCartById(cid);
        if (typeof product !== "object") {
            return res.status(404).json({ message: "Producto no encontrado" });
        } else if (typeof cart !== "object") {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }

        try {
            const productInCart = await cartManager.getProductInCart(cid, pid);
            if (typeof productInCart === "object") {
                const indexProduct = cart.products.findIndex(
                    (p) => p._id._id.toHexString() === pid,
                );

                cart.products[indexProduct].quantity =
                    cart.products[indexProduct].quantity + quantityVefiqued;
                cart.save();
                return res.status(200).json({
                    message: "Producto existente, cantidad actualizada",
                    cart: cart,
                });
            }
            cart.products.push({
                _id: product._id,
                quantity: quantityVefiqued,
            });
            cart.save();
            res.status(200).json({ cart_saved: cart.products });
        } catch (error) {
            req.logger.debug(`In cart controller, postProductInCart${error}`);
            req.logger.error(`In cart controller, postProductInCart${error}`);
            return res.status(500).json({ message: "Algo salió mal" });
        }
    }

    async deleteProductInCart(req, res) {
        const cid = req.params.cid;
        const pid = req.params.pid;

        const cart = await cartManager.getCartById(cid);
        if (typeof cart !== "object") {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }

        try {
            const cartWithoutProduct = await cartManager.deleteProductInCart(
                cid,
                pid,
            );
            if (cartWithoutProduct) {
                return res.status(200).json(cartWithoutProduct);
            }
        } catch (error) {
            res.logger.debug(`In cart controller, deleteProductInCart${error}`);
            res.logger.error(`In cart controller, deleteProductInCart${error}`);
            return res.status(500).json({ message: "Algo salió mal" });
        }
    }

    async updateCart(req, res) {
        const cid = req.params.cid;

        const productsUpdate = req.body;

        try {
            const cartUpdated = await cartManager.updateProductsInCart(
                cid,
                productsUpdate,
            );
            if (cartUpdated) {
                return res.status(200).json(cartUpdated);
            }
        } catch (error) {
            res.logger.debug(`In cart controller, updateCart${error}`);
            res.logger.error(`In cart controller, updateCart${error}`);
            return res.status(500).json({ message: "Algo salió mal" });
        }
    }

    async updateProductInCart(req, res) {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const { quantity } = req.body;

        try {
            const cartUpdated = await cartManager.updatedQuantityProduct(
                cid,
                pid,
                quantity,
            );
            if (cartUpdated) {
                return res.status(200).json(cartUpdated);
            }
        } catch (error) {
            res.logger.debug(`In cart controller, updateProductInCart${error}`);
            res.logger.error(`In cart controller, updateProductInCart${error}`);
            return res.status(500).json({ message: "Algo salió mal" });
        }
    }

    async deleteCart(req, res) {
        const cid = req.params.cid;

        try {
            const cartUpdated = await cartManager.deleteProductsInCart(cid);
            if (cartUpdated) {
                return res.status(200).json(cartUpdated);
            }
        } catch (error) {
            res.logger.debug(`In cart controller, deleteCart${error}`);
            res.logger.error(`In cart controller, deleteCart${error}`);
            return res.status(500).json({ message: "Algo salió mal" });
        }
    }

    async confirmPurchase(req, res) {
        const { cid } = req.params;
        const response = await cartManager.getCartById(cid);
        const purchase = (await validateStock(response)).productsValidated;
        const notPurchased = (await validateStock(response))
            .productsNotValidated;
        const amout = await amount(purchase);
        const user = req.session.user.email;
        const ticket = new ticketModel({
            products: purchase,
            code: v4(),
            amount: amout,
            purchaser: user,
        });
        await ticket.save();
        deletedPurchasedProducts(cid, purchase);
        res.json({ ticket, productsNotValidated: notPurchased });
    }
}

export const cartController = new Cart_Controller();
