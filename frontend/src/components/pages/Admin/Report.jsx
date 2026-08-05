import React, { useContext, useState, useMemo } from "react";
import Loader from "../../common/Loader";
import { ReportContext } from "../../context/ReportContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export default function Report() {
  const {
    reports,
    loading,
    getTodayReport,
    getWeeklyReport,
    getMonthlyReport,
    getProfitReport,
    getPurchaseReport,
    getBestSellingReport,
    getLowStockReport,
    getOutOfStockReport,
    getExpiredReport,
    getNearExpiryReport,
  } = useContext(ReportContext);

  const [reportType, setReportType] = useState("");

  const handleGenerate = async () => {
    switch (reportType) {
      case "today":
        await getTodayReport();
        break;
      case "weekly":
        await getWeeklyReport();
        break;
      case "monthly":
        await getMonthlyReport();
        break;
      case "profit":
        await getProfitReport();
        break;
      case "purchase":
        await getPurchaseReport();
        break;
      case "best-selling":
        await getBestSellingReport();
        break;
      case "low-stock":
        await getLowStockReport();
        break;
      case "out-of-stock":
        await getOutOfStockReport();
        break;
      case "expired":
        await getExpiredReport();
        break;
      case "near-expiry":
        await getNearExpiryReport();
        break;
      default:
        alert("Select Report Type");
    }
  };

  // Intercept and format the raw MongoDB data before rendering/exporting
  const formattedReports = useMemo(() => {
    if (!reports || reports.length === 0) return [];

    return reports.map((item) => {
      const formatted = {};

      for (const [key, value] of Object.entries(item)) {
        if (key === "_id" || key === "__v" || key === "password") continue;

        const displayKey = key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase());

        if (value && typeof value === "object" && !Array.isArray(value)) {
          if (value.customerName) {
            formatted["Customer"] = value.customerName;
          } else if (value.medicineName) {
            formatted["Medicine"] = value.medicineName;
          } else if (value.supplierName) {
            formatted["Supplier"] = value.supplierName;
          } else if (value.name) {
            formatted[displayKey] = value.name;
          }
        } else if (Array.isArray(value)) {
          formatted[displayKey] = `${value.length} Items`;
        } else if (
          key.toLowerCase().includes("date") ||
          key === "createdAt" ||
          key === "updatedAt"
        ) {
          formatted[displayKey] = value
            ? new Date(value).toLocaleDateString("en-IN")
            : "N/A";
        } else {
          formatted[displayKey] = value?.toString();
        }
      }
      return formatted;
    });
  }, [reports]);

  // --- EXPORT TO PDF ---
  const handleExportPDF = () => {
    if (formattedReports.length === 0) {
      alert("No data to export!");
      return;
    }

    // Use landscape mode because tables are usually wide
    const doc = new jsPDF("landscape");
    
    // Extract headers and rows
    const tableColumn = Object.keys(formattedReports[0]);
    const tableRows = formattedReports.map((item) => Object.values(item));

    // Add title
    doc.setFontSize(14);
    doc.text(`Pharmacy Report: ${reportType.toUpperCase()}`, 14, 15);

    // Generate table
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [37, 99, 235] }, // Blue-600 header
    });

    doc.save(`${reportType || "Pharmacy"}_Report.pdf`);
  };

  // --- EXPORT TO EXCEL ---
  const handleExportExcel = () => {
    if (formattedReports.length === 0) {
      alert("No data to export!");
      return;
    }

    // Create a new workbook and convert JSON to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedReports);
    const workbook = XLSX.utils.book_new();
    
    // Append worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report Data");
    
    // Trigger download
    XLSX.writeFile(workbook, `${reportType || "Pharmacy"}_Report.xlsx`);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-gray-500">Generate Pharmacy Reports</p>
      </div>

      <div className="bg-white rounded-xl shadow p-5 flex flex-wrap gap-4 items-center">
        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          className="border rounded-lg px-4 py-2 outline-none focus:border-blue-500"
        >
          <option value="">Select Report</option>
          <option value="today">Today's Sales</option>
          <option value="weekly">Weekly Sales</option>
          <option value="monthly">Monthly Sales</option>
          <option value="profit">Profit Report</option>
          <option value="purchase">Purchase Report</option>
          <option value="best-selling">Best Selling Medicines</option>
          <option value="low-stock">Low Stock</option>
          <option value="out-of-stock">Out Of Stock</option>
          <option value="expired">Expired Medicines</option>
          <option value="near-expiry">Near Expiry</option>
        </select>

        <button
          onClick={handleGenerate}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Generate Report
        </button>

        <button
          onClick={handleExportPDF}
          disabled={formattedReports.length === 0}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Export PDF
        </button>
        
        <button
          onClick={handleExportExcel}
          disabled={formattedReports.length === 0}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Export Excel
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-auto max-h-[600px]">
        <table className="min-w-full">
          <thead className="bg-gray-100 border-b sticky top-0">
            <tr>
              {formattedReports.length > 0 &&
                Object.keys(formattedReports[0]).map((key) => (
                  <th
                    key={key}
                    className="p-4 text-left font-semibold text-gray-700 whitespace-nowrap"
                  >
                    {key}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {formattedReports.length > 0 ? (
              formattedReports.map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  {Object.values(item).map((value, i) => (
                    <td key={i} className="p-4 text-gray-700 whitespace-nowrap">
                      {value}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="20"
                  className="text-center py-12 text-gray-500 font-medium"
                >
                  No Report Generated or No Data Found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}