export const adminAuth = (req, res, next) => {
    const user = req.user;
    if (user.role === "admin") {
        next();
    } else if (user.role === "premium") {
        next();
    } else {
        res.render("invalidCredentials", { role: "user" });
    }
};

export const userAuth = (req, res, next) => {
    const user = req.user;
    if (user.role == "user") {
        next();
    } else if (user.role == "premium") {
        next();
    } else {
        res.frender("invalidCredentials", { role: "admin" });
    }
};
