import React, { useState } from 'react';
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
} from "../ui/table";
import { useOrderHistory } from "../../hooks/useOrderHistory";
import ExportCSVOrderHistory from './ExportCSVOrderHistory';
import "/src/index.css";
// import "/src/orderHistory.css";

function OrderHistory({ isin = null }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  isin = searchParams.get("isin");
  const { orders, loading, error, hasOrders } = useOrderHistory(isin);

  const fmt = new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const unitFmt = new Intl.NumberFormat(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 });
  const dateFmt = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" });

  if (loading) return <div className="loading">Loading orders...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!hasOrders) return <div className="no-funds text-gray-500">Your order history will be shown here once you've placed your first order.</div>;

  // === search ===
  const searchTermLower = (searchTerm || "").trim().toLowerCase();
  const filteredOrders = (orders || []).filter((order) => {
    if (!searchTermLower) return true;
    return (
      String(order.order_id ?? "").toLowerCase().includes(searchTermLower) ||
      (order.name || "").toLowerCase().includes(searchTermLower) ||
      (order.isin || "").toLowerCase().includes(searchTermLower) ||
      (order.order_type || "").toLowerCase().includes(searchTermLower) ||
      String(order.trade_date ?? "").toLowerCase().includes(searchTermLower) ||
      String(order.value_date ?? "").toLowerCase().includes(searchTermLower) ||
      String(order.nav_at_td ?? "").toLowerCase().includes(searchTermLower) ||
      String(order.units ?? "").toLowerCase().includes(searchTermLower) ||
      String(order.td_value ?? "").toLowerCase().includes(searchTermLower) ||
      (order.status || "").toLowerCase().includes(searchTermLower) ||
      (order.ccy || "").toLowerCase().includes(searchTermLower)
    );
  });

  const groupedOrders = filteredOrders.reduce((acc, order) => {
    if (!order.trade_date) return acc;
    const date = new Date(order.trade_date);
    const key = `${date.getFullYear()}-${String(date.getMonth()).padStart(2, '0')}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(order);
    return acc;
  }, {});

  const sortedGroups = Object.entries(groupedOrders).sort(([keyA], [keyB]) => {
    return keyB.localeCompare(keyA);
  });

  const isValidNumber = (val) => {
  if (val === null || val === undefined) return false;
  if (typeof val === "string" && val.trim().toLowerCase() === "null") return false;
  return Number.isFinite(Number(val));
};


  return (
    <div className="display-container">
      <div className="table-header-section">
        <div className="search-wrapper">
          <svg
            className="search-icon"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <input
            type="text"
            placeholder="Search by fund, ISIN, order type, or date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="clear-search"
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
        <ExportCSVOrderHistory data={filteredOrders} fileName="myOrderHistory.csv" />
      </div>

      <div className="results-info">
        <span className="results-count">
          {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'}
        </span>
      </div>

      <div className="list-container orders-list">
        {sortedGroups.length > 0 ? (
          sortedGroups.map(([key, ordersInMonth]) => {
            const [year, monthIdx] = key.split("-");
            const monthName = new Date(year, parseInt(monthIdx)).toLocaleString("en-GB", {
              month: "long",
              year: "numeric"
            });

            return (
              <div key={key} className="month-group p-6 rounded-lg shadow-lg mb-6">
                <div className="month-header bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg mb-6">
                  <h3 className="month-heading">{monthName}</h3>
                  <span className="month-count">
                    {ordersInMonth.length} {ordersInMonth.length === 1 ? 'order' : 'orders'}
                  </span>
                </div>

                <div className="table-wrapper">
                  <Table className="modern-order-table">
                    <TableHead>
                      <TableRow className="table-header-row">
                        <TableHeader className="th-order-id">ID</TableHeader>
                        <TableHeader className="th-fund-details">Fund Details</TableHeader>
                        <TableHeader className="th-order-type">Type</TableHeader>
                        <TableHeader className="th-dates">Dates</TableHeader>
                        <TableHeader className="th-nav">NAV</TableHeader>
                        <TableHeader className="th-units">Units</TableHeader>
                        <TableHeader className="th-amount">Amount</TableHeader>
                        <TableHeader className="th-status">Status</TableHeader>
                      </TableRow>
                    </TableHead>

                    <TableBody className="table-body">
                      {ordersInMonth.map((order) => (
                        <TableRow
                          key={order.order_id}
                          className="order-row"
                        >
                          <TableCell className="cell-order-id">
                            <span className="order-id-badge">#{order.order_id}</span>
                          </TableCell>

                          <TableCell className="cell-fund-details">
                            <div className="fund-details">
                              <span className="fund-name">{order.name}</span>
                              <span className="fund-isin">ISIN: {order.isin}</span>
                            </div>
                          </TableCell>

                          <TableCell className="cell-order-type">
                            <span className={`order-type-badge ${order.order_type?.toLowerCase()}`}>
                              {order.order_type}
                            </span>
                          </TableCell>

                          <TableCell className="cell-dates">
                            <div className="date-details">
                              <div className="date-row">
                                <span className="date-label">Trade:</span>
                                <span className="date-value">
                                  {order.trade_date ? dateFmt.format(new Date(order.trade_date)) : "—"}
                                </span>
                              </div>
                              <div className="date-row">
                                <span className="date-label">Value:</span>
                                <span className="date-value">
                                  {order.value_date ? dateFmt.format(new Date(order.value_date)) : "—"}
                                </span>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell className="cell-nav">
                            <span className="nav-value">
                              {fmt.format(order.nav_at_td)}
                            </span>
                          </TableCell>

                        <TableCell className="cell-units cell-numeric">
                          <span className={`units-value ${parseFloat(order.units) < 0 ? 'negative' : 'positive'}`}>
                            {isValidNumber(order.units) ? unitFmt.format(order.units) : '—'}
                          </span>
                        </TableCell>

                        <TableCell className="cell-amount cell-numeric">
                          {isValidNumber(order.amount) ? (
                            <span className={`amount-value ${parseFloat(order.amount) < 0 ? 'negative' : 'positive'}`}>
                              {fmt.format(Math.abs(order.amount))} {order.ccy}
                            </span>
                          ) : isValidNumber(order.td_value) ? (
                            <span className={`amount-value ${parseFloat(order.td_value) < 0 ? 'negative' : 'positive'}`}>
                              {fmt.format(Math.abs(order.td_value))} {order.ccy}
                            </span>
                          ) : (
                            <span className="amount-value">—</span>
                          )}
                        </TableCell>

                          <TableCell className="cell-status">
                            <span className={`status-badge ${order.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                              {order.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty-state-wrapper">
            <div className="empty-state-content">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                className="empty-icon"
              >
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <p className="empty-title text-gray-500">No orders found</p>
              <p className="empty-description">
                {searchTerm
                  ? `No results for "${searchTerm}"`
                  : "You haven't placed any orders yet"
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderHistory;