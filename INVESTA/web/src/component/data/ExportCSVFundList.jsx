import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";

import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";

library.add(fas, far, fab);

const ExportCSVFundList = ({ data, fileName }) => {
  const downloadCSV = () => {
    const rows = [
      [
        "Fund ID",
        "Name",
        "ISIN",
        "Fund Type",
        "Units Held",
        "Current Value",
        "Currency",
      ],
      ...(data || []).map((item) => [
        item.fund_id,
        item.name,
        item.isin,
        item.fund_type,
        Number(item.units_held).toFixed(4),
        Number(item.current_value).toFixed(2),
        item.ccy,
      ]),
    ];

    const csvString = rows.map((row) => row.join(",")).join("\n");

    const blob = new Blob([csvString], { type: "text/csv" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName || "download.csv";
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

export default ExportCSVFundList;
