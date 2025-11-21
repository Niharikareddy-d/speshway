import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import multer from "multer";
import dynamoClient from "./config/dynamodb.js";
import { ListTablesCommand } from "@aws-sdk/client-dynamodb";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://niha-serverless-bucket.s3-website.ap-south-1.amazonaws.com",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", (await import("./routes/auth.js")).default);
app.use("/api/contact", (await import("./routes/contact.js")).default);
app.use("/api/services", (await import("./routes/services.js")).default);
app.use("/api/portfolios", (await import("./routes/portfolios.js")).default);
app.use("/api/team", (await import("./routes/team.js")).default);
app.use("/api/gallery", (await import("./routes/gallery.js")).default);
app.use("/api/clients", (await import("./routes/clients.js")).default);
app.use("/api/sentences", (await import("./routes/Sentences.js")).default);

app.get("/", (req, res) => {
  res.json({ message: "API running", status: "ok" });
});

app.get("/api/health", async (req, res) => {
  try {
    await dynamoClient.send(new ListTablesCommand({}));
    res.json({ status: "ok", dynamodb: "connected" });
  } catch (err) {
    res.status(500).json({
      status: "error",
      error: err.message,
    });
  }
});

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({ message: "File too large" });
  }
  res.status(500).json({ message: error.message });
});

export default app;

