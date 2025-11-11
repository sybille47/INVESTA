// Diagnostic script to check which database the server is connecting to
// and whether the `users` table is visible.
const { pool } = require("../models/messages");

function maskUrl(url) {
  if (!url) return "<not set>";
  if (url.length <= 12) return url;
  return url.slice(0, 6) + "..." + url.slice(-6);
}

(async function run() {
  console.log("Masked DATABASE_URL:", maskUrl(process.env.DATABASE_URL));
  try {
    const info = await pool.query(
      `SELECT current_database() AS db, current_user AS user, version() AS version`
    );
    console.log("DB info:", info.rows[0]);

    try {
      const usersCount = await pool.query(
        "SELECT COUNT(*)::int AS count FROM users"
      );
      console.log("users table count:", usersCount.rows[0]);

      const usersSample = await pool.query(
        "SELECT account_id, auth0_user_id, created_at FROM users ORDER BY account_id LIMIT 5"
      );
      console.log("users sample rows:", usersSample.rows);
    } catch (e) {
      console.error(
        "Error querying users table:",
        e && e.message ? e.message : e
      );
    }
  } catch (err) {
    console.error(
      "Error querying database info:",
      err && err.message ? err.message : err
    );
  } finally {
    // Let the process exit; pool may keep sockets open
    setTimeout(() => process.exit(0), 200);
  }
})();
