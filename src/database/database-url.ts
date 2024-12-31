import { env } from "@/env";

const { DB_USERNAME = "", DB_PASSWORD = "", DB_NAME = "" } = env;

const DB_CONNECTION_URL = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@cluster0.lwys0.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

export { DB_CONNECTION_URL };
