import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import clubRoutes from "./routes/clubRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import coreMemberRoutes from "./routes/coreMemberRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api", clubRoutes);
app.use("/api", eventRoutes);
app.use("/api", coreMemberRoutes);
app.use("/api", authRoutes);

const PORT = 3001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
