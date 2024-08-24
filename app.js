const express = require("express");
const cors = require("cors");
const app = express();
const { error } = require("./middlewares/error.js");
const helmet = require("helmet");

const dotenv = require("dotenv");

dotenv.config({ path: "./config/config.env" });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(
  cors({
    origin: "https://z-pay-client.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

// import routes
const userRoutes = require("./routes/userRoutes.js");
const blogRoutes = require("./routes/blogRoutes.js");
const commentRoutes = require("./routes/commentRoutes.js");

//import validators
const userValidator = require("./validators/userValidator.js");
const blogValidator = require("./validators/blogValidator.js");
const commentValidator = require("./validators/commentValidator.js");

// use routes
app.use("/api/user", userValidator, userRoutes);
app.use("/api/blog", blogValidator, blogRoutes);
app.use("/api/comment", commentValidator, commentRoutes);

app.get("/", (req, res) =>
  res.send(`<h1>Its working. Click to visit Link.</h1>`)
);

app.all("*", (req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

module.exports = app;
app.use(error);
