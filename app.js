const express = require("express");
const { ProductManager } = require("./productManager.js");
const Manager = new ProductManager();
const app = express();
const PORT = 1234;
app.listen(PORT, console.log(`Servidor corriendo en http://localhost:${PORT}`));

app.get("/", (req, res) => {
    res.send(
        "Bienvenido: /products para ver todos los productos o /products/:id para ver un producto especifico según su id",
    );
});

// agregar query param !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
app.get("/products", (req, res) => {
    const products = Manager.getProducts();
    res.json(products);
});

app.get("/products/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const product = Manager.getProductById(id);
    if (!product) {
        return res.status(404).send("Product not found");
    }
    return res.json(product);
});
