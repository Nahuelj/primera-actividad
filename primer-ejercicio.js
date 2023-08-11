class ProductManager {
    constructor(ruta) {
        this.products = [];
        this.path = ruta;
    }

    getProducts() {
        console.log("Tus productos son:", this.products);
    }

    getProductById(idBuscado) {
        let busqueda = this.products.find((objeto) => objeto.id === idBuscado);

        if (busqueda) {
            console.log(`Objeto con el id:${idBuscado} encontrado:`, busqueda);
        } else {
            console.log(`No se encontró ningún objeto con el id:${idBuscado}`);
        }
    }

    addProduct(objeto = {}) {
        // desestructurando para agregar al producto
        const { title, description, price, thumbnail, code, stock } = objeto
        // definiendo el modelo de producto
        let product = {
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            code: code,
            stock: stock,
        };
        // agregando validacion para que no se agregue si faltan propiedades
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            //array de props que faltan definir
            let propiedadesFaltantes = [];
            // bucle que comprueba cuales faltan y las agrega al array
            for (let key in product) {
                if(!product[key]){
                    propiedadesFaltantes.push(key);
                }
            }
            return console.error("Faltan definir las propiedades:", propiedadesFaltantes.join(", "))
        }

        // agregando id al producto nuevo 
        if (this.products.length === 0) {
            product.id = 0;
        } else {
            product.id = this.products[this.products.length - 1].id + 1;
        }

        // validación que no se repita el valor de la propiedad code entre productos del array de productos
        const existe = this.products.some((objeto) => objeto["code"] == product["code"]);

        if (!existe) {
            this.products.push(product);
            console.log(`Producto agregado correctamente con id:${product.id}`);
        } else {
            return console.error(`ya existe un producto con ese codigo: "${product.code}"`);
        }
    }

    upadateProduct(idBuscado, propiedadesActualizadas) {
        let busqueda = this.products.find((objeto) => objeto.id === idBuscado);

        if (busqueda) {
            console.log("Se encontró el siguiente producto", busqueda)
            for (const propiedad in propiedadesActualizadas) {

                if (busqueda.hasOwnProperty(propiedad)) {
                    busqueda[propiedad] = propiedadesActualizadas[propiedad];
                }
            }
            busqueda.id = idBuscado;
            console.log('Producto actualizado:', busqueda);

        } else {
            console.log('ID no encontrado en la base de datos');
        }
    }

    deleteProduct(idBuscado){
        let busqueda = this.products.find((objeto) => objeto.id === idBuscado);

        if (busqueda) {
            let objetoEliminado = this.products.filter((objeto) => objeto.id !== idBuscado);
            this.products = objetoEliminado;
            console.log(`Objeto con el id:${idBuscado} encontrado y eliminado`);

        }else if (idBuscado === undefined){
            console.log('Se requiere el id para eliminar el producto');

        } else {
            console.log(`No se encontró ningún objeto con el id:${idBuscado}`);
        }
    }
}

const productManager = new ProductManager();

// ver productos
productManager.getProducts();

// agregar producto nuevo 
productManager.addProduct({ title: "producto prueba", description: "Este es un producto prueba", price: 200, thumbnail: "Sin imagen", code: "abc123", stock: 25 });

// agregar otro producto nuevo 
productManager.addProduct({ title: "producto prueba1", description: "Este es un producto prueba1", price: 200, thumbnail: "Sin imagen1", code: "abc1asdf23", stock: 25 });

// agregar producto con codigo repetido
productManager.addProduct({ title: "producto prueba", description: "Este es un producto prueba", price: 200, thumbnail: "Sin imagen", code: "abc1asdf23", stock: 25 });

//agregar producto con props faltantes
productManager.addProduct({ description: "Este es un producto prueba", price: 200, thumbnail: "Sin imagen" });

// agregar producto sin propiedades
productManager.addProduct();

// agregar producto con propiedades erroneas 
productManager.addProduct({ numero: 123, calle: "San Martin", manzana: "C"})

// mostrar productos creados 
productManager.getProducts();

// actualizar un producto
productManager.upadateProduct(0, {title: "Jamon crudo"})

// actualizar un producto con propiedades erroneas 
productManager.upadateProduct(1, {name: "Damian", title: "producto actualizado"})

// ver producto actualizado
productManager.getProducts();

// eliminar producto por id
productManager.deleteProduct(10);

productManager.getProducts(); 











