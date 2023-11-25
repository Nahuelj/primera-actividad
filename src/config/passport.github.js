import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { UserModel } from "../dao/models/user.model.js";
import { logger } from "../config/winstongLogger.config.js";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

passport.use(
    "github",
    new GitHubStrategy(
        {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: process.env.CALLBACK_URL,
            scope: ["user:email"],
        },
        async function (accessToken, refreshToken, profile, done) {
            let emailFound = await profile.emails[0].value;
            logger.info(`emailjson ${emailFound}`);

            const userFound = await UserModel.findOne({ email: emailFound });
            logger.info(`userfound ${userFound}`);

            if (!userFound) {
                const user = await UserModel.create({
                    name: profile._json.name,
                    email: emailFound,
                    github: profile,
                });
                logger.info(`userCreate ${user}`);

                return done(null, user);
            }
            logger.info(`encontrado ${userFound}`);

            return done(null, userFound);
        },
    ),
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await UserModel.findOne({ _id: id });
    done(null, user);
});
