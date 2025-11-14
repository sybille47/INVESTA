"use strict";

require("dotenv").config();
const { Pool } = require("pg");

// Build configuration based on environment
const isProduction = process.env.NODE_ENV === "production";

const localConfig = {
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT || 5432,
};

const productionConfig = {
  connectionString: process.env.DATABASE_URL, // ⬅ Railway provides this
  ssl: { rejectUnauthorized: false },         // ⬅ important for Railway
};

const pool = new Pool(isProduction ? productionConfig : localConfig);

// Optional (recommended) logging for debugging deploys
console.log("DB connection config:", isProduction ? "Production" : "Local");

module.exports = pool;
