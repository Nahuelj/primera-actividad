import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { UserModel } from "../dao/models/user.model.js";

passport.use(
    "github",
    new GitHubStrategy(
        {
            clientID: "Iv1.3bae0be216cb0e9b",
            clientSecret: "45f99e06c8781e77630b048612a513317070cca3",
            callbackURL: "http://localhost:8080/session/github/callback",
            scope: ["user:email"],
        },
        async function (accessToken, refreshToken, profile, done) {
            let emailFound = await profile.emails[0].value;
            console.log("emailjson", emailFound);

            const userFound = await UserModel.findOne({ email: emailFound });
            console.log("userfound", userFound);

            if (!userFound) {
                const user = await UserModel.create({
                    name: profile._json.name,
                    email: emailFound,
                    github: profile,
                });
                console.log("userCreate", user);
                return done(null, user);
            }
            console.log("encontrado", userFound);
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
