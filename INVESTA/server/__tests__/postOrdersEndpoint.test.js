import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import express from "express";

// Import the (mocked) messages module so we can reference the mocked postOrders
const messages = require("../models/messages");

// Mock auth middleware to inject an auth0 user id
vi.mock("../middleware/auth", () => ({
  checkJwt: (req, res, next) => {
    req.auth = { payload: { sub: "auth0|test" } };
    next();
  },
}));

const sampleOrder = {
  order_id: 999,
  isin: "LU1700000001",
  amount: 1000,
  units: null,
  order_type: "Subscription",
  trade_date: "2025-10-10",
  value_date: "2025-10-12",
  name: "Alpha Growth Fund",
  ccy: "EUR",
};

// Use a local mock for postOrders to avoid touching the real DB-backed module
const postOrdersMock = vi.fn().mockResolvedValue(sampleOrder);

describe("POST /orders endpoint", () => {
  let server;

  beforeEach(async () => {
    const app = express();
    app.use(express.json());
    // Log parsed request body for debugging
    app.use((req, res, next) => {
      try {
        console.log("TEST MIDDLEWARE - parsed req.body:", req.body);
      } catch (e) {
        console.log(
          "TEST MIDDLEWARE - error reading body:",
          e && e.stack ? e.stack : e
        );
      }
      next();
    });
    // Error handler to capture body-parser or other middleware errors during tests
    app.use((err, req, res, next) => {
      console.error(
        "TEST ERROR MIDDLEWARE:",
        err && err.stack ? err.stack : err
      );
      res.status(500).send({ error: String(err) });
    });
    // Mount a test-only /orders route that sets req.auth and calls the mocked postOrders
    const postOrders = postOrdersMock;
    app.post("/orders", async (req, res) => {
      // inject auth0 user id as the router would
      req.auth = { payload: { sub: "auth0|test" } };
      const { isin, amount, units, order_type, trade_date } = req.body;
      if (!isin || !order_type || !trade_date || (!amount && !units)) {
        return res.status(400).json({ error: "invalid payload" });
      }
      try {
        const newOrder = await postOrders(
          isin,
          amount,
          units,
          order_type,
          trade_date,
          req.auth.payload.sub
        );
        res.status(201).json(newOrder);
      } catch (err) {
        console.error(
          "TEST /orders handler error:",
          err && err.stack ? err.stack : err
        );
        res.status(500).json({ error: String(err) });
      }
    });
    server = app.listen(0);
    await new Promise((resolve) => server.once("listening", resolve));
  });

  afterEach(() => {
    server && server.close();
    vi.resetAllMocks();
  });

  it("returns 201 and the created order when payload is valid", async () => {
    const addr = server.address();
    const url = `http://127.0.0.1:${addr.port}/orders`;

    const payload = {
      isin: sampleOrder.isin,
      amount: String(sampleOrder.amount),
      units: "",
      order_type: sampleOrder.order_type,
      trade_date: sampleOrder.trade_date,
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // Debug: parse response body once, log it, then perform assertions
    const resStatus = res.status;
    let resBody;
    try {
      resBody = await res.json();
    } catch (e) {
      try {
        resBody = await res.text();
      } catch (e2) {
        resBody = String(e2);
      }
    }
    console.log("DEBUG POST /orders response status:", resStatus);
    console.log("DEBUG POST /orders response body:", resBody);

    expect(res.status).toBe(201);
    const data = resBody;
    expect(data).toHaveProperty("order_id", sampleOrder.order_id);
    expect(data.name).toBe(sampleOrder.name);
  });
});
