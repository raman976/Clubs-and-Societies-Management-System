import express from "express";
import cors from "cors";
import clubRoutes from "./routes/clubRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import coreMemberRoutes from "./routes/coreMemberRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", clubRoutes);
app.use("/api", eventRoutes);
app.use("/api", coreMemberRoutes);

const PORT = 3001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
