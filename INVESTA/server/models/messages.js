const pool = require("./db");

async function getAccountId(auth0UserId, email = null) {
  try {
    console.log("getAccountId - Looking up for:", { auth0UserId, email });

    let res = await pool.query(
      "SELECT account_id FROM users WHERE auth0_user_id = $1",
      [auth0UserId]
    );

    if (res.rows.length === 0) {
      console.log("getAccountId - User not found, creating new user...");

      // Create new user
      res = await pool.query(
        "INSERT INTO users (auth0_user_id) VALUES ($1) RETURNING account_id",
        [auth0UserId]
      );

      const accountId = res.rows[0].account_id;
      console.log("New user created with account_id:", accountId);


      await pool.query(
        `INSERT INTO profiles (account_id, email_address)
          VALUES ($1, $2)
          ON CONFLICT (account_id) DO NOTHING`,
        [accountId, email]
      );

      console.log("Profile created for account_id:", accountId);
      return accountId;
    }

    const accountId = res.rows[0].account_id;

    await pool.query(
      `INSERT INTO profiles (account_id, email_address)
        VALUES ($1, $2)
        ON CONFLICT (account_id) DO NOTHING`,
      [accountId, email]
    );

    console.log("getAccountId - Existing user found, account_id:", accountId);
    return accountId;

  } catch (err) {
    console.error("Error in getAccountId:", err);
    console.error("Error stack:", err.stack);
    throw err;
  }
}

async function getFunds(auth0UserId, email = null) {
  try {
    const accountId = await getAccountId(auth0UserId, email);
    const query = `
      SELECT
  f.fund_id,
  f.name,
  f.isin,
  f.fund_type,
  COALESCE(SUM(o.units) FILTER (WHERE o.account_id = $1), 0) AS units_held,

  COALESCE(
    SUM(
      CASE
        WHEN COALESCE(o.units, 0) = 0 THEN COALESCE(o.amount, 0)
        ELSE COALESCE(o.units, 0) * COALESCE(nav.latest_nav, 0)
      END
    ) FILTER (WHERE o.account_id = $1),
    0
  ) AS current_value,

  f.ccy

FROM funds f
LEFT JOIN orders o
  ON f.isin = o.isin
LEFT JOIN LATERAL (
  SELECT n.nav AS latest_nav
  FROM nav n
  WHERE n.isin = f.isin
    AND n.trade_date <= CURRENT_DATE
  ORDER BY n.trade_date DESC
  LIMIT 1
) nav ON TRUE
GROUP BY
  f.fund_id, f.name, f.isin, f.fund_type, nav.latest_nav
HAVING (COUNT(o.*) FILTER (WHERE o.account_id = $1)) > 0;
`;


    const res = await pool.query(query, [accountId]);
    return res.rows;
  } catch (err) {
    console.error("Error fetching funds:", err);
    throw err;
  }
}

async function getFundsTotal(auth0UserId, email = null) {
  try {
    console.log("🔍 getFundsTotal called for user:", auth0UserId);
    const accountId = await getAccountId(auth0UserId, email);
    console.log("📊 Account ID:", accountId);
    const query = `
      SELECT
        COALESCE(SUM(o.units * nav.latest_nav), 0) AS total_value
      FROM orders o
      LEFT JOIN LATERAL (
        SELECT n.nav AS latest_nav
        FROM nav n
        WHERE n.isin = o.isin
          AND n.trade_date <= CURRENT_DATE
        ORDER BY n.trade_date DESC
        LIMIT 1
      ) nav ON TRUE
      WHERE o.account_id = $1
    `;

    const res = await pool.query(query, [accountId]);
    return res.rows[0];
  } catch (err) {
    console.error("Error fetching funds total:", err);
    throw err;
  }
}

async function getFundByIsin(isin, auth0UserId) {
  try {
    const accountId = await getAccountId(auth0UserId);

    const query = `
      SELECT
        f.fund_id,
        f.name,
        f.isin,
        f.fund_type,
        f.ccy,
        f.value_calc,
        COALESCE(SUM(o.units), 0) as units_held
      FROM funds f
      LEFT JOIN orders o ON o.isin = f.isin AND o.account_id = $2
      WHERE f.isin = $1
      GROUP BY f.fund_id, f.name, f.isin, f.fund_type, f.ccy, f.value_calc
      LIMIT 1
    `;

    const res = await pool.query(query, [isin, accountId]);
    return res.rows[0];
  } catch (err) {
    console.error("Error fetching fund by ISIN:", err);
    throw err;
  }
}

