import express from "express";
import { productsRouter } from "./routes/products.routes.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.disable("x-powered-by");
app.use("/api", productsRouter);

const PORT = 8080;
app.listen(PORT, console.log(`Servidor corriendo en http://localhost:${PORT}`));
