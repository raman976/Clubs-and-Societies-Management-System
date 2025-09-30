import express from "express";
import cors from "cors";
import clubRoutes from "./routes/clubRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", clubRoutes);

const PORT = 3001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
