const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const app = express();

// Connect DB
connectDB();

// Use cors
app.use(cors());

// Init Middleware
app.use(express.urlencoded({ limit: "50mb", extended: true })); // to access req.body
app.use(express.json({ extended: false })); // to access req.body

// Define routes
app.use("/api/users", require("./routes/api/users"));

app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/design", require("./routes/api/design"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
