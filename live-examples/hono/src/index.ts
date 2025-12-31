import { Hono } from "hono";
import { serve } from "@hono/node-server";

import { cors } from "hono/cors";
import { mpesa } from "./utils/mpesa.js";

const app = new Hono();
app.use("/api/*", cors());
app.use(
  "/api2/*",
  cors({
    origin: "http://localhost:3000",
    allowHeaders: ["X-Custom-Header", "Upgrade-Insecure-Requests"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
    maxAge: 600,
    credentials: true,
  }),
);

app.route("/api/mpesa", mpesa.app);

serve({
  fetch: app.fetch,
  port: 3000,
});

console.log("Server running on port 3000");
