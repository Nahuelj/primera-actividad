import winston, { transports } from "winston";

export const logger = winston.createLogger({
    level: "debug",
    format: winston.format.simple(),
    transports: [new winston.transports.Console()],
});

if (true) {
    logger.add(
        new winston.transports.File({
            filename: "logs.txt",
        }),
    );
}
