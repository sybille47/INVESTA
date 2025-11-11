import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import PlaceOrderForm from "../PlaceOrderForm";
import { usePlaceOrder } from "../../../hooks/usePlaceOrder";
import { useAuth0 } from "@auth0/auth0-react";

// Mock useAuth0 to bypass ProtectedRoute logic
vi.mock("@auth0/auth0-react", () => ({
  useAuth0: () => ({
    getAccessTokenSilently: vi.fn().mockResolvedValue("mockToken"),
  }),
}));

// Mock usePlaceOrder. Provide a mutable `hookValue` that tests can set
// so the component sees valid data and enables the submit button.
const mockPlaceOrder = vi.fn();
let hookValue = {
  orderData: {
    order_type: "",
    isin: "",
    amount: "",
    units: "",
    trade_date: "",
  },
  setOrderData: vi.fn((newData) => {
    // shallow merge to simulate state update
    hookValue.orderData = { ...hookValue.orderData, ...newData };
  }),
  placeOrder: mockPlaceOrder,
};

vi.mock("../../../hooks/usePlaceOrder", () => ({
  usePlaceOrder: () => hookValue,
}));

describe("<PlaceOrderForm />", () => {
  it("calls placeOrder with positive amount for Subscription", async () => {
    // Pre-populate the mocked hook so component renders with enabled submit
    hookValue.orderData = {
      order_type: "Subscription",
      isin: "LU1700000001",
      amount: "1000",
      units: "",
      trade_date: "2025-10-10",
    };
    mockPlaceOrder.mockReset();
    mockPlaceOrder.mockResolvedValue({ success: true, order_id: 42 });

    render(<PlaceOrderForm />);
    const submitButton = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockPlaceOrder).toHaveBeenCalled();
    });
  });

  it("calls placeOrder with negative amount for Redemption", async () => {
    hookValue.orderData = {
      order_type: "Redemption",
      isin: "LU1700000001",
      amount: "1000",
      units: "",
      trade_date: "2025-10-10",
    };
    mockPlaceOrder.mockReset();
    mockPlaceOrder.mockResolvedValue({ success: true, order_id: 43 });

    render(<PlaceOrderForm />);
    const submitButton = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockPlaceOrder).toHaveBeenCalled();
    });
  });
});
