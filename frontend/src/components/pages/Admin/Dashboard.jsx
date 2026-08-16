import React, { useContext, useEffect } from "react";
import {
  FaPills,
  FaUsers,
  FaWarehouse,
  FaFileInvoiceDollar,
  FaTruck,
  FaExclamationTriangle,
  FaRupeeSign,
  FaChartBar,
  FaUserCog,
  FaChartLine,
  FaBoxOpen,
} from "react-icons/fa";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { DashboardContext } from "../../context/DashboardContext";
import Loader from "../../common/Loader";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { dashboard, loading, getDashboard } = useContext(DashboardContext);
  const navigate = useNavigate();
  useEffect(() => {
    getDashboard();
  }, []);

  if (loading || !dashboard) {
    return <Loader />;
  }

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const formattedMonthlySales =
    dashboard.monthlySales?.map((item) => ({
      month: monthNames[item._id.month - 1] || "Unknown",
      Revenue: item.totalSales,
    })) || [];

  const cards = [
    {
      title: "Total Medicines",
      value: dashboard.totalMedicines,
      icon: <FaPills />,
      color: "bg-blue-500",
    },
    {
      title: "Total Stock Units",
      value: dashboard.totalStock || 0,
      icon: <FaBoxOpen />,
      color: "bg-cyan-500",
    },
    {
      title: "Today's Sales",
      value: `₹${dashboard.todaySales}`,
      icon: <FaFileInvoiceDollar />,
      color: "bg-emerald-500",
    },
    {
      title: "Monthly Revenue",
      value: `₹${dashboard.monthlyRevenue}`,
      icon: <FaRupeeSign />,
      color: "bg-indigo-500",
    },
    {
      title: "Total Customers",
      value: dashboard.totalCustomers,
      icon: <FaUsers />,
      color: "bg-violet-500",
    },
    {
      title: "Total Suppliers",
      value: dashboard.totalSuppliers,
      icon: <FaTruck />,
      color: "bg-fuchsia-500",
    },
    {
      title: "Low Stock Alerts",
      value: dashboard.lowStockMedicines?.length || 0,
      icon: <FaWarehouse />,
      color: "bg-amber-500",
    },
    {
      title: "Expired Medicines",
      value: dashboard.expiredMedicines?.length || 0,
      icon: <FaExclamationTriangle />,
      color: "bg-rose-500",
    },
  ];

  // Colors for Pie Chart
  const COLORS = [
    "#3B82F6",
    "#22C55E",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#06B6D4",
    "#F97316",
    "#EC4899",
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-stone-400">
            Overview
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-stone-900">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-stone-500">
            Pharmacy Management Overview
          </p>
        </div>

        <div className="rounded-xl border border-stone-200 bg-[#faf9f6] px-4 py-2.5">
          <p className="text-[10px] uppercase tracking-wider text-stone-400">
            Status
          </p>

          <div className="mt-1 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

            <span className="text-xs font-medium text-stone-700">
              System Operational
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {cards.map((card, index) => (
          <div
            key={index}
            className="group rounded-xl border border-stone-200 bg-[#faf9f6] px-4 py-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-md"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-[8px] font-medium uppercase tracking-[0.12em] text-stone-400">
                  {card.title}
                </p>

                <h2 className="mt-1 text-lg font-semibold tracking-tight text-stone-900">
                  {card.value}
                </h2>
              </div>

              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white shadow-sm ${card.color}`}
              >
                {React.cloneElement(card.icon, {
                  size: 13,
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1.75fr_1fr]">
        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-[#faf9f6] shadow-sm">
          <div className="border-b border-stone-200 px-5 py-4">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-stone-400">
              Transactions
            </p>

            <h2 className="mt-1 text-lg font-semibold text-stone-900">
              Recent Invoices
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-stone-200 bg-stone-50/70 text-stone-400">
                <tr>
                  <th className="px-5 py-3 font-medium">Bill No</th>
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 text-right font-medium">Amount</th>
                  <th className="px-5 py-3 text-right font-medium">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-stone-100">
                {dashboard.recentSales?.length > 0 ? (
                  dashboard.recentSales.map((sale) => (
                    <tr key={sale._id} className="transition hover:bg-stone-50">
                      <td className="px-5 py-3.5 font-medium text-stone-900">
                        {sale.billNumber}
                      </td>
                      <td className="px-5 py-3.5 text-stone-500">
                        {sale.customer?.customerName}
                      </td>
                      <td className="px-5 py-3.5 text-right font-semibold text-stone-900">
                        ₹{Number(sale.finalAmount).toLocaleString("en-IN")}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => navigate(`/invoice/${sale._id}`)}
                          className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-[11px] font-medium text-stone-600 transition hover:border-stone-300 hover:bg-stone-100 hover:text-stone-900"
                        >
                          View Invoice
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-5 py-8 text-center text-stone-400"
                    >
                      No recent sales.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-[#faf9f6] p-5 shadow-sm">
          <div className="mb-4">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-stone-400">
              Shortcuts
            </p>

            <h2 className="mt-1 text-lg font-semibold tracking-tight text-stone-900">
              Quick Actions
            </h2>

            <p className="mt-1 text-xs text-stone-500">
              Manage your pharmacy quickly
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {[
              {
                title: "Medicines",
                description: "Manage medicines",
                icon: FaPills,
                path: "/admin/medicine",
              },
              {
                title: "Inventory",
                description: "Manage stock",
                icon: FaBoxOpen,
                path: "/admin/inventory",
              },
              {
                title: "Billing",
                description: "Create invoice",
                icon: FaFileInvoiceDollar,
                path: "/admin/billing",
              },
              {
                title: "Customers",
                description: "Manage customers",
                icon: FaUsers,
                path: "/admin/customers",
              },
              {
                title: "Reports",
                description: "View reports",
                icon: FaChartBar,
                path: "/admin/reports",
              },
              {
                title: "Users",
                description: "Manage users",
                icon: FaUserCog,
                path: "/admin/user",
              },
            
            ].map((action) => {
              const Icon = action.icon;

              return (
                <button
                  key={action.title}
                  type="button"
                  onClick={() => navigate(action.path)}
                  className="group rounded-xl border border-stone-200 bg-white p-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-stone-300 hover:bg-stone-50 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-100 text-stone-600 transition group-hover:bg-stone-900 group-hover:text-white">
                      <Icon size={13} />
                    </div>

                    <span className="text-xs text-stone-300 transition group-hover:translate-x-0.5 group-hover:text-stone-600">
                      →
                    </span>
                  </div>

                  <p className="mt-3 text-xs font-semibold text-stone-900">
                    {action.title}
                  </p>

                  <p className="mt-0.5 text-[9px] text-stone-400">
                    {action.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-stone-200 bg-[#faf9f6] p-5 shadow-sm md:p-6">
          <div className="mb-2">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-stone-400">
              Sales Analysis
            </p>

            <h2 className="mt-1 text-lg font-semibold text-stone-900">
              Sales by Category
            </h2>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={dashboard.categorySales || []}
                dataKey="totalSales"
                nameKey="_id"
                cx="50%"
                cy="45%"
                outerRadius={88}
                innerRadius={60}
                paddingAngle={4}
                stroke="#faf9f6"
                strokeWidth={3}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {dashboard.categorySales?.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip
                contentStyle={{
                  backgroundColor: "#faf9f6",
                  border: "1px solid #e7e5e4",
                  borderRadius: "12px",
                  boxShadow: "0 8px 25px rgba(28,25,23,0.08)",
                }}
                formatter={(value) =>
                  `₹${Number(value).toLocaleString("en-IN")}`
                }
              />

              <Legend
                verticalAlign="bottom"
                height={30}
                iconType="circle"
                wrapperStyle={{
                  fontSize: "11px",
                  color: "#78716c",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-[#faf9f6] p-5 shadow-sm md:p-6">
          <div className="mb-2">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-stone-400">
              Product Performance
            </p>

            <h2 className="mt-1 text-lg font-semibold text-stone-900">
              Top Selling Medicines
            </h2>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={dashboard.topSellingMedicines || []}
              layout="vertical"
              margin={{
                left: 10,
                right: 10,
                top: 5,
                bottom: 5,
              }}
            >
              <CartesianGrid
                stroke="#e7e5e4"
                strokeDasharray="4 4"
                horizontal={false}
              />

              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#a8a29e",
                  fontSize: 10,
                }}
              />

              <YAxis
                dataKey="medicineName"
                type="category"
                axisLine={false}
                tickLine={false}
                width={105}
                tick={{
                  fill: "#44403c",
                  fontSize: 11,
                }}
              />

              <Tooltip
                cursor={{
                  fill: "#f5f5f4",
                }}
                contentStyle={{
                  backgroundColor: "#faf9f6",
                  border: "1px solid #e7e5e4",
                  borderRadius: "12px",
                  boxShadow: "0 8px 25px rgba(28,25,23,0.08)",
                }}
              />

              <Bar
                dataKey="quantitySold"
                fill="#292524"
                radius={[0, 6, 6, 0]}
                barSize={18}
                name="Units Sold"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-stone-200 bg-[#faf9f6] p-5 shadow-sm">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-stone-400">
                Financial Overview
              </p>

              <h2 className="mt-1 text-lg font-semibold tracking-tight text-stone-900">
                Revenue Trend
              </h2>

              <p className="mt-1 text-xs text-stone-500">
                Monthly revenue performance
              </p>
            </div>

            <div className="hidden rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 sm:block">
              <p className="text-[9px] uppercase tracking-wider text-stone-400">
                Period
              </p>

              <p className="mt-0.5 text-xs font-medium text-stone-700">
                Jan - Dec
              </p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <LineChart
              data={formattedMonthlySales}
              margin={{
                top: 10,
                right: 15,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid
                stroke="#e7e5e4"
                strokeDasharray="4 4"
                vertical={false}
              />

              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#78716c",
                  fontSize: 10,
                }}
                dy={8}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#78716c",
                  fontSize: 10,
                }}
                dx={-5}
                tickFormatter={(value) =>
                  value >= 1000 ? `₹${(value / 1000).toFixed(0)}k` : `₹${value}`
                }
              />

              <Tooltip
                cursor={{
                  stroke: "#a8a29e",
                  strokeWidth: 1,
                  strokeDasharray: "4 4",
                }}
                contentStyle={{
                  backgroundColor: "#faf9f6",
                  border: "1px solid #e7e5e4",
                  borderRadius: "12px",
                  padding: "10px 14px",
                  boxShadow: "0 8px 25px rgba(28,25,23,0.08)",
                }}
                labelStyle={{
                  color: "#78716c",
                  fontSize: "11px",
                  marginBottom: "4px",
                }}
                itemStyle={{
                  color: "#1c1917",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
                formatter={(value) => [
                  `₹${Number(value).toLocaleString("en-IN")}`,
                  "Revenue",
                ]}
              />

              <Line
                type="monotone"
                dataKey="Revenue"
                stroke="#1c1917"
                strokeWidth={2.5}
                dot={{
                  r: 3,
                  fill: "#faf9f6",
                  stroke: "#1c1917",
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 6,
                  fill: "#1c1917",
                  stroke: "#faf9f6",
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-[#faf9f6] shadow-sm">
          <div className="border-b border-stone-200 bg-stone-50/50 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-900 text-white">
                <FaExclamationTriangle size={12} />
              </div>

              <div className="flex-1">
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-stone-400">
                  Inventory Alert
                </p>

                <h2 className="text-lg font-semibold text-stone-900">
                  Low Stock
                </h2>
              </div>

              <button
                type="button"
                onClick={() => navigate("/admin/inventory")}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-stone-500 transition hover:bg-stone-100 hover:text-stone-900"
              >
                View
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-stone-200 bg-stone-50/70 text-stone-400">
                <tr>
                  <th className="px-5 py-3 font-medium">Medicine</th>

                  <th className="px-5 py-3 text-center font-medium">Current</th>

                  <th className="px-5 py-3 text-center font-medium">Reorder</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-stone-100">
                {dashboard.lowStockMedicines?.length > 0 ? (
                  dashboard.lowStockMedicines.map((med) => (
                    <tr key={med._id} className="transition hover:bg-stone-50">
                      <td className="px-5 py-3.5 font-medium text-stone-800">
                        {med.medicineName}
                      </td>

                      <td className="px-5 py-3.5 text-center">
                        <span className="rounded-full bg-stone-900 px-2.5 py-1 text-[10px] font-semibold text-white">
                          {med.stockQuantity}
                        </span>
                      </td>

                      <td className="px-5 py-3.5 text-center text-stone-500">
                        {med.reorderLevel}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-5 py-8 text-center text-sm font-medium text-stone-500"
                    >
                      All stock levels are healthy.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-[#faf9f6] shadow-sm">
          <div className="border-b border-stone-200 bg-stone-50/50 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-900 text-white">
                <FaExclamationTriangle size={12} />
              </div>

              <div className="flex-1">
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-stone-400">
                  Inventory Alert
                </p>

                <h2 className="text-lg font-semibold text-stone-900">
                  Expired Medicines
                </h2>
              </div>

              <button
                type="button"
                onClick={() => navigate("/admin/inventory")}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-stone-500 transition hover:bg-stone-100 hover:text-stone-900"
              >
                View
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-stone-200 bg-stone-50/70 text-stone-400">
                <tr>
                  <th className="px-5 py-3 font-medium">Medicine</th>

                  <th className="px-5 py-3 text-center font-medium">Company</th>

                  <th className="px-5 py-3 text-center font-medium">
                    Expiry Date
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-stone-100">
                {dashboard.expiredMedicines?.length > 0 ? (
                  dashboard.expiredMedicines.map((med) => (
                    <tr key={med._id} className="transition hover:bg-stone-50">
                      <td className="px-5 py-3.5 font-medium text-stone-800">
                        {med.medicineName}
                      </td>

                      <td className="px-5 py-3.5 text-center">
                        <span className="rounded-full bg-stone-900 px-2.5 py-1 text-[10px] font-semibold text-white">
                          {med.company}
                        </span>
                      </td>

                      <td className="px-5 py-3.5 text-center text-stone-500">
                        {med.expiryDate}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-5 py-8 text-center text-sm font-medium text-stone-500"
                    >
                      No expired medicine found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-[#faf9f6] shadow-sm">
          <div className="border-b border-stone-200 bg-stone-50/50 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-900 text-white">
                <FaExclamationTriangle size={12} />
              </div>

              <div className="flex-1">
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-stone-400">
                  Inventory Alert
                </p>

                <h2 className="text-lg font-semibold text-stone-900">
                  Expiring Medicinces
                </h2>
              </div>

              <button
                type="button"
                onClick={() => navigate("/admin/inventory")}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-stone-500 transition hover:bg-stone-100 hover:text-stone-900"
              >
                View
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-stone-200 bg-stone-50/70 text-stone-400">
                <tr>
                  <th className="px-5 py-3 font-medium">Medicine</th>

                  <th className="px-5 py-3 text-center font-medium">Compnay</th>

                  <th className="px-5 py-3 text-center font-medium">
                    expiryDate
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-stone-100">
                {dashboard.expiringMedicines?.length > 0 ? (
                  dashboard.expiringMedicines.map((med) => (
                    <tr key={med._id} className="transition hover:bg-stone-50">
                      <td className="px-5 py-3.5 font-medium text-stone-800">
                        {med.medicineName}
                      </td>

                      <td className="px-5 py-3.5 text-center">
                        <span className="rounded-full bg-stone-900 px-2.5 py-1 text-[10px] font-semibold text-white">
                          {med.company}
                        </span>
                      </td>

                      <td className="px-5 py-3.5 text-center text-stone-500">
                        {med.expiryDate}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-5 py-8 text-center text-sm font-medium text-stone-500"
                    >
                      All stock levels are healthy.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
