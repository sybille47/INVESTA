"use strict";

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const router = require("./router.js");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://investaapp.vercel.app"
  ],
  credentials: true
}));

app.use(express.json());
app.use("/", router);

module.exports = app;

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}
