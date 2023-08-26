import fs from "fs";

export class CartManager {
    constructor(ruta = "./src/carts.json") {
        this.path = ruta;
        this.createFile();
    }

    createFile() {
        try {
            fs.readFileSync(this.path, "utf8");
            console.log("File found");
        } catch (error) {
            console.log("File not found, it will be created");
            fs.writeFileSync(this.path, JSON.stringify([], null, 2));
        }
    }
}
