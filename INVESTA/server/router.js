"use strict";

const express = require("express");
const router = express.Router();
const { checkJwt } = require("./middleware/auth");
const {
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
} = require("./models/messages");
  

// root health check
router.get("/", (req, res) => {
  res.send("Backend is running");
});

router.get("/api/funds", checkJwt, async (req, res) => {
  try {
    const auth0UserId = req.auth.payload.sub;
    const email =
      req.auth.payload["https://investa-api/email"] ||
      req.auth.payload.email ||
      req.auth.payload.name ||
      null;
    const funds = await getFunds(auth0UserId, email);
    res.json(funds);
  } catch (err) {
    console.error("Error fetching funds:", err);
    res.status(500).json({ error: "Failed to fetch funds router.js" });
  }
});


router.get("/api/funds/:isin", checkJwt, async (req, res) => {
  try {
    const auth0UserId = req.auth.payload.sub;
    const fund = await getFundByIsin(req.params.isin, auth0UserId);
    if (!fund) return res.status(404).json({ error: "Fund not found" });
    res.json(fund);
  } catch (err) {
    console.error("Error fetching fund:", err);
    res.status(500).json({ error: "Failed to fetch fund" });
  }
});

router.get("/api/funds-total", checkJwt, async (req, res) => {
  try {
    const auth0UserId = req.auth.payload.sub;
    const email =
      req.auth.payload["https://investa-api/email"] ||
      req.auth.payload.email ||
      req.auth.payload.name ||
      null;
    const total = await getFundsTotal(auth0UserId, email);
    if (!total) return res.status(404).json({ error: "Total not found" });
    res.json(total);
  } catch (err) {
    console.error("Error fetching total:", err);
    res.status(500).json({ error: "Failed to fetch total" });
  }
});


router.get("/api/orders", checkJwt, async (req, res) => {
  try {
    const auth0UserId = req.auth.payload.sub;
    const { isin } = req.query;
    const orders = await getOrders(auth0UserId, isin);
    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

router.post("/api/orders", checkJwt, async (req, res) => {
  try {
    const auth0UserId = req.auth.payload.sub;
    const { isin, amount, units, order_type, trade_date } = req.body;
    console.log("req body: ", req.body);

    if (!isin || !order_type || !trade_date || (!amount && !units)) {
      return res.status(400).json({
        error:
          "isin, order_type, trade_date and at least one of amount or units are required",
      });
    }

    const newOrder = await postOrders(
      isin,
      amount,
      units,
      order_type,
      trade_date,
      auth0UserId
    );
    res.status(201).json(newOrder);
  } catch (err) {
    console.error("Error posting order:", err);
    res.status(500).json({ error: "Failed to post orders router.js" });
  }
});

  router.get("/api/profile", checkJwt, async (req, res) => {
    try {
      console.log("Auth0 payload:", req.auth.payload);

      const auth0UserId = req.auth.payload.sub;
      const email =
        req.auth.payload["https://investa-api/email"] ||
        req.auth.payload.email ||
        req.auth.payload.name ||
        null;

    console.log("Auth0 email resolved to:", email);

    const profileData = await getProfileData(auth0UserId, email);
    res.json(profileData);
  } catch (err) {
    console.error("Error fetching profile data:", err);
    res.status(500).json({ error: "Failed to fetch profile data router.js" });
  }
});

router.put("/api/profile", checkJwt, async (req, res) => {
  try {
    const auth0UserId = req.auth.payload.sub;
    const email =
      req.auth.payload["https://investa-api/email"] ||
      req.auth.payload.email ||
      req.auth.payload.name ||
      null;

    console.log("PUT /profile - Auth0 User ID:", auth0UserId);
    console.log("PUT /profile - Email:", email);
    console.log("PUT /profile - Request body:", req.body);

    const updated = await putProfile(auth0UserId, email, req.body);

    console.log("PUT /profile - Updated successfully:", updated);

    res.status(200).json(updated);

  } catch (err) {
    console.error("Error in PUT /profile:", err);
    console.error("Error stack:", err.stack);
    res.status(500).json({
      error: "Failed to update profile",
      details: err.message
    });
  }
});

// CHART ROUTES
// Get NAV history for a specific fund
router.get("/api/nav/:isin", checkJwt, async (req, res) => {
  try {
    const auth0UserId = req.auth.payload.sub;
    const { isin } = req.params;
    const navHistory = await getNavHistory(isin, auth0UserId);
    res.json(navHistory);
  } catch (err) {
    console.error("Error fetching NAV history:", err);
    res.status(500).json({ error: "Failed to fetch NAV history" });
  }
});

// Get NAV history for all user's funds
router.get("/api/nav", checkJwt, async (req, res) => {
  try {
    const auth0UserId = req.auth.payload.sub;
    const navHistory = await getAllNavHistory(auth0UserId);
    console.log(navHistory);
    res.json(navHistory);
  } catch (err) {
    console.error("Error fetching all NAV history:", err);
    res.status(500).json({ error: "Failed to fetch all NAV history router.js" });
  }
});

// Get investment value over time
router.get("/api/charts/investment-value", checkJwt, async (req, res) => {
  try {
    const auth0UserId = req.auth.payload.sub;
    const data = await getInvestmentValueHistory(auth0UserId);
    res.json(data);
  } catch (err) {
    console.error("Error fetching investment value history:", err);
    res.status(500).json({ error: "Failed to fetch investment value history router.js" });
  }
});

// Get monthly investment counts
router.get("/api/charts/monthly-counts", checkJwt, async (req, res) => {
  try {
    const auth0UserId = req.auth.payload.sub;
    const data = await getMonthlyInvestmentCounts(auth0UserId);
    res.json(data);
  } catch (err) {
    console.error("Error fetching monthly investment counts:", err);
    res.status(500).json({ error: "Failed to fetch monthly investment counts" });
  }
});

// Get fund allocation (for pie chart)
router.get("/api/charts/fund-allocation", checkJwt, async (req, res) => {
  try {
    const auth0UserId = req.auth.payload.sub;
    const data = await getFundAllocation(auth0UserId);
    res.json(data);
  } catch (err) {
    console.error("Error fetching fund allocation:", err);
    res.status(500).json({ error: "Failed to fetch fund allocation" });
  }
});

module.exports = router;

// Dev-only debug routes (not protected)
if (process.env.NODE_ENV !== "production") {
  router.get("/debug/funds/:auth0Id", async (req, res) => {
    try {
      const { auth0Id } = req.params;
      const funds = await getFunds(auth0Id);
      res.json({ auth0Id, funds });
    } catch (err) {
      console.error("Debug route error:", err);
      res.status(500).json({ error: "Debug fetch failed", details: err.message });
    }
  });
}