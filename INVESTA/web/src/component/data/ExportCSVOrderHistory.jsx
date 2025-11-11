import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";

import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";

library.add(fas, far, fab);

const dateFmt = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" });

const ExportCSVOrderHistory = ({ data, fileName }) => {
  const downloadCSV = () => {
    const csvString = [
      ["Order ID",
        "Fund Name",
        "ISIN",
        "Order Type",
        "Trade Date",
        "Value Date",
        "NAV at Trade Date",
        "Units",
        "Amount",
        "Status",
        "Currency"
      ],
      ...data.map(item => [
        item.order_id,
        item.name,
        item.isin,
        item.order_type,
        dateFmt.format(new Date(item.trade_date)),
        dateFmt.format(new Date(item.value_date)),
        item.nav_at_td,
        (Number(item.units).toFixed(4) || 0),
        Number(item.td_value).toFixed(2),
        item.status,
        item.ccy
      ])
    ]
    .map(row => row.join(","))
    .join("\n");

    const blob = new Blob([csvString], { type: 'text/csv' });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || 'download.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="download-icon">
    <button className="csv-btn" onClick={downloadCSV} aria-label="Export CSV">
      <FontAwesomeIcon icon={["fas", "download"]} />
    </button>
    </div>
  );
};

export default ExportCSVOrderHistory;