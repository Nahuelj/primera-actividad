export class Session_Controller {
    async register() {
        async (req, res) => {
            res.send({ status: "succes", message: "user registered" });
        };
    }

    async failed() {
        (req, res) => {
            res.send("something went wrong");
        };
    }

    async login() {
        async (req, res) => {
            console.log("req user", req.user);
            const { first_name } = req.user;
            req.session.user = req.user;
            res.redirect(`/products?name=${first_name}`);
        };
    }

    async logout() {
        (req, res) => {
            req.session.destroy((e) => console.log(e));
            res.redirect("/login");
        };
    }

    async session() {
        (req, res) => {
            const { name } = req.user;
            req.session.user = req.user;
            res.redirect(`/products?name=${name}`);
        };
    }

    async current() {
        (req, res) => {
            if (req.user) {
                res.send(req.user);
            } else {
                res.redirect("/login");
            }
        };
    }
}

export const sessionController = new Session_Controller();
