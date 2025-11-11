import { describe, it, expect, vi, beforeEach } from "vitest";

// --- Define mockQuery inside vi.mock ---
// Use `var` so the variable is hoisted and available when vi.mock factories are hoisted by Vitest
var mockQuery;

vi.mock("pg", () => {
  mockQuery = vi.fn(); // define inside the factory
  // messages.js does `import pkg from 'pg'; const { Pool } = pkg;`
  // so the mock must provide a default export object that contains Pool
  // expose a global flag so test runs can confirm the mock factory executed
  if (typeof globalThis !== "undefined") {
    globalThis.__PG_MOCK_FACTORY_RAN = true;
    globalThis.MOCK_QUERY = mockQuery; // make mockQuery globally accessible to the test file
  }
  // Provide both shapes: top-level Pool and a default property so either
  // `const { Pool } = require('pg')` or `const pkg = require('pg'); pkg.default.Pool`
  // will work in the module-under-test.
  const poolFactory = vi.fn(() => ({ query: mockQuery }));
  return {
    Pool: poolFactory,
    default: {
      Pool: poolFactory,
    },
  };
});

// Do not mock the module-under-test (`../messages.js`). Instead, the
// `pg` mock will return the account_id row as the first response in each
// test so that `getAccountId` inside the module reads it.

// --- After mocking dependencies, import postOrders ---
// We'll import the module-under-test dynamically in beforeEach so we can
// override its exported pool.query function deterministically.
let postOrders;

describe("postOrders()", () => {
  beforeEach(() => {
    // Dynamically require the module so we can replace its pool.query with a test mock.
    // eslint-disable-next-line global-require
    const msgs = require("../messages.js");
    postOrders = msgs.postOrders;

    // Create a fresh mock function for the pool.query used by the module.
    const q = vi.fn();
    msgs.pool.query = q;
    // expose for assertions in tests
    globalThis.MOCK_QUERY = q;
  });

  it("inserts a positive amount for subscriptions", async () => {
    // 1) account lookup -> return account_id
    // 2) insert -> return order_id
    // 3) fund lookup -> return name/ccy
    const q = globalThis.MOCK_QUERY;
    q.mockResolvedValueOnce({ rows: [{ account_id: 123 }] })
      .mockResolvedValueOnce({ rows: [{ order_id: 1 }] })
      .mockResolvedValueOnce({
        rows: [{ name: "Alpha Growth Fund", ccy: "EUR" }],
      });

    const result = await postOrders(
      "LU1700000001",
      "1000",
      "",
      "Subscription",
      "2025-10-10",
      "auth0|abc123"
    );

    expect(q).toHaveBeenCalledTimes(3);
    // insert is the second query call
    const insertArgs = q.mock.calls[1][1];
    expect(insertArgs[2]).toBe(1000);
    expect(result.name).toBe("Alpha Growth Fund");
  });

  it("inserts a negative amount for redemptions", async () => {
    const q = globalThis.MOCK_QUERY;
    q.mockResolvedValueOnce({ rows: [{ account_id: 123 }] })
      .mockResolvedValueOnce({ rows: [{ order_id: 2 }] })
      .mockResolvedValueOnce({
        rows: [{ name: "Alpha Growth Fund", ccy: "EUR" }],
      });

    const result = await postOrders(
      "LU1700000001",
      "1000",
      "",
      "Redemption",
      "2025-10-10",
      "auth0|abc123"
    );

    const insertArgs = q.mock.calls[1][1];
    expect(insertArgs[2]).toBe(-1000);
    expect(result.name).toBe("Alpha Growth Fund");
  });

  it("handles null amount and unit values", async () => {
    const q = globalThis.MOCK_QUERY;
    q.mockResolvedValueOnce({ rows: [{ account_id: 123 }] })
      .mockResolvedValueOnce({ rows: [{ order_id: 3 }] })
      .mockResolvedValueOnce({ rows: [] });

    await postOrders(
      "LU1700000001",
      "",
      "",
      "Subscription",
      "2025-10-10",
      "auth0|abc123"
    );

    const insertArgs = q.mock.calls[1][1];
    expect(insertArgs[2]).toBeNull();
    expect(insertArgs[3]).toBeNull();
  });
});
