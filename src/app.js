import express from "express";
import { ProductManager } from "./productManager.js";
import { productsRouter } from "./routes/products.routes.js";

export const Manager = new ProductManager();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", productsRouter);

const PORT = 8080;
app.listen(PORT, console.log(`Servidor corriendo en http://localhost:${PORT}`));
