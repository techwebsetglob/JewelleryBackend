import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/errorHandler.js";

// Load env vars
dotenv.config();

// Connect to database (Initialize Firebase Admin)
import "./firebase/admin.js";

import products from "./routes/products.js";
import consultations from "./routes/consultations.js";
import orders from "./routes/orders.js";
import newsletter from "./routes/newsletter.js";
import authRouter from "./routes/auth.js";
import chatRouter from "./routes/chat.js";

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://aurum.vercel.app",
      /\.vercel\.app$/,
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Mount routers
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, status: "ok", timestamp: Date.now() });
});

app.use("/api/products", products);
app.use("/api/consultations", consultations);
app.use("/api/orders", orders);
app.use("/api/newsletter", newsletter);
app.use("/api/auth", authRouter);
app.use("/api/chat", chatRouter);

// Error Handler Middleware (Must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () =>
    console.log(
      `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`,
    ),
  );
}

export default app;

// Trigger deployment
