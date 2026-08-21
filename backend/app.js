const express = require("express");
const connectDB =require("./config/db");
const dotenv = require("dotenv").config();
const app= express();
const cors = require("cors");
const PORT = process.env.PORT || 3000;

connectDB();
const allowedOrigins = [
  "http://localhost:5173",
  "https://dihadi-phi.vercel.app",
  "https://dihadi-rhsb2u4s9-vikas-s-project.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
app.use(express.json());

app.use("/users",require("./routes/user"));
app.use("/works",require("./routes/work"));
app.use("/jobs",require("./routes/job"));

app.get('/', (req, res) => {
  res.send('Hello World')
})


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
})
