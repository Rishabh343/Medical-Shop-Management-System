import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  ArrowLeft,
  Mail,
  LockKeyhole,
  ShieldCheck,
  Package,
} from "lucide-react";

import toast from "react-hot-toast";
import { UserContext } from "../context/UserContext";

export default function Login() {
  const navigate = useNavigate();

  const { loginUser, forgotPassword, loading } = useContext(UserContext);

  const [view, setView] = useState("login");

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [resetEmail, setResetEmail] = useState("");

  const handleChange = (e) => {
    setLoginData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await loginUser(loginData);

      toast.success("Welcome back!");

      if (response.role === "Admin") {
        navigate("/admin/dashboard");
      } else if (response.role === "Pharmacist") {
        navigate("/pharmacist/medicine");
      } else {
        navigate("/");
      }

      setLoginData({
        email: "",
        password: "",
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Invalid credentials. Please try again.",
      );
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();

    if (!resetEmail) {
      return toast.error("Please enter your email.");
    }

    try {
      await forgotPassword(resetEmail);

      toast.success("Password reset link sent to your email.");

      setView("login");
      setResetEmail("");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send reset link.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#eeeae3] flex items-center justify-center px-4 py-6">
      {/* Main Container */}

      <div className="w-full max-w-5xl min-h-[600px] overflow-hidden rounded-[24px] bg-[#faf9f6] shadow-2xl shadow-stone-400/20 grid lg:grid-cols-2">
        {/* ================= LEFT SIDE ================= */}

        <div className="relative hidden overflow-hidden lg:flex">
          {/* Background */}

          <div className="absolute inset-0 bg-stone-900" />

          {/* Decorative Background */}

          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/5" />

          <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-white/5" />

          <div className="absolute right-10 top-20 h-40 w-40 rounded-full border border-white/10" />

          {/* Content */}

          <div className="relative z-10 flex w-full flex-col justify-between p-10 text-white">
            {/* Logo */}

            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-stone-900">
                  <Package size={22} />
                </div>

                <div>
                  <h1 className="text-2xl font-semibold tracking-tight">
                    MediStock
                  </h1>

                  <p className="text-xs text-white/50">Inventory Management</p>
                </div>
              </div>
            </div>

            {/* Middle Visual */}

            <div className="relative flex justify-center py-10">
              <div className="flex h-52 w-52 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
                <div className="flex h-36 w-36 items-center justify-center rounded-full border border-white/10 bg-white/[0.05]">
                  <Package
                    size={70}
                    strokeWidth={1.2}
                    className="text-white/80"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Content */}

            <div className="max-w-md">
              <p className="mb-3 text-xs uppercase tracking-[0.25em] text-white/50">
                Pharmacy Operations
              </p>

              <h2 className="text-3xl font-medium leading-tight xl:text-4xl">
                Manage your inventory
                <br />
                with confidence.
              </h2>

              <p className="mt-5 text-sm leading-6 text-white/60">
                Keep medicines organized, monitor stock levels, manage purchases
                and maintain accurate inventory records from one centralized
                platform.
              </p>

              {/* Features */}

              <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/60">
                <span>Stock Management</span>

                <span className="h-1 w-1 rounded-full bg-white/30" />

                <span>Medicine Tracking</span>

                <span className="h-1 w-1 rounded-full bg-white/30" />

                <span>Secure Access</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT SIDE ================= */}

        <div className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-12">
          <div className="w-full max-w-sm">
            {/* Mobile Logo */}

            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900 text-white">
                <Package size={20} />
              </div>

              <div>
                <h1 className="text-xl font-semibold text-stone-900">
                  MediStock
                </h1>

                <p className="text-xs text-stone-400">Inventory Management</p>
              </div>
            </div>

            {/* ================= HEADER ================= */}

            <div className="mb-8">
              <div className="mb-3 flex items-center gap-2">
                {view === "login" ? (
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-stone-100 text-stone-700">
                    <ShieldCheck size={19} />
                  </div>
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-stone-100 text-stone-700">
                    <LockKeyhole size={18} />
                  </div>
                )}

                <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-400">
                  {view === "login" ? "Secure Access" : "Account Recovery"}
                </p>
              </div>

              <h2 className="text-3xl font-semibold tracking-tight text-stone-900">
                {view === "login" ? "Welcome back" : "Reset your password"}
              </h2>

              <p className="mt-2 text-sm leading-6 text-stone-500">
                {view === "login"
                  ? "Sign in to manage your pharmacy inventory and operations."
                  : "Enter your registered email to receive a password reset link."}
              </p>
            </div>

            {/* ================= LOGIN ================= */}

            {view === "login" ? (
              <form onSubmit={handleLoginSubmit} className="space-y-5">
                {/* Email */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-stone-700">
                    Email address
                  </label>

                  <div className="relative">
                    <Mail
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
                    />

                    <input
                      type="email"
                      name="email"
                      value={loginData.email}
                      onChange={handleChange}
                      placeholder="name@company.com"
                      required
                      className="
                        w-full
                        rounded-xl
                        border
                        border-stone-300
                        bg-transparent
                        py-3
                        pl-11
                        pr-4
                        text-sm
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

                {/* Password */}

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-medium text-stone-700">
                      Password
                    </label>

                    <button
                      type="button"
                      onClick={() => setView("forgot")}
                      className="text-sm text-stone-500 transition hover:text-stone-900"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <div className="relative">
                    <LockKeyhole
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
                    />

                    <input
                      type="password"
                      name="password"
                      value={loginData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                      className="
                        w-full
                        rounded-xl
                        border
                        border-stone-300
                        bg-transparent
                        py-3
                        pl-11
                        pr-4
                        text-sm
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

                {/* Login */}

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    mt-2
                    w-full
                    rounded-xl
                    bg-stone-900
                    py-3
                    text-sm
                    font-medium
                    text-white
                    transition-all
                    duration-300
                    hover:bg-stone-800
                    hover:shadow-lg
                    hover:shadow-stone-900/10
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>

                {/* Signup */}

                <div className="flex items-center gap-4 py-2">
                  <div className="h-px flex-1 bg-stone-200" />

                  <span className="text-[10px] uppercase tracking-widest text-stone-400">
                    New here?
                  </span>

                  <div className="h-px flex-1 bg-stone-200" />
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/signup")}
                  className="
                    w-full
                    rounded-xl
                    border
                    border-stone-300
                    py-3
                    text-sm
                    font-medium
                    text-stone-800
                    transition
                    hover:bg-stone-100
                  "
                >
                  Create an account
                </button>
              </form>
            ) : (
              /* ================= FORGOT PASSWORD ================= */

              <form onSubmit={handleForgotSubmit} className="space-y-5">
                {/* Email */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-stone-700">
                    Email address
                  </label>

                  <div className="relative">
                    <Mail
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
                    />

                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="name@company.com"
                      required
                      className="
                        w-full
                        rounded-xl
                        border
                        border-stone-300
                        bg-transparent
                        py-3
                        pl-11
                        pr-4
                        text-sm
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

                {/* Reset */}

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    w-full
                    rounded-xl
                    bg-stone-900
                    py-3
                    text-sm
                    font-medium
                    text-white
                    transition-all
                    hover:bg-stone-800
                    hover:shadow-lg
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {loading ? "Sending link..." : "Send Reset Link"}
                </button>

                {/* Back */}

                <button
                  type="button"
                  onClick={() => setView("login")}
                  className="
                    mx-auto
                    flex
                    items-center
                    gap-2
                    text-sm
                    font-medium
                    text-stone-500
                    transition
                    hover:text-stone-900
                  "
                >
                  <ArrowLeft size={16} />
                  Back to sign in
                </button>
              </form>
            )}

            {/* Footer */}

            <div className="mt-8 border-t border-stone-200 pt-5">
              <div className="flex items-center justify-center gap-2 text-xs text-stone-400">
                <ShieldCheck size={14} />

                <span>Secure pharmacy inventory management</span>
              </div>

              <p className="mt-2 text-center text-[11px] text-stone-400">
                © {new Date().getFullYear()} MediStock. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
