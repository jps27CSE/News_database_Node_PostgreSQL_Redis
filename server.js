import express from "express";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 5000;
import fileUpload from "express-fileupload";

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload());

app.get("/", (req, res) => {
  return res.json("Hello World");
});

// import routes
import ApiRoutes from "./routes/api.js";
app.use("/api", ApiRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
