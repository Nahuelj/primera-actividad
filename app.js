const express = require("express");
const { ProductManager } = require("./productManager.js");
const Manager = new ProductManager();
const app = express();
const PORT = 1234;
app.listen(PORT, console.log(`Servidor corriendo en http://localhost:${PORT}`));

app.get("/", (req, res) => {
    res.send(
        "Bienvenido: /products para ver todos los productos o /products/:pid para ver un producto especifico según su id",
    );
});

app.get("/products", (req, res) => {
    const limit = parseInt(req.query.limit);
    const products = Manager.getProducts();
    if (limit) {
        const limitedProducts = products.slice(0, limit);
        return res.json(limitedProducts);
    }
    return res.json(products);
});

app.get("/products/:pid", (req, res) => {
    const pid = parseInt(req.params.pid);
    const product = Manager.getProductById(pid);
    if (!product) {
        return res.status(404).send("Product not found");
    }
    return res.json(product);
});
