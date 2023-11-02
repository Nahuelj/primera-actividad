import { ProductModel } from "../models/product.model.js";

export class ProductManager {
    async getProducts(query, pageArg, limitArg, sortArg) {
        try {
            const options = {
                page: pageArg, // Página que deseas recuperar
                limit: limitArg, // Cantidad de documentos por página
                sort: sortArg, // ordenamiento
                lean: true,
            };

            const filters = query;

            const products = await ProductModel.paginate(filters, options);
            const {
                docs,
                totalDocs,
                limit,
                totalPages,
                page,
                pagingCounter,
                hasPrevPage,
                hasNextPage,
                prevPage,
                nextPage,
            } = products;

            const dataPaginate = {
                status: "success",
                payload: await docs,
                totalDocs,
                limit,
                totalPages,
                page,
                pagingCounter,
                hasPrevPage,
                hasNextPage,
                prevPage,
                nextPage,
                nextLink: hasNextPage ? "link siguiente" : null,
                prevLink: hasPrevPage ? "link anterior" : null,
            };
            if (dataPaginate.payload.length === 0) {
                return "No products found";
            } else {
                return dataPaginate;
            }
        } catch (error) {
            console.error("Error al obtener productos:", error);
        }
    }

    async getProductById(idBuscado) {
        try {
            const product = await ProductModel.findOne({ _id: idBuscado });
            if (product) {
                return product;
            } else {
                return `Product with id:${idBuscado} not found`;
            }
        } catch (error) {
            return "Error fetching product";
        }
    }

    async addProduct(objeto = {}) {
        try {
            const product = new ProductModel(objeto);
            const result = await product.save();
            console.log(`Product successfully added with id:${result._id}`);
            return result;
        } catch (error) {
            if (error.code === 11000 && error.keyPattern.code) {
                console.log(`Product with code ${objeto.code} already exists`);
                return `Product with code ${objeto.code} already exists`;
            }
            console.error("Error adding product:", error.message);
            return `Error adding product: ${error.message}`;
        }
    }

    async updateProduct(idBuscado, propiedadesActualizadas) {
        try {
            const product = await ProductModel.findOneAndUpdate(
                { _id: idBuscado },
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
            const product = await ProductModel.findOneAndDelete({
                _id: idBuscado,
            });
            if (product) {
                return product;
            } else if (idBuscado === undefined) {
                return "The id is required to delete the product";
            } else {
                return `Product with id:${idBuscado} not found`;
            }
        } catch (error) {
            console.error("Something went wrong:", error);
        }
    }
}

export const productManager = new ProductManager();
