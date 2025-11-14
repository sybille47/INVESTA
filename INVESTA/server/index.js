"use strict";

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const router = require("./router.js");

const app = express();
const port = process.env.PORT || 3000;

// FRONTEND_ORIGINS: comma separated list, e.g. "http://localhost:5173,https://investa.vercel.app"
const FRONTEND_ORIGINS = (process.env.FRONTEND_ORIGINS || "http://localhost:5173")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

function corsOriginChecker(origin, callback) {
  // allow non-browser tools (no origin) like Postman, server-to-server calls
  if (!origin) return callback(null, true);

  // allow same origin or listed frontend origins
  // allow localhost dev ports automatically
  if (/^http:\/\/localhost:\d+$/.test(origin)) return callback(null, true);

  const matched = FRONTEND_ORIGINS.some(allowed => {
    // allow exact match or if allowed doesn't have protocol, compare host
    return origin === allowed || origin.startsWith(allowed);
  });

  if (matched) return callback(null, true);

  return callback(new Error("Not allowed by CORS"));
}

app.use(
  cors({
    origin: corsOriginChecker,
    credentials: true,
  })
);

app.use(express.json());
app.use("/", router);

// Export app for tests
module.exports = app;

// Start server (always start in Railway / production)
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    console.log(`NODE_ENV=${process.env.NODE_ENV || "development"}`);
    console.log(`Allowed FRONTEND_ORIGINS: ${FRONTEND_ORIGINS.join(", ")}`);
  });
}







// "use strict";

// require("dotenv").config();
// const express = require("express");
// const path = require("path");
// const cors = require("cors");
// const router = require("./router.js");

// const app = express();
// const port = process.env.PORT || 3000;

// // app.use(cors());
// // Allow frontend dev server origins dynamically in development.
// const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin) return callback(null, true);

//       // Vercel
//       if (process.env.NODE_ENV === "production") {
//       const allowedOrigins = [
//         process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
//         FRONTEND_ORIGIN
//       ].filter(Boolean);

//       if (allowedOrigins.some(allowed => origin.startsWith(allowed))) {
//         return callback(null, true);
//       }
//     }
//       if (process.env.NODE_ENV !== "production") {
//         // allow any localhost port during development
//         if (/^http:\/\/localhost:\d+$/.test(origin))
//           return callback(null, true);
//       }
//       if (origin === FRONTEND_ORIGIN) return callback(null, true);
//       callback(new Error("Not allowed by CORS"));
//     },
//     credentials: true,
//   })
// );
// app.use(express.json());

// // app.use(express.static(path.join(__dirname, "../client")));

// app.use("/", router);

// // app.listen(port, () => {
// //   console.log(`Server listening on port ${port}`);
// // });

// // Vercel
// // if (process.env.NODE_ENV !== "production") {
// //   app.listen(port, () => {
// //     console.log(`Server listening on port ${port}`);
// //   });
// // }

// // module.exports = app;

// // Local dev: run normally
// if (process.env.NODE_ENV !== "production") {
//   app.listen(port, () => {
//     console.log(`Server listening on port ${port}`);
//   });
// }

// // Export the Express app as a handler for Vercel
// module.exports = app;
