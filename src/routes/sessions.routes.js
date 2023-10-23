import { Router } from "express";
import passport from "passport";

export const sessionsRouter = Router();

sessionsRouter.post(
    "/session/register",
    passport.authenticate("register", {
        failureRedirect: "/failregister",
        successRedirect: "/login",
    }),
    async (req, res) => {
        res.send({ status: "succes", message: "user registered" });
    },
);

sessionsRouter.get("/failregister", (req, res) => {
    res.send("something went wrong");
});

sessionsRouter.post(
    "/session/login",
    passport.authenticate("login", {
        failureRedirect: "/failregister",
    }),
    async (req, res) => {
        console.log("req user", req.user);
        const { first_name } = req.user;
        req.session.user = req.user;
        res.redirect(`/products?name=${first_name}`);
    },
);

sessionsRouter.get("/session/logout", (req, res) => {
    req.session.destroy((e) => console.log(e));
    res.redirect("/login");
});

sessionsRouter.get(
    "/session/github",
    passport.authenticate("github", {}),
    (req, res) => {},
);

sessionsRouter.get(
    "/session/github/callback",
    passport.authenticate("github", {
        failureRedirect: "/failregister",
    }),
    (req, res) => {
        const { name } = req.user;
        req.session.user = req.user;
        res.redirect(`/products?name=${name}`);
    },
);

sessionsRouter.get("/api/session/current", (req, res) => {
    console.log(req.session);
    console.log(req.session.user);
    res.send(req.session.user);
});
