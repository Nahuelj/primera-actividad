import { Router } from "express";
import passport from "passport";
import { sessionController } from "../controllers/session.controller.js";

export const sessionsRouter = Router();

sessionsRouter.post(
    "/session/register",
    passport.authenticate("register", {
        failureRedirect: "/failregister",
        successRedirect: "/login",
    }),
    sessionController.register,
);

sessionsRouter.get("/failregister", sessionController.failed);

sessionsRouter.post(
    "/session/login",
    passport.authenticate("login", {
        failureRedirect: "/failregister",
    }),
    sessionController.login,
);

sessionsRouter.get("/session/logout", sessionController.logout);

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
    sessionController.session,
);

sessionsRouter.get("/session/current", sessionController.current);

sessionsRouter.get("/redirect", (req, res) => {
    if (req.user.role == "admin") {
        res.redirect("/realtimeproducts");
    } else {
        res.redirect("/products");
    }
});
