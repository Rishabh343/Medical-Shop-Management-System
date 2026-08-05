import React, { useContext, useState } from "react";

import Loader from "../../common/Loader";
import { ReportContext } from "../../context/ReportContext";

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

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">

      <div>

        <h1 className="text-3xl font-bold">
          Reports
        </h1>

        <p className="text-gray-500">
          Generate Pharmacy Reports
        </p>

      </div>

      <div className="bg-white rounded-xl shadow p-5 flex flex-wrap gap-4 items-center">

        <select
          value={reportType}
          onChange={(e) =>
            setReportType(e.target.value)
          }
          className="border rounded-lg px-4 py-2"
        >
          <option value="">
            Select Report
          </option>

          <option value="today">
            Today's Sales
          </option>

          <option value="weekly">
            Weekly Sales
          </option>

          <option value="monthly">
            Monthly Sales
          </option>

          <option value="profit">
            Profit Report
          </option>

          <option value="purchase">
            Purchase Report
          </option>

          <option value="best-selling">
            Best Selling Medicines
          </option>

          <option value="low-stock">
            Low Stock
          </option>

          <option value="out-of-stock">
            Out Of Stock
          </option>

          <option value="expired">
            Expired Medicines
          </option>

          <option value="near-expiry">
            Near Expiry
          </option>

        </select>

        <button
          onClick={handleGenerate}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Generate Report
        </button>

        {/* Add these later */}
        <button
          className="bg-red-600 text-white px-6 py-2 rounded-lg"
        >
          Export PDF
        </button>

        <button
          className="bg-green-600 text-white px-6 py-2 rounded-lg"
        >
          Export Excel
        </button>

      </div>

      <div className="bg-white rounded-xl shadow overflow-auto">

        <table className="min-w-full">

          <thead className="bg-gray-100">

            <tr>

              {reports.length > 0 &&
                Object.keys(reports[0]).map((key) => (
                  <th
                    key={key}
                    className="p-3 text-left capitalize"
                  >
                    {key}
                  </th>
                ))}

            </tr>

          </thead>

          <tbody>

            {reports.length > 0 ? (
              reports.map((item, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-50"
                >
                  {Object.values(item).map(
                    (value, i) => (
                      <td
                        key={i}
                        className="p-3"
                      >
                        {typeof value ===
                        "object"
                          ? JSON.stringify(value)
                          : value?.toString()}
                      </td>
                    )
                  )}
                </tr>
              ))
            ) : (
              <tr>

                <td
                  colSpan="20"
                  className="text-center py-8 text-gray-500"
                >
                  No Report Generated
                </td>

              </tr>
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}