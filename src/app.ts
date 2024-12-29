import logger from "@/logger";
import { errorHandler } from "@/middleware/error-handler";
import routes from "@/routes";
import bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import path from "path";

const app = express();

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

function logResponseTime(req: Request, res: Response, next: NextFunction) {
  const startHrTime = process.hrtime();

  res.on("finish", () => {
    const elapsedHrTime = process.hrtime(startHrTime);
    const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
    const message = `${req.method} ${res.statusCode} ${elapsedTimeInMs}ms\t${req.path}`;
    logger.log({
      level: "debug",
      message,
      consoleLoggerOptions: { label: "API" },
    });
  });

  next();
}

app.use(logResponseTime);
app.use(cors(corsOptions));
app.use(compression() as any);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "..", "public")));

app.use(routes);

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

app.get("/health", (_req, res) => {
  res
    .status(200)
    .json({ status: `${process.env.APPLICATION_NAME} service is up` });
});

app.use(errorHandler);

export default app;
