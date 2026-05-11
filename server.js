import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/auth.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import cors from "cors";
import uploadRoutes from "./src/routes/uploadRoutes.routes.js";
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);
app.get("/", (req, res) => {
  res.send("API Running");
});

(async () => {
  try {
    await connectDB();
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("DB connection failed:", error.message);
  }

  app.listen(5000, () => {
    console.log("Server running on port 5000");
  });
})();
