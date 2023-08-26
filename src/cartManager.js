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
}
