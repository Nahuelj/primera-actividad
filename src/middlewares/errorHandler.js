export function errorHandler(error, req, res, next) {
    if (error) {
        if (error.code) {
            console.log(`${error.name}: ${error.description}`);
            return res.status(error.code).json({ error: error.message });
        } else {
            return res.status(500).json({ error: "Something went wrong" });
        }
    }
}
