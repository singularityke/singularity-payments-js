import Fastify from "fastify";
import cors from "@fastify/cors";
import { mpesa } from "./utils/mpesa.js";
const app = Fastify({ logger: true });

// Route

app.register(cors, {
  origin: "http://localhost:5173",
  credentials: true,
});
app.register(
  async (instance) => {
    mpesa.router(instance);
  },
  { prefix: "/api/mpesa" },
);
const start = async () => {
  try {
    await app.listen({ port: 3001, host: "0.0.0.0" });
    console.log("Server running on http://localhost:3000");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
