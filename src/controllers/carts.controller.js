import { cartManager } from "../dao/mongoDb/cartManagerMongoDb.js";
import { productManager } from "../dao/mongoDb/productManagerMongoDb.js";

class Cart_Controller {
    async postCart(req, res) {
        try {
            const newCart = req.body;
            console.log(newCart);
            if (!newCart) {
                return res
                    .status(400)
                    .json({ message: "Debe proporcionar productos" });
            }
            const response = await cartManager.addCarts(newCart.products);
            return res.status(200).json({ message: response });
        } catch (error) {
            console.log(error);
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
            console.log(error);
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
            console.log(error);
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
        const cid = req.params.cid;
        const pid = req.params.pid;
        const { quantity } = req.body;
        const quantityVefiqued = quantity > 1 ? quantity : 1;

        const product = await productManager.getProductById(pid);
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
            console.error("Error en el catch", error);
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
            console.error("Error en el catch", error);
            return res.status(500).json({ message: "Algo salió mal" });
        }
    }

    async updateCart(req, res) {
        const cid = req.params.cid;
        console.log(cid);
        const productsUpdate = req.body;
        console.log(productsUpdate);

        try {
            const cartUpdated = await cartManager.updateProductsInCart(
                cid,
                productsUpdate,
            );
            if (cartUpdated) {
                return res.status(200).json(cartUpdated);
            }
        } catch (error) {
            console.error(error);
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
            console.error(error);
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
            console.error(error);
            return res.status(500).json({ message: "Algo salió mal" });
        }
    }

    async confirmPurchase(req, res) {
        console.log("finalizando compra");
        const { cid } = req.params;
        // const response = await cartManager.getCartById(cid);
        // console.log(response);
        res.json("finalizando compra");
    }
}

export const cartController = new Cart_Controller();
