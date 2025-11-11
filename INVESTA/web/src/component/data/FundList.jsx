import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import ExportCSVFundList from "./ExportCSVFundList";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import "/src/index.css";

import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
} from "../ui/table";
import { useFundList } from "../../hooks/useFundList";
import "/src/index.css";

function FundList() {
  const { funds, loading, error, hasFunds } = useFundList();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [selectedIsin, setSelectedIsin] = useState(
    sessionStorage.getItem("selectedIsin") || null
  );
  const [searchTerm, setSearchTerm] = useState("");

  const searchTermLower = (searchTerm || "").trim().toLowerCase();
  const filteredFunds = (funds || []).filter((fund) => {
    if (!searchTermLower) return true;
    return (
      (fund.name || "").toLowerCase().includes(searchTermLower) ||
      (fund.isin || "").toLowerCase().includes(searchTermLower) ||
      (fund.fund_type || "").toLowerCase().includes(searchTermLower) ||
      String(fund.fund_id ?? "")
        .toLowerCase()
        .includes(searchTermLower) ||
      String(fund.units_held ?? "")
        .toLowerCase()
        .includes(searchTermLower) ||
      String(fund.current_value ?? "")
        .toLowerCase()
        .includes(searchTermLower) ||
      (fund.ccy || "").toLowerCase().includes(searchTermLower)
    );
  });

  useEffect(() => {
    const savedScroll = sessionStorage.getItem("fundScroll");
    if (savedScroll && containerRef.current) {
      containerRef.current.scrollTo(0, parseInt(savedScroll, 10));
    }
  }, []);

  const handleRowClick = (isin) => {
    sessionStorage.setItem("selectedIsin", isin);
    if (containerRef.current) {
      sessionStorage.setItem("fundScroll", containerRef.current.scrollTop);
    }
    navigate(`/orders?isin=${isin}`);
  };

  const fmt = new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const unitFmt = new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  });

  if (loading) return <div className="loading">Loading funds...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!hasFunds) return <div className="no-funds text-gray-500">Your fund portfolio will be shown here once you have placed your first order.</div>;

  return (
    <>
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
        placeholder="Search by fund name or ISIN..."
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
    <ExportCSVFundList data={filteredFunds} fileName="myFundPortfolio.csv" />
  </div>

  <div className="results-info">
    <span className="results-count">
      {filteredFunds.length} {filteredFunds.length === 1 ? 'fund' : 'funds'}
    </span>
  </div>

  <div className="list-container">
    <div className="table-wrapper">
      <Table className="modern-fund-table">
        <TableHead>
          <TableRow className="table-header-row">
            <TableHeader className="th-fund-info">Fund Details</TableHeader>
            <TableHeader className="th-value">Holdings & Value</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredFunds.length > 0 ? (
            filteredFunds.map((fund) => (
              <TableRow
                key={fund.isin}
                onClick={() => handleRowClick(fund.isin)}
                onKeyDown={(e) => e.key === "Enter" && handleRowClick(fund.isin)}
                tabIndex={0}
                className={`fund-row ${
                  fund.isin === selectedIsin ? 'selected' : ''
                }`}
              >
                <TableCell className="cell-fund-info">
                  <div className="fund-details">
                    <div className="fund-name-wrapper">
                      <span className="fund-name">{fund.name}</span>
                      <span className="fund-type-badge">{fund.fund_type}</span>
                    </div>
                    <span className="fund-isin">ISIN: {fund.isin}</span>
                  </div>
                </TableCell>

                <TableCell className="cell-value-info">
                  <div className="value-details">
                    <div className="value-row">
                      <span className="value-label">Current Value</span>
                      <span className="current-value">
                        {Number.isFinite(Number(fund.current_value))
                          ? fmt.format(Number(fund.current_value))
                          : "—"}{" "}
                        <span className="currency">{fund.ccy}</span>
                      </span>
                    </div>
                    <div className="units-row">
                      <span className="units-label">Units Held</span>
                      <span className="units-held">
                        {Number.isFinite(Number(fund.units_held))
                          ? unitFmt.format(Number(fund.units_held))
                          : "—"}
                      </span>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={2} className="empty-state">
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
                  <p className="empty-title">No funds found</p>
                  <p className="empty-description">
                    {searchTerm
                      ? `No results for "${searchTerm}"`
                      : "You haven't invested in any funds yet"
                    }
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  </div>
</div>
    </>
  );
}

export default FundList;
