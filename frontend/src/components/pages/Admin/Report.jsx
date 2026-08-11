import React, { useContext, useState, useMemo } from "react";
import Loader from "../../common/Loader";
import { ReportContext } from "../../context/ReportContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function Report() {
  const navigate= useNavigate()
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
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        {" "}
        <div className="flex items-start gap-4">
          {" "}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-1 flex h-10 items-center gap-2 rounded-xl border border-stone-200 bg-[#faf9f6] px-4 text-sm font-medium text-stone-700 shadow-sm transition hover:bg-white hover:text-stone-900"
          >
            <ArrowLeft size={15} />
          </button>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-stone-400">
              Analytics
            </p>

            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-stone-900">
              Reports
            </h1>

            <p className="mt-1 text-sm text-stone-500">
              Generate and export pharmacy reports.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-stone-200 bg-[#faf9f6] p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="w-full lg:max-w-xs">
            <label className="mb-2 block text-sm font-medium text-stone-700">
              Report Type
            </label>

            <div className="relative">
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full appearance-none rounded-xl border border-stone-200 bg-white px-4 py-3 pr-10 text-sm text-stone-800 outline-none transition focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
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

              <svg
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleGenerate}
              className="rounded-xl bg-stone-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-stone-800 hover:shadow-md"
            >
              Generate Report
            </button>

            <button
              onClick={handleExportPDF}
              disabled={formattedReports.length === 0}
              className="rounded-xl border border-stone-200 bg-white px-5 py-3 text-sm font-medium text-stone-700 shadow-sm transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Export PDF
            </button>

            <button
              onClick={handleExportExcel}
              disabled={formattedReports.length === 0}
              className="rounded-xl border border-stone-200 bg-white px-5 py-3 text-sm font-medium text-stone-700 shadow-sm transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Export Excel
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-[#faf9f6] shadow-sm">
        <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-stone-900">
              Report Data
            </h2>

            <p className="mt-1 text-xs text-stone-400">
              {formattedReports.length > 0
                ? `${formattedReports.length} records found`
                : "Generate a report to view results"}
            </p>
          </div>
        </div>

        <div className="max-h-[600px] overflow-auto">
          <table className="min-w-full">
            <thead className="sticky top-0 z-10 border-b border-stone-200 bg-stone-50">
              <tr>
                {formattedReports.length > 0 &&
                  Object.keys(formattedReports[0]).map((key) => (
                    <th
                      key={key}
                      className="whitespace-nowrap px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-500"
                    >
                      {key}
                    </th>
                  ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-100">
              {formattedReports.length > 0 ? (
                formattedReports.map((item, index) => (
                  <tr key={index} className="transition hover:bg-stone-50/80">
                    {Object.values(item).map((value, i) => (
                      <td
                        key={i}
                        className="whitespace-nowrap px-5 py-4 text-sm text-stone-600"
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="20" className="px-5 py-16 text-center">
                    <p className="text-sm font-medium text-stone-700">
                      No Report Generated
                    </p>

                    <p className="mt-1 text-xs text-stone-400">
                      Select a report type and generate the report to view data.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
