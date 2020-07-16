const winston = require("winston");

const dateFormat = () => {
    return new Date(Date.now()).toLocaleString();
};

const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    // defaultMeta: { service: "user-service" },
    transports: [
        //
        // - Write all logs with level `error` and below to `error.log`
        // - Write all logs with level `info` and below to `combined.log`
        //
        new winston.transports.File({
            filename: "./logs/error.log",
            level: "error",
        }),
        new winston.transports.File({filename: "./logs/combined.log"}),
    ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== "production") {
    logger.add(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.printf(state => {
                    return `(${dateFormat()}): [${state.method}] -- ${state.path} -- ${state.status}`;
                })
            ),
        })
    );
}

module.exports = logger;
