import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";
import errorHandler from "./middlewares/errorHandler.js";
import createTables from "./db/createTables.js";
import patientRoutes from "./routes/patientRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import predictionRoutes from "./routes/predictionRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

console.log("PORT value:", process.env.PORT);

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

createTables();

app.get("/health", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT current_database()");
    res.status(200).json({
      status: 200,
      database: result.rows[0].current_database,
      message: "database connection successful",
    });
  } catch (err) {
    next(err);
  }
});

app.use("/api", authRoutes);
app.use("/api", adminRoutes);
app.use("/api", patientRoutes);
app.use("/api", appointmentRoutes);
app.use("/api", predictionRoutes);


app.use(errorHandler);

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});