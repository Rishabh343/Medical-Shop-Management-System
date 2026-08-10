import React, { useContext, useState } from "react";

import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import {
  Package,
  UserPlus,
  User,
  Mail,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

export default function Signup() {
  const navigate = useNavigate();

  const { registerUser, loading } = useContext(UserContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Pharmacist",
    age: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,

      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await registerUser(formData);

      alert(response.message);

      setFormData({
        name: "",
        email: "",
        role: "Pharmacist",
        age: "",
        phone: "",
        password: "",
      });

      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#eeeae3] flex items-center justify-center px-4 py-5">
      <div className="w-full max-w-4xl overflow-hidden rounded-[22px] bg-[#faf9f6] shadow-2xl shadow-stone-400/20 grid lg:grid-cols-2">
        {/* ================= LEFT SIDE ================= */}

        <div className="relative hidden overflow-hidden bg-stone-900 lg:flex">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5" />

          <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-white/5" />

          <div className="relative z-10 flex w-full flex-col justify-between p-8 text-white">
            {/* Logo */}

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-stone-900">
                <Package size={20} />
              </div>

              <div>
                <h1 className="text-xl font-semibold">MediStock</h1>

                <p className="text-[10px] text-white/50">
                  Inventory Management
                </p>
              </div>
            </div>

            {/* Illustration */}

            <div className="flex justify-center">
              <div className="flex h-40 w-40 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
                <div className="flex h-28 w-28 items-center justify-center rounded-full border border-white/10 bg-white/[0.05]">
                  <Package
                    size={52}
                    strokeWidth={1.2}
                    className="text-white/80"
                  />
                </div>
              </div>
            </div>

            {/* Content */}

            <div className="max-w-sm">
              <p className="mb-2 text-[10px] uppercase tracking-[0.25em] text-white/50">
                Get started
              </p>

              <h2 className="text-2xl font-medium leading-tight">
                Simplify your
                <br />
                pharmacy operations.
              </h2>

              <p className="mt-3 text-xs leading-5 text-white/60">
                Manage medicines, inventory, stock levels and pharmacy
                operations from one centralized platform.
              </p>

              <div className="mt-4 flex flex-wrap gap-x-3 text-[10px] text-white/50">
                <span>Inventory Control</span>
                <span>•</span>
                <span>Medicine Tracking</span>
                <span>•</span>
                <span>Secure Access</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT SIDE ================= */}

        <div className="flex items-center justify-center px-6 py-7 sm:px-8">
          <div className="w-full max-w-sm">
            {/* Mobile Logo */}

            <div className="mb-5 flex items-center gap-2 lg:hidden">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-stone-900 text-white">
                <Package size={18} />
              </div>

              <div>
                <h1 className="text-lg font-semibold text-stone-900">
                  MediStock
                </h1>

                <p className="text-[10px] text-stone-400">
                  Inventory Management
                </p>
              </div>
            </div>

            {/* Header */}

            <div className="mb-5">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-100 text-stone-700">
                  <UserPlus size={16} />
                </div>

                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-stone-400">
                  New Account
                </p>
              </div>

              <h2 className="text-2xl font-semibold tracking-tight text-stone-900">
                Create Account
              </h2>

              <p className="mt-1 text-xs leading-5 text-stone-500">
                Register a new user to access MediStock.
              </p>
            </div>

            {/* ================= FORM ================= */}

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Name */}

              <div>
                <label className="mb-1 block text-xs font-medium text-stone-700">
                  Full name
                </label>

                <div className="relative">
                  <User
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
                  />

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    required
                    className="
                    w-full
                    rounded-lg
                    border
                    border-stone-300
                    bg-transparent
                    py-2.5
                    pl-10
                    pr-3
                    text-xs
                    text-stone-900
                    outline-none
                    transition
                    placeholder:text-stone-400
                    focus:border-stone-900
                    focus:ring-1
                    focus:ring-stone-900
                  "
                  />
                </div>
              </div>

              {/* Email */}

              <div>
                <label className="mb-1 block text-xs font-medium text-stone-700">
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@company.com"
                    required
                    className="
                    w-full
                    rounded-lg
                    border
                    border-stone-300
                    bg-transparent
                    py-2.5
                    pl-10
                    pr-3
                    text-xs
                    text-stone-900
                    outline-none
                    transition
                    placeholder:text-stone-400
                    focus:border-stone-900
                    focus:ring-1
                    focus:ring-stone-900
                  "
                  />
                </div>
              </div>

              {/* Age + Phone */}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-stone-700">
                    Age
                  </label>

                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="Age"
                    required
                    className="
                    w-full
                    rounded-lg
                    border
                    border-stone-300
                    bg-transparent
                    px-3
                    py-2.5
                    text-xs
                    outline-none
                    focus:border-stone-900
                    focus:ring-1
                    focus:ring-stone-900
                  "
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-stone-700">
                    Phone
                  </label>

                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone"
                    required
                    className="
                    w-full
                    rounded-lg
                    border
                    border-stone-300
                    bg-transparent
                    px-3
                    py-2.5
                    text-xs
                    outline-none
                    focus:border-stone-900
                    focus:ring-1
                    focus:ring-stone-900
                  "
                  />
                </div>
              </div>

              {/* Role */}

              <div>
                <label className="mb-1 block text-xs font-medium text-stone-700">
                  Account role
                </label>

                <div className="relative">
                  <ShieldCheck
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
                  />

                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="
                    w-full
                    appearance-none
                    rounded-lg
                    border
                    border-stone-300
                    bg-transparent
                    py-2.5
                    pl-10
                    pr-3
                    text-xs
                    outline-none
                    focus:border-stone-900
                    focus:ring-1
                    focus:ring-stone-900
                  "
                  >
                    <option value="Pharmacist">Pharmacist</option>

                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>

              {/* Password */}

              <div>
                <label className="mb-1 block text-xs font-medium text-stone-700">
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
                  />

                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    required
                    className="
                    w-full
                    rounded-lg
                    border
                    border-stone-300
                    bg-transparent
                    py-2.5
                    pl-10
                    pr-3
                    text-xs
                    outline-none
                    focus:border-stone-900
                    focus:ring-1
                    focus:ring-stone-900
                  "
                  />
                </div>

                <p className="mt-1 text-[10px] leading-4 text-stone-400">
                  8+ characters, uppercase, number and special character.
                </p>
              </div>

              {/* Register */}

              <button
                type="submit"
                disabled={loading}
                className="
                mt-1
                w-full
                rounded-lg
                bg-stone-900
                py-2.5
                text-xs
                font-medium
                text-white
                transition
                hover:bg-stone-800
                hover:shadow-md
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
              >
                {loading ? "Creating account..." : "Create account"}
              </button>

              {/* Login */}

              <div className="pt-2 text-center">
                <p className="text-xs text-stone-500">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="font-medium text-stone-900 hover:underline"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </form>

            {/* Footer */}

            <div className="mt-4 flex items-center justify-center gap-1.5 border-t border-stone-200 pt-3 text-[10px] text-stone-400">
              <ShieldCheck size={12} />
              <span>Secure pharmacy inventory management</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
