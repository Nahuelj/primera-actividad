import { logger } from "../config/winstongLogger.config.js";

export function errorHandler(error, req, res, next) {
    if (error) {
        if (error.code) {
            logger.info(`${error.name}: ${error}`);
            return res.status(error.code).json({ error: error.message });
        } else {
            return res.status(500).json({ error: "Something went wrong" });
        }
    }
    next();
}
