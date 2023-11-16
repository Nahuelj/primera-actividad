import { UserCurrent } from "../dto/dto.js";

class Session_Controller {
    register(req, res) {
        res.send({ status: "success", message: "user registered" });
    }

    failed(req, res) {
        res.send("something went wrong");
    }

    login(req, res) {
        const { first_name } = req.user;
        req.session.user = req.user;
        res.redirect(`/products?name=${first_name}`);
    }

    logout(req, res) {
        req.session.destroy((e) => console.log(e));
        res.redirect("/login");
    }

    session(req, res) {
        const { name } = req.user;
        req.session.user = req.user;
        res.redirect(`/products?name=${name}`);
    }

    current(req, res) {
        if (req.user) {
            const currentUser = new UserCurrent(req.user);
            res.json(currentUser);
        } else {
            res.redirect("/login");
        }
    }
}

export const sessionController = new Session_Controller();