async function getOrders(auth0UserId, isin = null) {
  try {
    const accountId = await getAccountId(auth0UserId);
    let query;
    let params;

if (isin) {
  query = `
      SELECT
        o.order_id,
        o.isin,
        o.amount,
        o.order_type,
        o.trade_date,
        o.value_date,
        o.units,
        COALESCE(nav.td_nav, 0) AS nav_at_td,
        CASE
          WHEN COALESCE(o.units, 0) = 0 THEN
            COALESCE(o.amount / NULLIF(nav.td_nav, 0), 0)
          ELSE
            COALESCE(o.units, 0)
        END AS estimated_units,
        CASE
          WHEN COALESCE(o.units, 0) = 0 THEN
            COALESCE(o.amount, 0)
          ELSE
            COALESCE(o.units, 0) * COALESCE(nav.td_nav, 0)
        END AS td_value,
        o.status,
        f.name,
        f.ccy
      FROM orders o
      INNER JOIN funds f ON f.isin = o.isin
      LEFT JOIN LATERAL (
        SELECT n.nav AS td_nav
        FROM nav n
        WHERE n.isin = o.isin
          AND n.trade_date <= o.trade_date
        ORDER BY n.trade_date DESC
        LIMIT 1
      ) nav ON true
      WHERE o.account_id = $1
        AND o.isin = $2
      ORDER BY o.trade_date DESC;
    `;
  params = [accountId, isin];

    } else {
      query = `
          SELECT
            o.order_id,
            o.isin,
            o.amount,
            o.order_type,
            o.trade_date,
            o.value_date,
            o.units,
            COALESCE(nav.td_nav, 0) AS nav_at_td,
            CASE
              WHEN COALESCE(o.units, 0) = 0 THEN
                COALESCE(o.amount / NULLIF(nav.td_nav, 0), 0)
              ELSE
                COALESCE(o.units, 0)
            END AS estimated_units,
            CASE
              WHEN COALESCE(o.units, 0) = 0 THEN
                COALESCE(o.amount, 0)
              ELSE
                COALESCE(o.units, 0) * COALESCE(nav.td_nav, 0)
            END AS td_value,
            o.status,
            f.name,
            f.ccy
          FROM orders o
          INNER JOIN funds f ON f.isin = o.isin
          LEFT JOIN LATERAL (
            SELECT n.nav AS td_nav
            FROM nav n
            WHERE n.isin = o.isin
              AND n.trade_date <= o.trade_date
            ORDER BY n.trade_date DESC
            LIMIT 1
          ) nav ON true
          WHERE o.account_id = $1
          ORDER BY o.trade_date DESC;
        `;
      params = [accountId];
    }

    const res = await pool.query(query, params);
    console.log("🔍 getOrders() rows:", JSON.stringify(res.rows, null, 2));
    return res.rows;
  } catch (err) {
    console.error("Error fetching orders:", err);
    console.error("getOrders() failed:", err);
    throw err;
  }
}


