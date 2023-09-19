import express from "express";
import handlebars from "express-handlebars";
import { __dirname } from "./utils.js";
import { productsRouter } from "./routes/products.routes.js";
import { cartsRouter } from "./routes/carts.routes.js";
import { viewsRouter } from "./routes/views.routes.js";
import { Server } from "socket.io";
import mongoose from "mongoose";

// Express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.disable("x-powered-by");
// Routers
app.use("/api", productsRouter);
app.use("/api", cartsRouter);
app.use(viewsRouter);
//Handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));
// Route not found
app.use((req, res) => {
    res.status(404).send("Page not found");
});
// Listen
const PORT = 8080;
const httpServer = app.listen(
    PORT,
    console.log(`Servidor corriendo en http://localhost:${PORT}`),
);
// Socket.io
export const io = new Server(httpServer);

io.on("connection", (socket) => {
    console.log(`se ha conectado un cliente con id: ${socket.id}`);
});

//MongoDb connection

async function connectToDatabase() {
    try {
        await mongoose.connect(
            "mongodb+srv://nahueljosebenitez7:123Coder@cluster0.93y9tit.mongodb.net/ecommerce",
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            },
        );
        console.log("Successful connection to MongoDB");
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
}

connectToDatabase();
