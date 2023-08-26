import fs from "fs";

export class ProductManager {
    constructor(ruta = "./src/data.json") {
        this.path = ruta;
        this.createFile();
    }

    createFile() {
        try {
            fs.readFileSync(this.path, "utf8");
            console.log("Archivo encontrado");
        } catch (error) {
            console.log("Archivo no encontrado se procedera a crearlo");
            fs.writeFileSync(this.path, JSON.stringify([], null, 2));
        }
    }

    getProducts() {
        let products = JSON.parse(fs.readFileSync(this.path, "utf8"));
        if (products.length === 0) {
            return console.log("No hay productos agregados []");
        } else {
            return products;
        }
    }

    getProductById(idBuscado) {
        let products = JSON.parse(fs.readFileSync(this.path, "utf8"));
        const busqueda = products.find((objeto) => objeto.id === idBuscado);

        if (busqueda) {
            console.log(`Objeto con el id:${idBuscado} encontrado:`, busqueda);
            return busqueda;
        } else {
            console.log(`No se encontró ningún objeto con el id:${idBuscado}`);
        }
    }

    addProduct(objeto = {}) {
        // desestructurando para agregar al producto
        const {
            title,
            description,
            price,
            thumbnails,
            code,
            stock,
            status,
            category,
        } = objeto;

        // definiendo el modelo de producto
        const product = {
            title,
            description,
            price,
            thumbnails,
            code,
            stock,
            status,
            category,
        };
        // agregando validacion para que no se agregue si faltan propiedades
        if (
            !title ||
            !description ||
            !price ||
            !code ||
            !stock ||
            !status ||
            !category
        ) {
            // array de props que faltan definir
            const propiedadesFaltantes = [];
            // bucle que comprueba cuales faltan y las agrega al array
            for (const key in product) {
                if (!product[key]) {
                    propiedadesFaltantes.push(key);
                }
            }
            return `Need to define the properties ${propiedadesFaltantes.join(
                ", ",
            )}`;
        }
        // agregando id al producto nuevo
        let products = JSON.parse(fs.readFileSync(this.path, "utf8"));
        if (products.length === 0) {
            product.id = 0;
        } else {
            product.id = products.length;
        }

        // validación que no se repita el valor de la propiedad code entre productos del array de productos
        const existe = products.some((objeto) => objeto.code === product.code);

        if (!existe) {
            // agregamos los productos agregados y le sumamos el nuevo
            products.push(product);
            // actualizamos la lista con el producto nuevo
            fs.writeFileSync(this.path, JSON.stringify(products, null, 2));
            // mostramos todo en consola
            return `Product successfully added with id:${product.id}`;
        } else {
            return `There is already a product with that code: "${product.code}"`;
        }
    }

    updateProduct(idBuscado, propiedadesActualizadas) {
        let products = JSON.parse(fs.readFileSync(this.path, "utf8"));
        const indice = products.findIndex((objeto) => objeto.id === idBuscado);
        const { title, description, price, thumbnails, code, stock } =
            propiedadesActualizadas;

        if (indice !== -1) {
            products[indice] = {
                title: title ?? products[indice].title,
                description: description ?? products[indice].description,
                price: price ?? products[indice].price,
                thumbnails: thumbnails ?? products[indice].thumbnails,
                code: code ?? products[indice].code,
                stock: stock ?? products[indice].stock,
                id: products[indice].id,
            };
            fs.writeFileSync(this.path, JSON.stringify(products, null, 2));
            return "The product was updated", products[indice];
        } else {
            return "ID not found in database";
        }
    }

    deleteProduct(idBuscado) {
        let products = JSON.parse(fs.readFileSync(this.path, "utf8"));
        const busqueda = products.find((objeto) => objeto.id === idBuscado);

        if (busqueda) {
            const objetoEliminado = products.filter(
                (objeto) => objeto.id !== idBuscado,
            );
            // ordenamos de menor id a mayor id
            products = objetoEliminado.sort((a, b) => a.id - b.id);
            // actualizamos la lista con el producto nuevo
            fs.writeFileSync(this.path, JSON.stringify(products, null, 2));
            return `Objeto con el id:${idBuscado} encontrado y eliminado`;
        } else if (idBuscado === undefined) {
            return "Se requiere el id para eliminar el producto";
        } else {
            return `No se encontró ningún objeto con el id:${idBuscado}`;
        }
    }
}
