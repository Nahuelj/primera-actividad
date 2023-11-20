import { productManager } from "../dao/mongoDb/productManagerMongoDb.js";
import { cartManager } from "../dao/mongoDb/cartManagerMongoDb.js";

export async function validateStock(userCart) {
    const { products } = userCart;

    // Utilizamos map para transformar cada elemento del array de productos de forma asíncrona
    const productsCleaned = await Promise.all(
        products.map(async (element) => {
            const product = {
                _id: element._id._id.toHexString(),
                quantity: element.quantity,
            };
            return product;
        }),
    );

    const productsValidated = [];
    const productsNotValidated = [];

    // Utilizamos map nuevamente junto con Promise.all para ejecutar las operaciones asíncronas en paralelo
    await Promise.all(
        productsCleaned.map(async (product) => {
            const productFound = await productManager.getProductById(
                product._id,
            );

            if (productFound.stock >= product.quantity) {
                productsValidated.push(product._id);

                let newStock = productFound.stock - product.quantity;
                const lessStock = await productManager.updateProduct(
                    product._id,
                    {
                        stock: newStock,
                    },
                );
            } else {
                productsNotValidated.push(product._id);
            }
        }),
    );

    const restult = {
        productsValidated: productsValidated,
        productsNotValidated: productsNotValidated,
    };

    return restult;
}

export async function amount(purchase) {
    const prices = [];

    for (const product of purchase) {
        const productFound = await productManager.getProductById(product);
        prices.push(productFound.price);
    }

    const total = prices.reduce(function (total, elemento) {
        return total + elemento;
    }, 0);

    return total;
}

export function deletedPurchasedProducts(cid, arrayProducts) {
    arrayProducts.forEach(async (product) => {
        await cartManager.deleteProductInCart(cid, product);
    });
}