async function postOrders(
  isin,
  amount,
  units,
  order_type,
  trade_date,
  auth0UserId
) {
  try {
    const accountId = await getAccountId(auth0UserId);

    let numericAmount = amount ? parseFloat(amount) : null;
    let numericUnits = units ? parseFloat(units) : null;

    const type = order_type?.toLowerCase();

    const holdingsRes = await pool.query(
      `SELECT COALESCE(SUM(o.units), 0) AS units_held
          FROM orders o
        WHERE o.account_id = $1 AND o.isin = $2`,
      [accountId, isin]
    );
    const unitsHeld = parseFloat(holdingsRes.rows[0]?.units_held || 0);

    if (type === "redemption") {
      if (!numericUnits) {
        throw new Error(
          "Redemption orders must specify units (amount field is disabled)."
        );
      }
      if (numericUnits > unitsHeld) {
        throw new Error(
          "Redemption units exceed available holdings. Please adjust your order."
        );
      }
    }
    if (type === "redemption") {
      if (numericAmount !== null) numericAmount = -Math.abs(numericAmount);
      if (numericUnits !== null) numericUnits = -Math.abs(numericUnits);
    } else if (type === "subscription") {
      if (numericAmount !== null) numericAmount = Math.abs(numericAmount);
      if (numericUnits !== null) numericUnits = Math.abs(numericUnits);
    }

    console.log("Posting order with values:", {
      isin,
      numericAmount,
      numericUnits,
      order_type,
      trade_date,
    });

    const res = await pool.query(
      `INSERT INTO orders (account_id, isin, amount, units, order_type, trade_date, value_date)
        VALUES (
          $1,
          $2::varchar,
          $3::numeric,
          $4::numeric,
          $5,
          $6,
          $6::date + COALESCE(
            (SELECT value_calc FROM funds WHERE isin = $2::varchar),
            0
          ) * INTERVAL '1 day'
        )
       RETURNING *`,
      [accountId, isin, numericAmount, numericUnits, order_type, trade_date]
    );

    const newOrder = res.rows[0];

const fundRes = await pool.query(
  `SELECT
    f.name,
    f.ccy,
    COALESCE(SUM(o.units), 0) as units_held
  FROM funds f
  LEFT JOIN orders o ON o.isin = f.isin AND o.account_id = $2
  WHERE f.isin = $1::varchar
  GROUP BY f.name, f.ccy
  LIMIT 1`,
  [isin, accountId]
);

if (fundRes.rows[0]) {
  newOrder.name = fundRes.rows[0].name;
  newOrder.ccy = fundRes.rows[0].ccy;
  newOrder.units_held = fundRes.rows[0].units_held;
}

    return newOrder;
  } catch (err) {
    console.error("Error posting order:", err);
    throw err;
  }
}

async function getProfileData(auth0UserId, email = null) {
  try {
    const accountId = await getAccountId(auth0UserId, email);

    const res = await pool.query(
      `SELECT p.*, u.auth0_user_id, u.created_at as user_created_at
        FROM profiles p
        JOIN users u ON u.account_id = p.account_id
        WHERE u.account_id = $1`,
      [accountId]
    );

    return res.rows;
  } catch (err) {
    console.error("❌ Error fetching profile data:", err);
    throw err;
  }
}

async function putProfile(auth0UserId, email, data) {
  try {
    console.log("putProfile called with:", { auth0UserId, email, data });

    const accountId = await getAccountId(auth0UserId, email);
    console.log("putProfile - account_id resolved:", accountId);

    const res = await pool.query(
      `UPDATE profiles
        SET first_name = $2,
          last_name = $3,
          street = $4,
          house_no = $5,
          zip_code = $6,
          town = $7,
          country = $8,
          holder = $9,
          iban = $10,
          bank_name = $11,
          bic = $12
        WHERE account_id = $1
       RETURNING *`,
      [
        accountId,
        data.first_name || null,
        data.last_name || null,
        data.street || null,
        data.house_no || null,
        data.zip_code || null,
        data.town || null,
        data.country || null,
        data.holder || null,
        data.iban || null,
        data.bank_name || null,
        data.bic || null
      ]
    );

    if (res.rows.length === 0) {
      throw new Error(`No profile found for account_id: ${accountId}`);
    }

    console.log('Profile updated successfully:', res.rows[0]);
    return res.rows[0];

  } catch (err) {
    console.error('Error in putProfile:', err);
    console.error('Error stack:', err.stack);
    throw err;
  }
}

// Get NAV history for a specific fund
async function getNavHistory(isin, auth0UserId) {
  try {
    const accountId = await getAccountId(auth0UserId);

    const accessCheck = await pool.query(
      `SELECT COUNT(*) as count FROM orders
        WHERE isin = $1 AND account_id = $2`,
      [isin, accountId]
    );

    if (accessCheck.rows[0].count === 0) {
      throw new Error("No access to this fund");
    }

    const query = `
      SELECT
        n.trade_date,
        n.nav,
        f.name,
        f.isin,
        f.ccy
      FROM nav n
      INNER JOIN funds f ON f.isin = n.isin
      WHERE n.isin = $1
      ORDER BY n.trade_date ASC
    `;

    const res = await pool.query(query, [isin]);
    return res.rows;
  } catch (err) {
    console.error("Error fetching NAV history:", err);
    throw err;
  }
}

