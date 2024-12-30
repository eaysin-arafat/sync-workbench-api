import { errorHandler } from "@/middleware/error-handler";
import routes from "@/routes";
import bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import fs from "fs";
import yaml from "js-yaml";
import path from "path";
import swaggerUi from "swagger-ui-express";
import defaultConfig from "./config/default";
import NotFoundError from "./errors/not-found-error";
import { authenticateJWT } from "./middleware/authenticate-jwt";

// Initialize Express application
const app = express();

// Middleware configuration
app.use(cors());
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "..", "public")));

// Public routes configuration
const isPublicRoute = (path: string): boolean => {
  return (
    path === "/" ||
    defaultConfig.publicRoute.some((route) => path.startsWith(route))
  );
};

// Middleware for public route checking and JWT authentication
app.use((req: Request, res: Response, next: NextFunction) => {
  if (isPublicRoute(req.path)) return next();
  authenticateJWT(req, res, next);
});

// Swagger setup for API documentation (Development Only)
const swaggerUiOptions = {
  customCss: ".swagger-ui .topbar { display: none }",
};
const SWAGGER_YAML_FILEPATH = path.join(__dirname, "../openapi.yml");

if (process.env.NODE_ENV === "development") {
  const swaggerYaml = yaml.load(
    fs.readFileSync(SWAGGER_YAML_FILEPATH, "utf8")
  ) as object;
  app.use("/dev/api-docs", swaggerUi.serve);
  app.get("/dev/api-docs", swaggerUi.setup(swaggerYaml, swaggerUiOptions));
}

// API routes
app.use("/api/v1", routes);

// Root route
app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

// Health check endpoint
app.get("/health", (_req, res) => {
  res
    .status(200)
    .json({ status: `${process.env.APPLICATION_NAME} service is up` });
});

// 404 Error handler for unknown routes
app.use((_req, _res, next) => {
  const error = new NotFoundError();
  next(error);
});

// Global error handler middleware
app.use(errorHandler);

export default app;
