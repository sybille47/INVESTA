"use strict";

require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const router = require("./router.js");

const app = express();
const port = 3000;

// app.use(cors());
// Allow frontend dev server origins dynamically in development.
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., curl, server-to-server) or matching the configured frontend origin
      if (!origin) return callback(null, true);
      if (process.env.NODE_ENV !== "production") {
        // allow any localhost port during development
        if (/^http:\/\/localhost:\d+$/.test(origin))
          return callback(null, true);
      }
      if (origin === FRONTEND_ORIGIN) return callback(null, true);
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json());

app.use(express.static(path.join(__dirname, "../client")));

app.use("/", router);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