// Get NAV history for all user's funds
async function getAllNavHistory(auth0UserId) {
  try {
    const accountId = await getAccountId(auth0UserId);

    const query = `
      SELECT
        n.trade_date,
        n.nav,
        f.name,
        f.isin,
        f.ccy
      FROM nav n
      INNER JOIN funds f ON f.isin = n.isin
      WHERE f.isin IN (
        SELECT DISTINCT isin
        FROM orders
        WHERE account_id = $1
      )
      ORDER BY f.name, n.trade_date ASC
    `;

    const res = await pool.query(query, [accountId]);
    return res.rows;
  } catch (err) {
    console.error("Error fetching all NAV history:", err);
    throw err;
  }
}

// Get investment value over time
async function getInvestmentValueHistory(auth0UserId) {
  try {
    const accountId = await getAccountId(auth0UserId);

    const query = `
      SELECT
        o.trade_date,
        o.isin,
        f.name,
        COALESCE(o.units, 0) * COALESCE(nav.td_nav, 0) AS td_value,
        o.units,
        nav.td_nav,
        f.ccy
      FROM orders o
      INNER JOIN funds f ON f.isin = o.isin
      LEFT JOIN LATERAL (
        SELECT n.nav AS td_nav
        FROM nav n
        WHERE n.isin = o.isin
          AND n.trade_date <= o.trade_date
        ORDER BY n.trade_date DESC
        LIMIT 1
      ) nav ON true
      WHERE o.account_id = $1
      ORDER BY o.trade_date ASC
    `;

    const res = await pool.query(query, [accountId]);
    return res.rows;
  } catch (err) {
    console.error("Error fetching investment value history:", err);
    throw err;
  }
}

// Get monthly investment counts
async function getMonthlyInvestmentCounts(auth0UserId) {
  try {
    const accountId = await getAccountId(auth0UserId);

    const query = `
      SELECT
        DATE_TRUNC('month', trade_date) AS month,
        COUNT(*) AS count,
        SUM(CASE WHEN order_type = 'subscription' THEN 1 ELSE 0 END) AS subscriptions,
        SUM(CASE WHEN order_type = 'redemption' THEN 1 ELSE 0 END) AS redemptions
      FROM orders
      WHERE account_id = $1
      GROUP BY DATE_TRUNC('month', trade_date)
      ORDER BY month ASC
    `;

    const res = await pool.query(query, [accountId]);
    return res.rows;
  } catch (err) {
    console.error("Error fetching monthly investment counts:", err);
    throw err;
  }
}

// Get fund allocation (for pie chart)
async function getFundAllocation(auth0UserId) {
  try {
    const accountId = await getAccountId(auth0UserId);

    const query = `
      SELECT
        f.name,
        f.isin,
        f.ccy,
        COALESCE(SUM(o.units), 0) AS units_held,
        COALESCE(SUM(o.units), 0) * COALESCE(nav.latest_nav, 0) AS current_value
      FROM funds f
      INNER JOIN orders o ON f.isin = o.isin AND o.account_id = $1
      LEFT JOIN LATERAL (
        SELECT n.nav AS latest_nav
        FROM nav n
        WHERE n.isin = f.isin
          AND n.trade_date <= CURRENT_DATE
        ORDER BY n.trade_date DESC
        LIMIT 1
      ) nav ON TRUE
      GROUP BY f.name, f.isin, f.ccy, nav.latest_nav
      HAVING COALESCE(SUM(o.units), 0) > 0
      ORDER BY current_value DESC
    `;

    const res = await pool.query(query, [accountId]);
    return res.rows;
  } catch (err) {
    console.error("Error fetching fund allocation:", err);
    throw err;
  }
}

module.exports = {
  pool,
  getAccountId,
  getFunds,
  getFundByIsin,
  getFundsTotal,
  getOrders,
  postOrders,
  getProfileData,
  putProfile,
  getNavHistory,
  getAllNavHistory,
  getInvestmentValueHistory,
  getMonthlyInvestmentCounts,
  getFundAllocation,
};
