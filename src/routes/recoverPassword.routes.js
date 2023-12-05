import { Router } from "express";
import { transporter } from "../helpers/nodemailer.js";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
//JWT
import jwt from "jsonwebtoken";
const secretJWT = process.env.SECRETJWT;
//MONGOOSE
import { UserModel } from "../dao/models/user.model.js";

export const recoverPasswordRouter = Router();

recoverPasswordRouter.get("/recoverPassword", (req, res) => {
    res.render("recoverView");
});

recoverPasswordRouter.post("/recoverPassword", async (req, res) => {
    const { email } = req.body;
    console.log(email);
    if (!email) {
        return res.status(400).send("email no proporcionado");
    }

    const userFound = await UserModel.findOne({ email: email });
    if (userFound.length == 0) {
        return res.status(404).send("user not found");
    }

    console.log(userFound);

    const payload = {
        id: userFound._id,
        name: userFound.name,
        email: userFound.email,
    };

    const token = jwt.sign(payload, secretJWT, { expiresIn: "1h" });

    const mail = {
        from: `Ecommerce Coderhouse ${"ecommercecoderhouse295@gmail.com"}`,
        to: email,
        subject: "Recuperación de contraseña",
        text: `
        Hola ${userFound.name},
  
        Recientemente solicitaste recuperar tu contraseña. Para hacerlo, haz clic en el siguiente enlace:
  
        http://localhost:8080/recoverpassword/link/${token}
        
  
        Este enlace caducará en 30 minutos. Si no puedes hacer clic en el enlace, copia y pega la URL en tu navegador.
  
        Gracias,
        Ecommerce Coderhouse
      `,
    };
    const result = await transporter.sendMail(mail);
    res.redirect("/recoverPassword/user");
});

recoverPasswordRouter.get("/recoverPassword/user", (req, res) => {
    res.status(200).send(
        "se ha enviado un enlace de recuperacion a su correo electronico",
    );
});

recoverPasswordRouter.get("/recoverpassword/link/:token", (req, res) => {
    const { token } = req.params;
    console.log(token);
    try {
        const decodedToken = jwt.verify(token, secretJWT);
        // Si llega aquí, el token es válido
        res.send("tokenValidated");
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            // Token expirado, manejar según sea necesario
            console.error("El token ha expirado");
            res.status(400).send("token invalido");
        } else {
            // Otro tipo de error, manejar según sea necesario
            console.error("Error al verificar el token:", error.message);
            res.status(400).send("token invalido");
        }
    }
});
