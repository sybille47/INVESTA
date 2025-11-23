// const express = require("express");
// const app = express();
// const port = process.env.PORT || 3000;

// app.get("/", (req, res) => res.send("Hello World"));

// if (require.main === module) {
//   app.listen(port, () => console.log(`Server listening on port ${port}`));
// }

"use strict";

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const router = require("./router.js");

const app = express();
const port = process.env.PORT || 3000;

// const FRONTEND_ORIGINS = (process.env.FRONTEND_ORIGINS || "http://localhost:5173")
//   .split(",")
//   .map(s => s.trim())
//   .filter(Boolean);

// function corsOriginChecker(origin, callback) {
//   if (!origin) return callback(null, true);
//   if (/^http:\/\/localhost:\d+$/.test(origin)) return callback(null, true);

//   const matched = FRONTEND_ORIGINS.some(allowed => origin === allowed || origin.startsWith(allowed));
//   if (matched) return callback(null, true);

//   return callback(new Error("Not allowed by CORS"));
// }

// Preflight requests
// app.options('*', cors({
//   origin: corsOriginChecker,
//   credentials: true
// }));

// Apply CORS middleware to all routes
app.use(cors(
//   {
//   origin: corsOriginChecker,
//   credentials: true
// }
));

app.use(express.json());
app.use("/", router);

// Export app for tests
module.exports = app;

// Start server (always start in Railway / production)
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    console.log(`NODE_ENV=${process.env.NODE_ENV || "development"}`);
    // console.log(`Allowed FRONTEND_ORIGINS: ${FRONTEND_ORIGINS.join(", ")}`);
  });
}

