import { UserModel } from "../dao/models/user.model.js";
import { Router } from "express";
import multer from "multer";

let nameFile = "";
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const { type } = req.params;
        if (type == "profile") {
            cb(null, `uploads/profile`);
        } else if (type == "products") {
            cb(null, `uploads/products`);
        } else {
            cb(null, `uploads/documents`);
        }
    },
    filename: function (req, file, cb) {
        const { uid, type } = req.params;
        nameFile = uid + "-" + type + "-" + file.originalname;
        cb(null, uid + "-" + type + "-" + file.originalname);
    },
});

const upload = multer({ storage: storage });

export const routerUserPremium = Router();

routerUserPremium.post(
    "/users/:uid-:type/documents",
    upload.single("myFile"),
    async (req, res) => {
        const { type, uid } = req.params;
        let folder = "";

        if (type == "profile") {
            folder = "profile";
        } else if (type == "products") {
            folder = "products";
        } else {
            folder = "documents";
        }

        const userFound = await UserModel.findOne({ _id: uid });
        const userDocuments = userFound.documents;
        const newDocumentsUser = [
            ...userDocuments,
            { name: type, reference: `/src/uploads/${folder}/${nameFile}` },
        ];

        userFound.documents = newDocumentsUser;
        const userSaved = await userFound.save();
        console.log(userSaved);

        res.json({ message: "file uploaded" });
    },
);

routerUserPremium.put("/users/premium/:uid", async (req, res) => {
    const { uid } = req.params;

    const userFound = await UserModel.findOne({ _id: uid });

    if (userFound == []) {
        res.status(404).json("user not found");
    }

    if (userFound.role == "user") {
        function contieneTodasPropiedades(array, nombres) {
            return nombres.every((nombre) =>
                array.some((objeto) => objeto.name === nombre),
            );
        }
        const nombresABuscar = ["identification", "address", "statusCount"];
        const resultado = contieneTodasPropiedades(
            userFound.documents,
            nombresABuscar,
        );
        if (resultado) {
            const User = await UserModel.findOneAndUpdate(
                { _id: uid },
                { role: "premium" },
            );
            res.status(200).json("usuario pasado a premium");
        } else {
            res.status(400).json("usuario no cuenta con la documentación");
        }
    } else if (userFound.role == "admin") {
        res.status(200).json("usuario admin no puede ser premiums");
    } else if (userFound.role == "premium") {
        const User = await UserModel.findOneAndUpdate(
            { _id: uid },
            { role: "user" },
        );
        res.status(200).json("usuario pasado a user");
    }
});
