import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

export const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    auth: {
        user: process.env.MAIL,
        pass: process.env.MAILPASSWORD,
    },
    tls: {
        rejectUnauthorized: false,
    },
});
