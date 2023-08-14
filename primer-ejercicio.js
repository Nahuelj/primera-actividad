const fs = require("fs");

class ProductManager {
    constructor(ruta = "./data.json") {
        this.path = ruta;
        this.products = this.cargarProductos();
    }

    cargarProductos() {
        try {
            const contenidoArchivo = fs.readFileSync(this.path, "utf8");
            console.log("Archivo de productos encontrado");
            return JSON.parse(contenidoArchivo);
        } catch (error) {
            console.log(
                "No se encontro archivo de productos, se procederá a generar uno cuando se agreguen productos",
            );
            return [];
        }
    }

    getProducts() {
        if (this.products.length === 0) {
            return console.log("No hay productos Agregados []");
        } else {
            console.log("Tus productos son:");
            console.log(fs.readFileSync(this.path, "utf8"));
        }
    }

    getProductById(idBuscado) {
        const busqueda = this.products.find(
            (objeto) => objeto.id === idBuscado,
        );

        if (busqueda) {
            console.log(`Objeto con el id:${idBuscado} encontrado:`, busqueda);
        } else {
            console.log(`No se encontró ningún objeto con el id:${idBuscado}`);
        }
    }

    addProduct(objeto = {}) {
        // desestructurando para agregar al producto
        const { title, description, price, thumbnail, code, stock } = objeto;
        // definiendo el modelo de producto
        const product = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        };
        // agregando validacion para que no se agregue si faltan propiedades
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            // array de props que faltan definir
            const propiedadesFaltantes = [];
            // bucle que comprueba cuales faltan y las agrega al array
            for (const key in product) {
                if (!product[key]) {
                    propiedadesFaltantes.push(key);
                }
            }
            return console.error(
                "Faltan definir las propiedades:",
                propiedadesFaltantes.join(", "),
            );
        }
        // agregando id al producto nuevo
        if (this.products.length === 0) {
            product.id = 0;
        } else {
            let maxId = -1;
            for (const object of this.products) {
                if (object.id > maxId) {
                    maxId = object.id + 1;
                }
            }
            product.id = maxId;
        }

        // validación que no se repita el valor de la propiedad code entre productos del array de productos
        const existe = this.products.some(
            (objeto) => objeto.code === product.code,
        );

        if (!existe) {
            // agregamos los productos agregados y le sumamos el nuevo
            this.products.push(product);
            // actualizamos la lista con el producto nuevo
            fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
            // mostramos todo en consola
            console.log(`Producto agregado correctamente con id:${product.id}`);
        } else {
            return console.error(
                `ya existe un producto con ese codigo: "${product.code}"`,
            );
        }
    }

    updateProduct(idBuscado, propiedadesActualizadas) {
        const busqueda = this.products.find(
            (objeto) => objeto.id === idBuscado,
        );

        if (busqueda) {
            console.log("Se encontró el siguiente producto", busqueda);
            for (const propiedad in propiedadesActualizadas) {
                if (Object.prototype.hasOwnProperty.call(busqueda, propiedad)) {
                    busqueda[propiedad] = propiedadesActualizadas[propiedad];
                }
            }
            busqueda.id = idBuscado;
            this.deleteProduct(idBuscado);
            this.addProduct(busqueda);
            console.log("Producto actualizado:", busqueda);
        } else {
            console.log("ID no encontrado en la base de datos");
        }
    }

    deleteProduct(idBuscado) {
        const busqueda = this.products.find(
            (objeto) => objeto.id === idBuscado,
        );

        if (busqueda) {
            const objetoEliminado = this.products.filter(
                (objeto) => objeto.id !== idBuscado,
            );
            // ordenamos de menor id a mayor id
            this.products = objetoEliminado.sort((a, b) => a.id - b.id);
            // actualizamos la lista con el producto nuevo
            fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
            console.log(`Objeto con el id:${idBuscado} encontrado y eliminado`);
        } else if (idBuscado === undefined) {
            console.log("Se requiere el id para eliminar el producto");
        } else {
            console.log(`No se encontró ningún objeto con el id:${idBuscado}`);
        }
    }
}
// instanciamos
const productManager = new ProductManager("./data.json");
// ver productos existentes
productManager.getProducts();
// agregar producto
productManager.addProduct({
    title: "producto prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc123",
    stock: 25,
});
// ver producto nuevamente
productManager.getProducts();
// ver producto por id
productManager.getProductById(0);
// id que no existe
productManager.getProductById(10);
// actualizar producto
productManager.updateProduct(0, { title: "producto actualizado" });
// delete product con id no existente
productManager.deleteProduct(10);
// delete product
productManager.deleteProduct(0);
