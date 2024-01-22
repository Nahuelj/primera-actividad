import { Router } from "express";
import { transporter } from "../helpers/nodemailer.js";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
//JWT
import jwt from "jsonwebtoken";
//MONGOOSE
import { UserModel } from "../dao/models/user.model.js";
import bcrypt from "bcrypt";

export const recoverPasswordRouter = Router();

recoverPasswordRouter.get("/recoverPassword", (req, res) => {
    res.render("recoverView");
});

recoverPasswordRouter.post("/recoverPassword", async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).send("email no proporcionado");
    }

    const userFound = await UserModel.findOne({ email: email });
    if (userFound.length == 0) {
        return res.status(404).send("user not found");
    }

    const payload = {
        id: userFound._id,
        name: userFound.first_name,
        email: userFound.email,
    };

    const token = jwt.sign(payload, process.env.SECRETJWT, { expiresIn: "1h" });

    const mail = {
        from: `Ecommerce Coderhousee ${"noreply@coderhouse.com"}`,
        to: email,
        subject: "Recuperación de contraseña",
        text: `
        Hola ${userFound.first_name},
  
        Recientemente solicitaste recuperar tu contraseña. Para hacerlo, haz clic en el siguiente enlace:
  
        http://localhost:8080/recoverPassword/link/${token}
        
  
        Este enlace caducará en 30 minutos. Si no puedes hacer clic en el enlace, copia y pega la URL en tu navegador.
  
        Gracias,
        Ecommerce Coderhouse
      `,
    };
    await transporter.sendMail(mail);
    res.redirect("/recoverPassword/user");
});

recoverPasswordRouter.get("/recoverPassword/user", (req, res) => {
    res.status(200).send(
        "se ha enviado un enlace de recuperacion a su correo electronico",
    );
});

recoverPasswordRouter.get("/recoverPassword/link/:token", (req, res) => {
    const { token } = req.params;
    try {
        // const decodedToken = jwt.verify(token, process.env.SECRETJWT);
        // Si llega aquí, el token es válido
        const hr = 60 * 60 * 1000;
        res.cookie("token", token, { httpOnly: true, maxAge: hr });
        res.redirect("/recoverPassword/recover");
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            // Token expirado, manejar según sea necesario
            console.error("El token ha expirado");
            res.status(400).redirect("/recoverPassword/recover");
        } else {
            // Otro tipo de error, manejar según sea necesario
            console.error("Error al verificar el token:", error.message);
            res.status(400).send("invalid credentials");
        }
    }
});

recoverPasswordRouter.get("/recoverPassword/recover", (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            res.send("invalid credentials");
        }

        const validatedJWT = jwt.verify(token, process.env.SECRETJWT);
        res.render("validated");
    } catch (error) {
        // Otro tipo de error, manejar según sea necesario
        console.error("Error al verificar el token:", error.message);
        res.status(400).send("invalid credentials");
    }
});

recoverPasswordRouter.post("/recoverPassword/validated", async (req, res) => {
    const { password1, password2 } = req.body;
    if (password1 != password2 || (!password1 && !password2)) {
        return res
            .status(400)
            .send("error al confirmar la contraseña, debe escribirla igual");
    }

    let salt = bcrypt.genSaltSync(10);
    const hashed_password = await bcrypt.hash(password1, salt);

    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(400).send("invalid credentials");
        }

        const validatedToken = jwt.verify(token, process.env.SECRETJWT);
        const decodedToken = jwt.decode(token);
        const email = decodedToken.email;

        const userFound = await UserModel.findOneAndUpdate(
            { email: email },
            { password: hashed_password },
            { new: true },
        );

        res.json(userFound);
    } catch (error) {
        res.status(400).send("invalid credentials");
    }
});
