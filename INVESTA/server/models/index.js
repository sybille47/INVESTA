// For local development
const localConfig = {
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
};

// For production (Vercel)
const productionConfig = {
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
};

const pool = new Pool(
  process.env.NODE_ENV === 'production' ? productionConfig : localConfig
);