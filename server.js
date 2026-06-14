const rateLimit = require("express-rate-limit")
const helmet = require("helmet")
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
  })
);
app.use(helmet());
app.use(express.json());
app.use(limiter());

// Limiter

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later",
})

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);


app.get("/", (req, res) => {
  res.send("Job Application Tracker API is running...");
});
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});