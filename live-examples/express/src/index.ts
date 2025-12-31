import "dotenv/config";
import express from "express";
import cors from "cors";
import { mpesa } from "./utils/mpesa.js";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

const mpesaRouter = express.Router();
mpesa.router(mpesaRouter);
app.use("/api/mpesa", mpesaRouter);

app.use((err, res) => {
  console.error("Error:", err);
  res.status(500).json({
    success: false,
    error: err.message || "Internal server error",
  });
});
app.post("/stk-push", async (req, res) => {
  try {
    const { amount, phone } = req.body;

    console.log("Request received:", { amount, phone });

    const response = await mpesa.stkPush({
      amount,
      phoneNumber: phone,
      accountReference: "TEST-001",
      transactionDesc: "Test payment",
    });

    console.log("M-Pesa response:", response);

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    // Log different parts of the error
    console.error("Error occurred:");
    console.error("Status Code:", error.statusCode);
    console.error("Status Message:", error.statusMessage);

    // Try to read the response body
    let errorBody = "";
    error.on("data", (chunk) => {
      errorBody += chunk;
    });

    error.on("end", () => {
      console.error("Error body:", errorBody);

      res.status(500).json({
        success: false,
        error: errorBody || error.message || "M-Pesa request failed",
      });
    });
  }
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
