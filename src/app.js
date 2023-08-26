import express from "express";
import { productsRouter } from "./routes/products.routes.js";
import { cartsRouter } from "./routes/carts.routes.js";
// Express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.disable("x-powered-by");
// Routers
app.use("/api", productsRouter);
app.use("/api", cartsRouter);
//Route not found
app.use((req, res) => {
    res.status(404).send("Page not found");
});
// Listen
const PORT = 8080;
app.listen(PORT, console.log(`Servidor corriendo en http://localhost:${PORT}`));
