import { CartModel } from "../models/cart.model.js";

export class CartManager {
    async addCarts(products) {
        if (!products || products.length === 0) {
            return "No products added";
        }
        const cart = new CartModel({ products: products });

        try {
            await cart.save();
            return `Cart created with id: ${cart._id}`;
        } catch (error) {
            return "Error creating cart";
        }
    }

    async getCarts() {
        try {
            const carts = await CartModel.find();

            return carts;
        } catch (error) {
            return "Error fetching carts";
        }
    }

    async addProductToCart(cartId, product) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                return `Cart with id:${cartId} not found`;
            }

            cart.products.push(product);
            await cart.save();

            return "The product was added to the cart";
        } catch (error) {
            return "Error adding product to cart";
        }
    }

    async getCartById(cartId) {
        try {
            const cart = await CartModel.findById(cartId).populate(
                "products._id",
            );

            if (!cart) {
                return `Cart with id:${cartId} not found`;
            }

            return cart;
        } catch (error) {
            if (error.name === "CastError") {
                return "Invalid cart ID";
            } else {
                console.error(error);
                return "Error fetching cart";
            }
        }
    }

    async getProductInCart(cartId, productId) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                return `Cart with id:${cartId} not found`;
            }

            const product = cart.products.find(
                (p) => p._id.toHexString() === productId,
            );

            if (!product) {
                return `Product with id:${productId} not found in cart with id:${cartId}`;
            }

            return product;
        } catch (error) {
            console.error(error);
            return "Something went wrong";
        }
    }

    // async updateProductInCart(cartId, productId, propertiesUpdated) {
    //     try {
    //         const cart = await CartModel.findById(cartId);

    //         if (!cart) {
    //             return `Cart with id:${cartId} not found`;
    //         }

    //         const product = cart.products.find((p) => p._id === productId);

    //         if (!product) {
    //             return `Product with id:${productId} not found in cart with id:${cartId}`;
    //         }

    //         if (propertiesUpdated.quantity !== undefined) {
    //             product.quantity = propertiesUpdated.quantity;
    //         }

    //         await cart.save();

    //         return product;
    //     } catch (error) {
    //         return "Error updating product in cart";
    //     }
    // }

    async updateProductsInCart(cid, productsUpdated) {
        try {
            const cart = await CartModel.findOneAndUpdate(
                { _id: cid },
                { $set: productsUpdated },
                { new: true },
            );
            return cart;
        } catch (error) {
            console.error("algo salio mal ", error);
        }
    }

    async updatedQuantityProduct(cid, pid, quantity) {
        try {
            const cart = await CartModel.findOneAndUpdate(
                { _id: cid, "products._id": pid },
                { $set: { "products.$.quantity": quantity } },
                { new: true },
            );
            return cart;
        } catch (error) {
            console.error("Something went wrong", error);
        }
    }

    async deleteProductInCart(cartId, productId) {
        try {
            const cart = await CartModel.findOneAndUpdate(
                { _id: cartId },
                { $pull: { products: { _id: productId } } },
                { new: true },
            );

            if (cart) {
                return cart;
            }
        } catch (error) {
            console.error("Something went wrong:", error);
        }
    }

    async deleteProductsInCart(cartId) {
        try {
            const cart = await CartModel.findOneAndUpdate(
                { _id: cartId },
                { $set: { products: [] } },
                { new: true },
            );

            if (cart) {
                return cart;
            }
        } catch (error) {
            console.error("Something went wrong:", error);
        }
    }
}

export const cartManager = new CartManager();
