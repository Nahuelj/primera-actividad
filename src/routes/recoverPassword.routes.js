import { Router } from "express";
import { transporter } from "../helpers/nodemailer.js";

export const recoverPasswordRouter = Router();

recoverPasswordRouter.get("/recoverPassword", (req, res) => {
    res.render("recoverView");
});

recoverPasswordRouter.post("/recoverPassword", async (req, res) => {
    const { email } = req.body;
    const mail = {
        from: `Ecommerce Coderhouse ${"ecommercecoderhouse295@gmail.com"}`,
        to: email,
        subject: "Asunto del correo",
        text: "Este es el cuerpo del correo",
    };
    const result = await transporter.sendMail(mail);
    res.redirect("/recoverPassword/user");
});

recoverPasswordRouter.get("/recoverPassword/user", (req, res) => {
    res.status(200).send(
        "se ha enviado un enlace de recuperacion a su correo electronico",
    );
});
