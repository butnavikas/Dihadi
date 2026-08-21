const express = require("express");
const connectDB =require("./config/db");
const dotenv = require("dotenv").config();
const app= express();
const cors = require("cors");
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
connectDB();
app.use(express.json());
app.use(cors({
  origin: FRONTEND_URL,
  credentials:true
}));


app.use("/users",require("./routes/user"));
app.use("/works",require("./routes/work"));
app.use("/jobs",require("./routes/job"));

app.get('/', (req, res) => {
  res.send('Hello World')
})


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
})
