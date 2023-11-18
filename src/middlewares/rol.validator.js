export const adminAuth = (req, res, next) => {
    if (req.user) {
        const user = req.user;
        if (user.role.role != "admin") {
            res.redirec("/login");
        } else {
            next();
        }
    } else {
        res.redirect("/login");
    }
};

export const userAuth = (req, res, next) => {
    if (req.user) {
        const user = req.user;
        if (user.role.role != "user") {
            res.redirec("/login");
        } else {
            next();
        }
    } else {
        res.redirect("/login");
    }
};
