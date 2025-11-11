import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
// import SubNavBar from "./SubNavBar";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Label, Input, FormGroup } from "../ui/inputForm";
import Button from "../ui/button";
import { usePlaceOrder } from "../../hooks/usePlaceOrder";
import { fundService } from "../../services/fundService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import "/src/index.css";

library.add(fas, far, fab);

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function PlaceOrderForm() {
  const { getAccessTokenSilently } = useAuth0();
  const { orderData, setOrderData, loading, error, placeOrder } = usePlaceOrder();
  const [confirmation, setConfirmation] = useState(null);
  const [orderReject, setOrderReject] = useState(null);
  const [fundDetails, setFundDetails] = useState(null);
  const [allFundDetails, setAllFundDetails] = useState([]);


  const ISINS =
    [
    "LU1700000001",
    "LU0003290002",
    "LU0003270003",
    "LU0000000004",
    "IE7895600005",
    "IE0000000006",
    "LU0000002777",
    "LU0741747012",
    "LU0010271091",
    "IE0010271881"
  ];


useEffect(() => {
  const fetchAllFunds = async () => {
    try {
      const token = await getAccessTokenSilently();
      const results = await Promise.all(
        ISINS.map((isin) => fundService.getFundByIsin(token, isin))
      );
      setAllFundDetails(results);
    } catch (err) {
      console.error("Error fetching all fund details:", err);
    }
  };
  fetchAllFunds();
}, [getAccessTokenSilently]);

const filteredIsins = ISINS.filter((isin) => {
  if (orderData.order_type !== "Redemption") return true;
  const fund = allFundDetails.find((f) => f.isin === isin);
  return fund && fund.units_held > 0;
});


  const fmt = new Intl.NumberFormat("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const unitFmt = new Intl.NumberFormat("en-GB", { minimumFractionDigits: 4, maximumFractionDigits: 4 });
  const dateFmt = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" });

  useEffect(() => {
    const fetchFund = async () => {
      if (orderData.isin) {
        try {
          const token = await getAccessTokenSilently();
          const fund = await fundService.getFundByIsin(token, orderData.isin);
          setFundDetails(fund);
          setOrderData((prev) => ({
            ...prev,
            fund_name: fund.name,
            ccy: fund.ccy,
            units_held: parseFloat(fund.units_held),
          }));
        } catch (err) {
          console.error("Error fetching fund:", err);
        }
      } else {
        setFundDetails(null);
        setOrderData((prev) => ({
          ...prev,
          fund_name: "",
          ccy: "",
          units_held: "",
          value_date: "",
        }));
      }
    };
    fetchFund();
  }, [orderData.isin, getAccessTokenSilently]);

  useEffect(() => {
    if (fundDetails && orderData.trade_date) {
      const tradeDate = new Date(orderData.trade_date);
      const valueDate = new Date(tradeDate);
      valueDate.setDate(tradeDate.getDate() + (fundDetails.value_calc || 0));
      setOrderData((prev) => ({
        ...prev,
        value_date: valueDate.toISOString().split("T")[0],
      }));
    } else if (!orderData.trade_date) {
      setOrderData((prev) => ({
        ...prev,
        value_date: "",
      }));
    }
  }, [orderData.trade_date, fundDetails]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "amount" && value) {
      setOrderData((prev) => ({ ...prev, units: "" }));
    }
    if (name === "units" && value) {
      setOrderData((prev) => ({ ...prev, amount: "" }));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setConfirmation(null);
    setOrderReject(null);

    if (orderData.order_type === "Redemption") {
      const enteredUnits = parseFloat(orderData.units || 0);
      const availableUnits = parseFloat(orderData.units_held || 0);

      if (enteredUnits > availableUnits) {
        setOrderReject({
          message: "Please change the redemption units — they exceed your available holdings."
        });
        return;
      }
    }

    const result = await placeOrder(orderData);
    if (result.success) {
      setConfirmation({
        orderId: result.order_id,
        message: `Your order has been successfully submitted under order ID #${result.order_id}. Please review the details in your Order History.`
      });
    }
  };

  const isFormValid = () => {
    return (
      orderData.order_type &&
      orderData.isin &&
      orderData.trade_date &&
      (orderData.amount || orderData.units)
    );
  };

  const isWeekday = (date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };

  if (loading) {
    return (
      <>
        {/* <SubNavBar /> */}
        <div className="order-loading-container">
          <div className="loading-spinner"></div>
          <p>Submitting your order...</p>
        </div>
      </>
    );
  }

  return (
    <>
      {/* <SubNavBar /> */}
      <div className="order-page-container">
        <div className="order-header">
          <div className="header-content">
            <h1 className="text-3xl font-bold mb-6">Place New Order</h1>
            <p className="page-subtitle">Subscribe to or redeem from your fund investments</p>
          </div>
        </div>

        {confirmation && (
          <div className="confirmation-banner">
            <div className="confirmation-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="confirmation-content">
              <h4 className="confirmation-title">Order Submitted Successfully!</h4>
              <p className="confirmation-message">{confirmation.message}</p>
            </div>
          </div>
        )}

        {orderReject && (
          <div className="confirmation-banner error">
            <div className="rejection-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="confirmation-content">
              <h4 className="rejection-title text-red-600">Order Rejected</h4>
              <p className="rejection-message">{orderReject.message}</p>
            </div>
          </div>
        )}

        <div className="order-content-grid">
          {/* Order Details Card */}
          <Card className="modern-order-card">
            <CardHeader className="modern-card-header">
              <div className="card-header-content">
                <div className="card-icon-wrapper order-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <CardTitle className="modern-card-title">Order Details</CardTitle>
                  <p className="card-description">Enter your transaction information</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="modern-card-content">
              <div className="form-grid">
                <div className="modern-form-field">
                  <Label className="modern-label" htmlFor="order_type">
                    Order Type
                    <span className="required-indicator">*</span>
                  </Label>
                  <Select
                    value={orderData.order_type}
                    onValueChange={(value) =>
                      setOrderData((prev) => ({ ...prev, order_type: value }))
                    }
                  >
                    <SelectTrigger className="modern-select-trigger">
                      <SelectValue placeholder="Select order type..." />
                    </SelectTrigger>
                    <SelectContent className="modern-select-content">
                      <SelectItem value="Subscription">
                        <div className="select-item-content">
                          <span className="order-type-dot subscription"></span>
                          Subscription (Buy)
                        </div>
                      </SelectItem>
                      <SelectItem value="Redemption">
                        <div className="select-item-content">
                          <span className="order-type-dot redemption"></span>
                          Redemption (Sell)
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="modern-form-field">
                  <Label className="modern-label" htmlFor="isin">
                    ISIN
                    <span className="required-indicator">*</span>
                  </Label>
                  <Select
                    value={orderData.isin}
                    onValueChange={(value) =>
                      setOrderData((prev) => ({ ...prev, isin: value }))
                    }
                  >
                    <SelectTrigger className="modern-select-trigger monospace">
                      <SelectValue placeholder="Select fund ISIN..." />
                    </SelectTrigger>
                    <SelectContent className="modern-select-content">
                      {filteredIsins.map((isin) => (
                        <SelectItem key={isin} value={isin} className="monospace">
                          {isin}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

              <div className="modern-form-field">
                  <Label className="modern-label" htmlFor="trade_date">
                    Trade Date
                    <span className="required-indicator">*</span>
                  </Label>
                <div className="input-with-icon relative">
                  <svg
                    className="input-icon absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="18"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M16 2v4M8 2v4M3 10h18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>

                  <div className="w-full">
                    <DatePicker
                      id="trade_date"
                      className="modern-input pl-10"
                      selected={
                        orderData.trade_date ? new Date(orderData.trade_date) : null
                      }
                      onChange={(date) =>
                        setOrderData((prev) => ({
                          ...prev,
                          trade_date: date.toISOString().split("T")[0],
                        }))
                      }
                      minDate={new Date()}
                      filterDate={isWeekday}
                      placeholderText="Select trade date"
                      dateFormat="dd-MM-yyyy"
                      calendarStartDay={1}
                      isClearable
                    />
                  </div>
                </div>
              </div>


                <div className="form-grid two-column">
                  <div className="modern-form-field">
                    <Label className="modern-label" htmlFor="amount">
                      Amount {orderData.ccy && `(${orderData.ccy})`}
                      {orderData.order_type === "Subscription" && <span className="required-indicator">*</span>}
                    </Label>
                    <Input
                      id="amount"
                      name="amount"
                      className="modern-input"
                      type="number"
                      step="0.01"
                      value={orderData.amount}
                      onChange={handleInputChange}
                      disabled={
                        orderData.order_type === "Redemption" || !!orderData.units
                      }
                      placeholder="0.00"
                    />
                    {orderData.order_type === "Redemption" && (
                      <span className="field-hint">Disabled for redemptions</span>
                    )}
                  </div>

                  <div className="modern-form-field">
                    <Label className="modern-label" htmlFor="units">
                      Units
                      {orderData.order_type === "Redemption" && <span className="required-indicator">*</span>}
                    </Label>
                    <Input
                      id="units"
                      name="units"
                      className="modern-input"
                      type="number"
                      step="0.0001"
                      value={orderData.units}
                      onChange={handleInputChange}
                      disabled={
                        orderData.order_type === "Subscription" &&
                        !!orderData.amount
                      }
                      placeholder="0.0000"
                    />
                    {orderData.order_type === "Subscription" && orderData.amount && (
                      <span className="field-hint">Amount already specified</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fund Information Card */}
          <Card className="modern-order-card">
            <CardHeader className="modern-card-header">
              <div className="card-header-content">
                <div className="card-icon-wrapper fund-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <CardTitle className="modern-card-title">Fund Information</CardTitle>
                  <p className="card-description">Details about the selected fund</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="modern-card-content">
              <div className="form-grid">
                {fundDetails ? (
                  <>
                    <div className="info-field">
                      <Label className="info-label">Fund Name</Label>
                      <div className="info-value">{orderData.fund_name || "—"}</div>
                    </div>

                    <div className="info-field">
                      <Label className="info-label">Current Holdings</Label>
                      <div className="info-value highlight">
                        {Number.isFinite(Number(orderData.units_held))
                          ? fmt.format(Number(orderData.units_held))
                          : "0.00"} units
                      </div>
                    </div>

                    <div className="form-grid two-column">
                      <div className="info-field">
                        <Label className="info-label">Value Date</Label>
                        <div className="info-value monospace">
                          {orderData.value_date
                            ? new Date(orderData.value_date).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })
                            : "—"}
                        </div>
                      </div>

                      <div className="info-field">
                        <Label className="info-label">Currency</Label>
                        <div className="info-value">
                          <span className="currency-badge">{orderData.ccy || "—"}</span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="empty-fund-state">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="empty-icon">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <p className="empty-text">Select an ISIN to view fund details</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submit Button */}
        <div className="form-actions centered">
          <Button
            className="submit-order-btn"
            value={loading ? "Submitting..." : "Submit Order"}
            onClick={handleSubmit}
            variant="primary"
            disabled={!isFormValid() || loading}
          />
        </div>

        {error && (
          <div className="error-banner">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>Error: {error}</span>
          </div>
        )}
      </div>
    </>
  );
}

export default PlaceOrderForm;
