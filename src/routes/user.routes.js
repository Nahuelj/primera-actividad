import { UserModel } from "../dao/models/user.model.js";
import { Router } from "express";
import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(req.params);
        const { type } = req.params;
        console.log(type);
        let folder = type;
        cb(null, `uploads/${folder}`);
        console.log(folder);
    },
    filename: function (req, file, cb) {
        const { uid } = req.params;
        console.log(uid);
        cb(null, uid + "-" + Date.now() + file.originalname);
    },
});

const upload = multer({ storage: storage });

export const routerUserPremium = Router();

routerUserPremium.post(
    "/users/:uid-:type/documents",
    upload.single("myFile"),
    (req, res) => {
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
        const nombresABuscar = [
            "identificacion",
            "comprobante de domicilio",
            "comprobante de estado de cuenta",
        ];
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
