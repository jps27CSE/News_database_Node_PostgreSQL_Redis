import express from "express";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 5000;
import fileUpload from "express-fileupload";
import helmet from "helmet";
import cors from "cors";
import { limiter } from "./config/ratelimiter.js";

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(fileUpload());
app.use(helmet());
app.use(cors());
app.use(limiter);

app.get("/", (req, res) => {
  return res.json("Hello World");
});

// import routes
import ApiRoutes from "./routes/api.js";
app.use("/api", ApiRoutes);

// Jobs import
import "./jobs/index.js";

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
