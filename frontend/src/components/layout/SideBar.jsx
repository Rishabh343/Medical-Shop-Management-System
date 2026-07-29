import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaPills,
  FaTruck,
  FaWarehouse,
  FaUsers,
  FaFileInvoiceDollar,
  FaChartBar,
  FaUserShield,
  FaSignOutAlt,
} from "react-icons/fa";

export default function SideBar() {
  const role = localStorage.getItem("role")?.toLowerCase();

  const adminMenu = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <FaTachometerAlt />,
    },
    {
      name: "Medicines",
      path: "/admin/medicine",
      icon: <FaPills />,
    },
    {
      name: "Suppliers",
      path: "/admin/suppliers",
      icon: <FaTruck />,
    },
    {
      name: "Inventory",
      path: "/admin/inventory",
      icon: <FaWarehouse />,
    },
    {
      name: "Customers",
      path: "/admin/customers",
      icon: <FaUsers />,
    },
    {
      name: "Billing",
      path: "/admin/billing",
      icon: <FaFileInvoiceDollar />,
    },
    {
      name: "Reports",
      path: "/admin/reports",
      icon: <FaChartBar />,
    },
    {
      name: "User Management",
      path: "/admin/user",
      icon: <FaUserShield />,
    },
  ];

  const pharmacistMenu = [
    {
      name: "Dashboard",
      path: "/pharmasist/dashboard",
      icon: <FaTachometerAlt />,
    },
    {
      name: "Medicines",
      path: "/pharmacist/medicine",
      icon: <FaPills />,
    },
    {
      name: "Inventory",
      path: "/pharmacist/inventory",
      icon: <FaWarehouse />,
    },
    {
      name: "Customers",
      path: "/pharmacist/customers",
      icon: <FaUsers />,
    },
    {
      name: "Billing",
      path: "/pharmacist/billing",
      icon: <FaFileInvoiceDollar />,
    },
    {
      name: "Reports",
      path: "/pharmacist/reports",
      icon: <FaChartBar />,
    },
  ];

  const menu = role === "admin" ? adminMenu : pharmacistMenu;

  return (
    <div className="h-full flex flex-col bg-slate-900 text-white">
      <div className="p-5 border-b border-slate-700">
        <h1 className="text-2xl font-bold">MediCare</h1>
        <p className="text-sm text-gray-400 capitalize">{role}</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "hover:bg-slate-800 text-gray-300"
              }`
            }
          >
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
          className="w-full flex items-center gap-3 bg-red-600 hover:bg-red-700 rounded-lg px-4 py-3"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </div>
  );
}
