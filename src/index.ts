import dotenv from "dotenv";

const result = dotenv.config();
if (result.error) dotenv.config({ path: ".env.default" });

import app from "@/app";
import logger from "@/logger";
import util from "util";
import SafeMongooseConnection from "./database/safe-mongoose-connection";

const PORT = process.env.PORT || 4000;

let debugCallback;
if (process.env.NODE_ENV === "development") {
  debugCallback = (
    collectionName: string,
    method: string,
    query: any,
    _doc: string
  ): void => {
    const message = `${collectionName}.${method}(${util.inspect(query, {
      colors: true,
      depth: null,
    })})`;
    logger.log({
      level: "verbose",
      message,
      consoleLoggerOptions: { label: "MONGO" },
    });
  };
}

const safeMongooseConnection = new SafeMongooseConnection({
  mongoUrl: process.env.DB_CONNECTION_URL ?? "",
  debugCallback,
  onStartConnection: (mongoUrl) =>
    logger.info(`Connecting to MongoDB at ${mongoUrl}`),
  onConnectionError: (error, mongoUrl) =>
    logger.log({
      level: "error",
      message: `Could not connect to MongoDB at ${mongoUrl}`,
      error,
    }),
  onConnectionRetry: (mongoUrl) =>
    logger.info(`Retrying to MongoDB at ${mongoUrl}`),
});

const serve = () =>
  app.listen(PORT, () => {
    logger.info(`EXPRESS server started at http://localhost:${PORT}`);

    if (process.env.NODE_ENV === "development") {
      // This route is only present in development mode
      logger.info(`SWAGGER UI hosted at http://localhost:${PORT}/dev/api-docs`);
    }
  });

if (process.env.DB_CONNECTION_URL == null) {
  logger.error(
    "DB_CONNECTION_URL not specified in environment",
    new Error("DB_CONNECTION_URL not specified in environment")
  );
  process.exit(1);
} else {
  safeMongooseConnection.connect((mongoUrl) => {
    logger.info(`Connected to MongoDB at ${mongoUrl}`);
    serve();
  });
}

// Close the Mongoose connection, when receiving SIGINT
process.on("SIGINT", async () => {
  console.log("\n");
  logger.info("Gracefully shutting down");
  logger.info("Closing the MongoDB connection");
  try {
    await safeMongooseConnection.close(true);
    logger.info("Mongo connection closed successfully");
  } catch (err) {
    logger.log({
      level: "error",
      message: "Error shutting closing mongo connection",
      error: err,
    });
  }
  process.exit(0);
});
