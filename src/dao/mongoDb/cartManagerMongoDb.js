import { CartModel } from "../models/cart.model.js";

export class CartManager {
    async createCart(object = {}) {
        try {
            const cart = new CartModel(object);
            const result = await cart.save();
            console.log(`Cart successfully created with id:${result.id}`);
            return result;
        } catch (error) {
            console.error("Error al crear carrito:", error.message);
            return `Error al crear carrito: ${error.message}`;
        }
    }

    async addProductToCart(id, product) {
        try {
            const cart = await CartModel.findByIdAndUpdate(
                id,
                { $push: { products: product } },
                { new: true },
            );
            if (cart) {
                return ["The product was added to the cart", cart];
            } else {
                return `Cart with id:${id} not found`;
            }
        } catch (error) {
            console.error("Error al agregar producto al carrito:", error);
        }
    }

    async getCartById(idBuscado) {
        try {
            const cart = await CartModel.findById(idBuscado);
            if (cart) {
                return cart;
            } else {
                return `Cart with id:${idBuscado} not found`;
            }
        } catch (error) {
            console.error("Error al obtener carrito por ID:", error);
        }
    }

    async getProductInCart(idCart, idProductInCart) {
        try {
            const cart = await CartModel.findById(idCart);
            if (!cart) {
                return `Cart with id:${idCart} not found`;
            }

            const product = cart.products.find(
                (product) => product.id === idProductInCart,
            );

            if (!product) {
                return `Product with id:${idProductInCart} not found in cart with id:${idCart}`;
            }

            return product;
        } catch (error) {
            console.error("Error al obtener producto en el carrito:", error);
        }
    }

    async updateProductInCart(idCart, idProductInCart, propertiesUpdated) {
        try {
            const cart = await CartModel.findById(idCart);
            if (!cart) {
                return `Cart with id:${idCart} not found`;
            }

            const productIndex = cart.products.findIndex(
                (product) => product.id === idProductInCart,
            );

            if (productIndex === -1) {
                return `Product with id:${idProductInCart} not found in cart with id:${idCart}`;
            }

            cart.products[productIndex] = {
                quantity:
                    propertiesUpdated.quantity ??
                    cart.products[productIndex].quantity,
                id: cart.products[productIndex].id,
            };

            await cart.save();

            return cart.products[productIndex];
        } catch (error) {
            console.error("Error al actualizar producto en el carrito:", error);
        }
    }
}
