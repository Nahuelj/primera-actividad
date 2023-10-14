import passport from "passport";
import passportLocal from "passport-local";
import { UserModel } from "../dao/models/user.model.js";
import bcrypt from "bcrypt";

const LocalStrategy = passportLocal.Strategy;

export const initializePassport = () => {
    passport.use(
        "register",
        new LocalStrategy(
            { passReqToCallback: true, usernameField: "email" },
            async (req, email, password, done) => {
                const { name } = req.body;
                console.log("iniciando");
                if (email === "adminCoder@coder.com") {
                    return done(null, false);
                }

                try {
                    if (!email || !password || !name) {
                        console.log("falta");
                        return done(null, false);
                    }

                    let salt = bcrypt.genSaltSync(10);
                    const hashed_password = await bcrypt.hash(password, salt);

                    const findUser = await UserModel.find({
                        email: email,
                    });

                    if (findUser.length === 0) {
                        console.log("no existe");
                        const user = await UserModel.create({
                            name,
                            email,
                            password: hashed_password,
                        });
                        console.log("creado");

                        return done(null, user);
                    } else {
                        console.log("existe");
                        return done(null, false);
                    }
                } catch (error) {
                    console.error(error);
                }
            },
        ),
    );

    passport.serializeUser((user, done) => {
        console.log(user._id);
        done(null, user._id);
    });

    passport.deserializeUser(async (idUser, done) => {
        const user = await UserModel.findOne({ _id: idUser });
        done(null, user);
    });
};
