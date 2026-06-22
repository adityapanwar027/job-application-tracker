const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();
app.set("trust proxy", 1);

// Connect MongoDB
connectDB();

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later",
});

// Middleware
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));
app.use(limiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

// Root Route
app.get("/", (req, res) => {
  res.send("Job Application Tracker API is running...");
});

// Health Check
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
    uptime: process.uptime(),
  });
});

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});