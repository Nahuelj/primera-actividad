import mongoose from "mongoose";
import { ProductModel } from "../models/product.model.js";

export class ProductManagerMongoDb {
    constructor() {
        this.connectToDatabase();
    }

    async connectToDatabase() {
        if (mongoose.connection.readyState === 1) {
            // La conexión ya está abierta (conectada)
            console.log("La base de datos ya está conectada.");
            return;
        }
        try {
            await mongoose.connect(
                "mongodb+srv://nahueljosebenitez7:123Coder@cluster0.93y9tit.mongodb.net/ecommerce",
                {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                },
            );
            console.log("Conexión exitosa a MongoDB");
        } catch (error) {
            console.error("Error de conexión a MongoDB:", error);
        }
    }

    async getProducts() {
        try {
            const products = await UserModel.find();
            if (products.length === 0) {
                return console.log("No products found");
            } else {
                return products;
            }
        } catch (error) {
            console.error("Error al obtener productos:", error);
        }
    }

    async getProductById(idBuscado) {
        try {
            const product = await UserModel.findOne({ id: idBuscado });
            if (product) {
                return product;
            } else {
                return `Product with id:${idBuscado} not found`;
            }
        } catch (error) {
            console.error("Error al obtener producto por ID:", error);
        }
    }

    async addProduct(objeto = {}) {
        try {
            const product = new UserModel(objeto);
            const result = await product.save();
            console.log(`Product successfully added with id:${result.id}`);
            return result;
        } catch (error) {
            console.error("Error al agregar producto:", error.message);
            return `Error al agregar producto: ${error.message}`;
        }
    }

    async updateProduct(idBuscado, propiedadesActualizadas) {
        try {
            const product = await UserModel.findOneAndUpdate(
                { id: idBuscado },
                propiedadesActualizadas,
                { new: true },
            );
            if (product) {
                return ["The product was updated", product];
            } else {
                return `Product with id:${idBuscado} not found`;
            }
        } catch (error) {
            console.error("Error al actualizar producto:", error);
        }
    }

    async deleteProduct(idBuscado) {
        try {
            const product = await UserModel.findOneAndDelete({ id: idBuscado });
            if (product) {
                return `Object with id:${idBuscado} found and removed`;
            } else if (idBuscado === undefined) {
                return "The id is required to delete the product";
            } else {
                return `Product with id:${idBuscado} not found`;
            }
        } catch (error) {
            console.error("Error al eliminar producto:", error);
        }
    }
}
