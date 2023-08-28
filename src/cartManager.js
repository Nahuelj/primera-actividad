import fs from "fs";

export class CartManager {
    constructor(ruta = "./src/carts.json") {
        this.path = ruta;
        this.createFile();
    }

    createFile() {
        try {
            fs.readFileSync(this.path, "utf8");
            console.log("File found");
        } catch (error) {
            console.log("File not found, it will be created");
            fs.writeFileSync(this.path, JSON.stringify([], null, 2));
        }
    }

    getCarts() {
        let carts = JSON.parse(fs.readFileSync(this.path, "utf8"));
        if (carts.length === 0) {
            return console.log("No carts added []");
        } else {
            return carts;
        }
    }

    addCarts(object = {}) {
        // desestructurando para agregar al producto
        const { products } = object;
        // definiendo el modelo de producto
        const newCart = { products };
        // agregando validacion para que no se agregue si faltan propiedades
        if (!products) {
            return `Need to define proprietary products`;
        }
        // agregando id al producto nuevo
        let carts = JSON.parse(fs.readFileSync(this.path, "utf8"));
        if (carts.length === 0) {
            newCart.id = 0;
        } else {
            newCart.id = carts.length;
        }

        // agregamos el cart
        carts.push(newCart);
        // actualizamos la lista con el producto nuevo
        fs.writeFileSync(this.path, JSON.stringify(carts, null, 2));

        return `Cart successfully added with id:${newCart.id}`;
    }

    addProductToCart(id, product) {
        let carts = JSON.parse(fs.readFileSync(this.path, "utf8"));
        const indice = carts.findIndex((object) => object.id === id);

        if (indice !== -1) {
            const arrayProducts = carts[indice].products;
            arrayProducts.push(product);
            fs.writeFileSync(this.path, JSON.stringify(carts, null, 2));
            return "The product was added to the cart", carts[indice];
        } else {
            return "ID not found in database";
        }
    }

    getCartById(idBuscado) {
        let carts = JSON.parse(fs.readFileSync(this.path, "utf8"));
        const busqueda = carts.find((objeto) => objeto.id === idBuscado);

        if (busqueda) {
            return busqueda;
        } else {
            return `Product with id:${idBuscado} not found`;
        }
    }

    getProductInCart(idCart, idProductInCart) {
        let carts = JSON.parse(fs.readFileSync(this.path, "utf8"));
        const cart = carts.find((cart) => cart.id === idCart);
        if (!cart) return `Cart with id:${idCart} not found`;
        const product = cart.products.find(
            (product) => product.id === idProductInCart,
        );
        if (!product) {
            return `Product with id:${idProductInCart} not found in cart with id:${idCart}`;
        }
        return product;
    }

    updateProductInCart(idCart, idProductInCart, propertiesUpdated) {
        let carts = JSON.parse(fs.readFileSync(this.path, "utf8"));
        const indexCart = carts.findIndex((objeto) => objeto.id === idCart);
        if (indexCart === -1) return `Cart with id:${idCart} not found`;

        // buscar indice de el producto en el carro
        const cartProduct = carts[indexCart].products;
        const indexProduct = cartProduct.findIndex(
            (object) => object.id === idProductInCart,
        );
        if (indexProduct === -1) {
            return `Product with id:${idProductInCart} not found in cart with id:${idCart}`;
        }

        if (indexProduct !== -1) {
            const { quantity } = propertiesUpdated;
            carts[indexCart].products[indexProduct] = {
                quantity:
                    quantity ??
                    carts[indexCart].products[indexProduct].quantity,
                id: carts[indexCart].products[indexProduct].id,
            };
            fs.writeFileSync(this.path, JSON.stringify(carts, null, 2));
            return carts[indexCart].products[indexProduct];
        } else {
            return `Product with id:${idProductInCart} not found in cart with id:${idCart}`;
        }
    }
}
