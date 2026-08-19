import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaPills,
  FaTruck,
  FaUser,
  FaWarehouse,
  FaUsers,
  FaFileInvoiceDollar,
  FaChartBar,
  FaUserShield,
  FaSignOutAlt,
  // FaChevronDown,
  FaTachometerAlt,
  FaBars,
  FaTimes,
  FaChevronDown,
} from "react-icons/fa";
import { UserContext } from "../context/UserContext";

export default function NavBar() {
  const { logoutUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const role = localStorage.getItem("role")?.toLowerCase();

  const adminMenu = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <FaTachometerAlt /> },
    { name: "Medicines", path: "/admin/medicine", icon: <FaPills /> },
    { name: "Suppliers", path: "/admin/suppliers", icon: <FaTruck /> },
    { name: "Inventory", path: "/admin/inventory", icon: <FaWarehouse /> },
    { name: "Customers", path: "/admin/customers", icon: <FaUsers /> },
    { name: "Billing", path: "/admin/billing", icon: <FaFileInvoiceDollar /> },
    { name: "Reports", path: "/admin/reports", icon: <FaChartBar /> },
    { name: "Users", path: "/admin/user", icon: <FaUserShield /> },
  ];

  const pharmacistMenu = [
    { name: "Medicines", path: "/pharmacist/medicine", icon: <FaPills /> },
    { name: "Customers", path: "/pharmacist/customers", icon: <FaUsers /> },
    {
      name: "Billing",
      path: "/pharmacist/billing",
      icon: <FaFileInvoiceDollar />,
    },
  ];

  const menu = role === "admin" ? adminMenu : pharmacistMenu;

  const handleLogout = () => {
    logoutUser();
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-stone-200 bg-[#faf9f6]/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex shrink-0 items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-900 text-white">
            <FaPills size={15} />
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-tight text-stone-900">
              MediStock
            </h1>
            <p className="text-[9px] uppercase tracking-[0.18em] text-stone-400">
              Pharmacy Management
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="flex h-9 items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 text-sm font-medium text-stone-700 shadow-sm transition hover:border-stone-300 hover:bg-stone-50 sm:px-4"
            >
              <FaBars size={13} />

              <span className="hidden sm:inline">Menu</span>

              <FaChevronDown
                size={10}
                className={`transition-transform ${
                  menuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setMenuOpen(false)}
                />

                <div className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-stone-200 bg-[#faf9f6] p-2 shadow-xl">
                  <div className="border-b border-stone-200 px-3 py-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                      Navigation
                    </p>
                  </div>

                  <div className="mt-1 space-y-1">
                    {menu.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setMenuOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                            isActive
                              ? "bg-stone-900 text-white"
                              : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <span
                              className={
                                isActive ? "text-white" : "text-stone-400"
                              }
                            >
                              {React.cloneElement(item.icon, { size: 14 })}
                            </span>
                            <span>{item.name}</span>
                          </>
                        )}
                      </NavLink>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileMenuOpen((prev) => !prev)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200 bg-[#faf9f6] shadow-sm transition-all duration-200 hover:border-stone-300 hover:bg-white hover:shadow-md"
              aria-label="Profile menu"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-stone-900 text-white">
                <FaUser size={11} />
              </div>
            </button>

            {profileMenuOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-stone-200 bg-[#faf9f6] shadow-[0_12px_35px_rgba(28,25,23,0.10)]">
                {/* Profile Header */}
                <div className="border-b border-stone-200 px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-900 text-white">
                      <FaUser size={12} />
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-stone-900">
                        My Account
                      </p>

                      <p className="mt-0.5 text-[10px] text-stone-400">
                        Manage your profile
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-1.5">
                  {/* Update Profile */}
                  <button
                    type="button"
                    onClick={() => {
                      setProfileMenuOpen(false);
                      navigate("/update-profile");
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-medium text-stone-700 transition hover:bg-stone-100 hover:text-stone-900"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-stone-100 text-stone-500">
                      <FaUser size={11} />
                    </div>
                    Update Profile
                  </button>

                  {/* Logout */}
                  <button
                    type="button"
                    onClick={() => {
                      setProfileMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-medium text-red-600 transition hover:bg-red-50"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50">
                      <FaSignOutAlt size={11} />
                    </div>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
