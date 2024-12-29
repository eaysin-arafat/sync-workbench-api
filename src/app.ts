import ApplicationError from "@/errors/application-error";
import { errorHandler } from "@/middleware/error-handler";
import routes from "@/routes";
import bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";
import express from "express";
import path from "path";
import { logResponseTime } from "./middleware/log-response-time";

const app = express();

app.use(cors());
app.use(compression() as any);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/api/v1", routes);

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

app.get("/health", (_req, res) => {
  res
    .status(200)
    .json({ status: `${process.env.APPLICATION_NAME} service is up` });
});

// 404 Error Middleware
app.use((_req, _res, next) => {
  const error = new ApplicationError({
    statusCode: 404,
    message: "The requested resource was not found.",
    code: "NOT_FOUND",
    suggestion: "Check the URL or contact support if the issue persists.",
  });
  next(error);
});

app.use(logResponseTime);

// Error Handler
app.use(errorHandler);

export default app;
