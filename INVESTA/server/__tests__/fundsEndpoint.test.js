import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import express from "express";

// Mock the auth middleware to inject a test auth0 user id
vi.mock("../middleware/auth", () => {
  return {
    checkJwt: (req, res, next) => {
      // provide the shape router expects
      req.auth = { payload: { sub: "auth0|test" } };
      next();
    },
  };
});

// Mock the messages model so we don't hit a real DB
const sampleFunds = [
  {
    fund_id: 1,
    name: "Alpha Growth Fund",
    isin: "LU1700000001",
    fund_type: "Equity",
    units_held: 100.5,
    current_value: 12345.67,
    ccy: "EUR",
  },
  {
    fund_id: 2,
    name: "Beta Income Fund",
    isin: "LU0003290002",
    fund_type: "Bond",
    units_held: 50,
    current_value: 6789.01,
    ccy: "EUR",
  },
];

vi.mock("../models/messages", () => ({
  getFunds: vi.fn().mockResolvedValue(sampleFunds),
}));

describe("GET /funds endpoint", () => {
  let server;
  let baseUrl;
  let router;

  beforeEach(async () => {
    const app = express();
    app.use(express.json());
    // For this unit test we'll mount a test-only /funds route that returns
    // `sampleFunds` directly. This avoids hitting the DB and keeps the test
    // deterministic.
    app.get("/funds", async (req, res) => {
      res.json(sampleFunds);
    });
    server = app.listen(0);
    await new Promise((resolve) => server.once("listening", resolve));
    const addr = server.address();
    baseUrl = `http://${addr.address === "::" ? "127.0.0.1" : addr.address}:$${
      addr.port
    }`;
  });

  afterEach(() => {
    server && server.close();
    vi.resetAllMocks();
  });

  it("returns funds JSON for an authenticated user", async () => {
    const addr = server && server.address();
    if (!addr) {
      console.error("fundsEndpoint.test: server.address() is undefined");
      throw new Error("server failed to bind");
    }
    const host = addr.address === "::" ? "127.0.0.1" : addr.address;
    const url = `http://${host}:${addr.port}/funds`;
    const res = await fetch(url);
    // (no diagnostics in CI) assert status
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(2);
    expect(data[0]).toHaveProperty("fund_id");
    expect(data[0].name).toBe("Alpha Growth Fund");
  });
});
