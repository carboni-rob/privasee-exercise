import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import recordRoutes from "./routes/recordRoutes";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api/records", recordRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Privasee API is running" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
