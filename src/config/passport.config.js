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

                try {
                    if (!email || !password || !name) {
                        return done(null, false);
                    }

                    let salt = bcrypt.genSaltSync(10);
                    const hashed_password = await bcrypt.hash(password, salt);

                    const findUser = await UserModel.findOne({
                        email: email,
                    });

                    if (!findUser) {
                        const user = await UserModel.create({
                            name,
                            email,
                            password: hashed_password,
                        });

                        return done(null, user);
                    }

                    return done(null, false);
                } catch (error) {
                    return done(error);
                }
            },
        ),
    );

    passport.use(
        "login",
        new LocalStrategy(
            { passReqToCallback: true, usernameField: "email" },
            async (req, email, password, done) => {
                try {
                    const findUser = await UserModel.findOne({ email: email });

                    if (!findUser) {
                        return done(null, false);
                    } else {
                        const compare = await bcrypt.compare(
                            password,
                            findUser.password,
                        );

                        if (compare) {
                            return done(null, findUser);
                        } else {
                            // Contraseña incorrecta
                            return done("incorrect password");
                        }
                    }
                } catch (error) {
                    return done(error);
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
