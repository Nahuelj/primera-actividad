class ProductManager {
    constructor(){
        this.products = [];
    }

    getProducts(){
        console.log(this.products);
    }

    getProductById(idBuscado){
        let busqueda = this.products.find((objeto) => objeto.id === idBuscado);

        if (busqueda) {
            console.log(`Objeto con el id:${idBuscado} encontrado:`, busqueda);
          } else {
            console.log (`No se encontró ningún objeto con el id:${idBuscado}`);
          }
    }

    addProduct(title, description, price, thumbnail, code, stock){
// creacion de objeto producto
        let product = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        };

// agregando id al producto nuevo 

        if(this.products.length === 0){
            product.id = 0;
        }else {
            product.id = this.products[this.products.length - 1].id + 1;
        }

// validacion que no falta ninguna propiedad de producto
        let validation = Object.values(product);

        validation.forEach(element => {
            if(element == undefined){
                return console.error("faltan propiedades en el producto"); 
            }
        });

// validación que no se repita el valor de la propiedad code entre productos del array de productos
    const existe = this.products.some((objeto) => objeto["code"] == product["code"]);

    if(!existe){
        this.products.push(product);
        console.log(`Producto agregado correctamente con id:${product.id}`);
    }else{
        console.error(`ya existe un producto con ese codigo: "${product.code}"`);
    }
    }
}

const productManager = new ProductManager();

productManager.getProducts();

productManager.addProduct(  "producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25 );

productManager.getProducts();

productManager.addProduct(  "producto prueba", "Este es un producto prueba", 200, "Sin imagen", "adf12313", 25 );

productManager.getProducts();

productManager.addProduct(  "producto prueba", "Este es un producto prueba", 200, "Sin imagen", "adf12313", 25 );

productManager.getProductById(0);
productManager.getProductById(1);
productManager.getProductById(2);

productManager.getProducts();












