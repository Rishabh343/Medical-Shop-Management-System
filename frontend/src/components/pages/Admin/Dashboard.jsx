import React, { useContext, useEffect } from "react";
import {
  FaPills,
  FaUsers,
  FaWarehouse,
  FaFileInvoiceDollar,
  FaTruck,
  FaExclamationTriangle,
  FaRupeeSign,
} from "react-icons/fa";
import {
  ResponsiveContainer,
  LineChart,
  Line,
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

export default function Dashboard() {
  const { dashboard, loading, getDashboard } = useContext(DashboardContext);

  useEffect(() => {
    getDashboard();
  }, []);

  if (loading || !dashboard) {
    return <Loader />;
  }

  const cards = [
    {
      title: "Total Medicines",
      value: dashboard.totalMedicines,
      icon: <FaPills />,
      color: "bg-blue-500",
    },
    {
      title: "Total Suppliers",
      value: dashboard.totalSuppliers,
      icon: <FaTruck />,
      color: "bg-purple-500",
    },
    {
      title: "Total Customers",
      value: dashboard.totalCustomers,
      icon: <FaUsers />,
      color: "bg-green-500",
    },
    {
      title: "Today's Sales",
      value: `₹${dashboard.todaySales}`,
      icon: <FaFileInvoiceDollar />,
      color: "bg-red-500",
    },
    {
      title: "Monthly Revenue",
      value: `₹${dashboard.monthlyRevenue}`,
      icon: <FaRupeeSign />,
      color: "bg-indigo-500",
    },
    {
      title: "Low Stock",
      value: dashboard.lowStockMedicines,
      icon: <FaWarehouse />,
      color: "bg-yellow-500",
    },
    {
      title: "Expired Medicines",
      value: dashboard.expiredMedicines,
      icon: <FaExclamationTriangle />,
      color: "bg-pink-500",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <p className="text-gray-500">Pharmacy Management Overview</p>
      </div>

      {/* Dashboard Cards */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow p-5 flex justify-between items-center"
          >
            <div>
              <p className="text-gray-500">{card.title}</p>

              <h2 className="text-3xl font-bold mt-2">{card.value}</h2>
            </div>

            <div
              className={`${card.color} text-white text-3xl p-4 rounded-full`}
            >
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Monthly Sales */}

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-5">Monthly Sales</h2>

        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={dashboard.monthlySales}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="_id.month" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="totalSales"
              stroke="#2563eb"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Charts */}

      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"> */}
      {/* Category Wise Sales */}

      {/* <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-5">Category-wise Sales</h2>

          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={dashboard.categoryWiseSales}
                dataKey="totalSales"
                nameKey="_id"
                outerRadius={110}
                label
              >
                {dashboard.categoryWiseSales?.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={
                      [
                        "#3B82F6",
                        "#22C55E",
                        "#F59E0B",
                        "#EF4444",
                        "#8B5CF6",
                        "#06B6D4",
                      ][index % 6]
                    }
                  />
                ))}
              </Pie>

              <Tooltip />

              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div> */}

      {/* Top Selling Medicines */}

      {/* <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-5">Top Selling Medicines</h2>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={dashboard.topSellingMedicines}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="medicineName" />

              <YAxis />

              <Tooltip />

              <Bar dataKey="totalQuantity" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div> */}

      {/* Statistics */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-5">Inventory Alerts</h2>

          <div className="space-y-4">
            <div className="flex justify-between border-b pb-3">
              <span className="font-medium">Low Stock Medicines</span>

              <span className="text-yellow-600 font-bold">
                {dashboard.lowStockMedicines}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Expired Medicines</span>

              <span className="text-red-600 font-bold">
                {dashboard.expiredMedicines}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-5">Revenue</h2>

          <div className="space-y-4">
            <div className="flex justify-between border-b pb-3">
              <span className="font-medium">Today's Sales</span>

              <span className="text-green-600 font-bold">
                ₹{dashboard.todaySales}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Monthly Revenue</span>

              <span className="text-blue-600 font-bold">
                ₹{dashboard.monthlyRevenue}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
