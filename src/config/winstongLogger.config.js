import winston from "winston";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const customFormat = winston.format.printf(({ level, message, timestamp }) => {
    return `{"level":"${level}","timestamp":"${timestamp}","message":"${message}"},`;
});

const logger = winston.createLogger({
    level: "error",

    transports: [
        new winston.transports.File({
            filename: "errorLogs.txt",
            format: winston.format.combine(
                winston.format.timestamp({
                    format: "YYYY-MM-DD HH:mm:ss",
                }),
                customFormat,
            ),
        }),
    ],
});

if (process.env.MODE === "-D") {
    logger.add(
        new winston.transports.Console({
            level: "debug",
            format: winston.format.simple(),
        }),
    );
}

export const middlewareLogger = (req, res, next) => {
    req.logger = logger;
    next();
};
