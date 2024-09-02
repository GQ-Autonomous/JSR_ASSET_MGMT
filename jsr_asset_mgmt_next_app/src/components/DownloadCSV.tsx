import React from 'react';
import { Button } from "@chakra-ui/react";

const DownloadCSV = ({ tableData }) => {
  const downloadCSV = () => {
    const headers = [
      "Code",
      "Name",
      "Location",
      "Zone / Area",
      "Registered Lat/Long",
      "Scanned Lat/Long",
      "Variation",
      "Scanned By",
      "Scanned Date",
      "Scanned Time",
      "Supervisor Name"
    ];

    const csvRows = tableData.map((data) => {
      return [
        data.code,
        `"${data.name}"`,  // Enclose in quotes to handle commas
        `"${data.locality}"`,  // Enclose in quotes to handle commas
        `"${data.zone} / ${data.area}"`,  // Enclose in quotes to handle commas
        data.dal_latitude && data.dal_longitude ? `"${data.dal_latitude}, ${data.dal_longitude}"` : "-",  // Enclose in quotes
        data.scanned_latitude && data.scanned_longitude ? `"${data.scanned_latitude}, ${data.scanned_longitude}"` : "-",  // Enclose in quotes
        data.variation ? `${data.variation} ft` : "-",
        `"${data.user_name}"`,  // Enclose in quotes to handle commas
        data.scanned_date || "-",
        data.scanned_time || "-",
        `"${data.supervisor_name || "-"}"`  // Enclose in quotes to handle commas
      ].join(",");
    });

    const csvContent = [headers.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "tableData.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Button colorScheme="blue" onClick={downloadCSV}>
      Download CSV
    </Button>
  );
};

export default DownloadCSV;
