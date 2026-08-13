import React from "react";
import {
  FaArrowRight,
  FaBoxOpen,
  FaShoppingCart,
  FaPills,
  FaUsers,
  FaChartLine,
  FaTruck,
   FaCheckCircle
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const features = [
    {
      icon: FaBoxOpen,
      title: "Inventory Management",
      text: "Track stock in real-time, manage batches, expiry and get low stock alerts instantly.",
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: FaShoppingCart,
      title: "Sales & Billing",
      text: "Generate professional invoices in seconds and manage sales seamlessly.",
      color: "bg-green-50 text-green-600",
    },
    {
      icon: FaTruck,
      title: "Purchase Management",
      text: "Manage purchases, suppliers, bills and keep your stock always updated.",
      color: "bg-purple-50 text-purple-600",
    },
    {
      icon: FaUsers,
      title: "Customer Management",
      text: "Maintain customer details, purchase history and build strong relationships.",
      color: "bg-orange-50 text-orange-600",
    },
    {
      icon: FaChartLine,
      title: "Reports & Analytics",
      text: "Get insightful reports on sales, profit, stock and grow your business smarter.",
      color: "bg-red-50 text-red-600",
    },
  ];

  const stats = [
    { number: "500+", label: "Pharmacies Trust Us" },
    { number: "50K+", label: "Medicines Managed" },
    { number: "100K+", label: "Bills Generated" },
    { number: "99%", label: "Customer Satisfaction" },
  ];

  return (
    <div className="min-h-screen bg-[#faf9f6] text-stone-900">
      <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-[#faf9f6]/95 backdrop-blur-md">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-6 lg:px-8">
          <div
            className="flex cursor-pointer items-center gap-3"
            onClick={() => scrollToSection("home")}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-stone-900 to-stone-700 text-white shadow-lg">
              <FaPills size={18} />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">
                Medi<span className="text-[#a0784f]">Stock</span>
              </h1>
              <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-stone-400">
                Pharmacy Management
              </p>
            </div>
          </div>

          <nav className="hidden items-center gap-9 md:flex">
            <button
              onClick={() => scrollToSection("home")}
              className="text-sm font-medium text-stone-900 transition hover:text-[#a0784f]"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("features")}
              className="text-sm font-medium text-stone-500 transition hover:text-stone-900"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="text-sm font-medium text-stone-500 transition hover:text-stone-900"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection("stats")}
              className="text-sm font-medium text-stone-500 transition hover:text-stone-900"
            >
              About Us
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-sm font-medium text-stone-500 transition hover:text-stone-900"
            >
              Contact
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/login")}
              className="hidden rounded-xl border border-stone-200 bg-white px-5 py-2.5 text-sm font-medium text-stone-700 transition hover:border-stone-300 hover:bg-stone-50 sm:block"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-stone-800 hover:shadow-md"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      <section id="home" className="relative overflow-hidden border-b border-stone-200 bg-[#faf9f6]">
        <div className="mx-auto max-w-7xl px-5 pb-20 pt-12 sm:px-8 sm:pb-2 sm:pt-4 lg:px-2 lg:pb-20 lg:pt-1">
          <div className="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10">
            <div className="relative z-10 max-w-xl">

              <h1 className="mt-5 font-serif text-5xl font-semibold leading-[0.98] tracking-[-0.04em] text-stone-900 sm:text-6xl lg:text-[68px] xl:text-[76px]">
                Smart Pharmacy
                <br />
                Management
                <br />
                for{" "}
                <span className="text-[#a0784f]">
                  Modern
                  <br />
                  Businesses
                </span>
              </h1>

              <p className="mt-7 max-w-lg text-base leading-7 text-stone-500 sm:text-lg sm:leading-8">
                MediStock helps you manage medicines, inventory, sales,
                purchases, customers and suppliers — all in one place.
                Save time, reduce errors and grow your pharmacy with
                smarter operations.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => navigate("/signup")}
                  className="inline-flex items-center gap-3 rounded-xl bg-stone-900 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-stone-800 hover:shadow-lg"
                >
                  Get Started Free
                  <span className="text-base">→</span>
                </button>

                <button
                  onClick={() => scrollToSection("features")}
                  className="inline-flex items-center gap-3 rounded-xl border border-stone-200 bg-white px-6 py-3.5 text-sm font-semibold text-stone-700 transition hover:border-stone-300 hover:bg-stone-50"
                >
                  Explore Features
                  <span className="text-stone-400">✦</span>
                </button>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-stone-400">
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Easy to use
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Secure & reliable
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Built for pharmacies
                </span>
              </div>
            </div>

            <div className="relative min-w-0 lg:pl-4">
              <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#eadbc8]/30 blur-3xl" />

              <div className="relative">
                <div className="relative overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-[0_30px_80px_rgba(28,25,23,0.13)]">
                  <div className="flex h-10 items-center gap-2 border-b border-stone-100 bg-[#fcfbf9] px-4">
                    <span className="h-2.5 w-2.5 rounded-full bg-stone-200" />
                    <span className="h-2.5 w-2.5 rounded-full bg-stone-200" />
                    <span className="h-2.5 w-2.5 rounded-full bg-stone-200" />
                    <div className="ml-3 h-5 w-32 rounded-md bg-stone-100" />
                  </div>
                  <img
                    src="/imgdashboard.png"
                    alt="MediStock Dashboard"
                    className="block h-auto w-full"
                  />
                </div>

                <div className="absolute -bottom-6 -left-5 hidden w-48 rounded-2xl border border-stone-200 bg-[#faf9f6]/95 p-4 shadow-xl backdrop-blur sm:block">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-medium uppercase tracking-wider text-stone-400">
                        Monthly Revenue
                      </p>
                      <p className="mt-1 text-lg font-semibold text-stone-900">
                        ₹12,792
                      </p>
                    </div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f0e4d5] text-[#9a744c]">
                      ₹
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-[10px] font-medium text-emerald-600">
                      ↑ 18.7%
                    </span>
                    <span className="text-[10px] text-stone-400">
                      from last month
                    </span>
                  </div>
                </div>

                <div className="absolute -right-4 -top-6 hidden w-44 rounded-2xl border border-stone-200 bg-white p-4 shadow-xl sm:block">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f0e4d5] text-[#9a744c]">
                      +
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-stone-400">
                        Inventory
                      </p>
                      <p className="mt-0.5 text-sm font-semibold text-stone-900">
                        5,468 Units
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-stone-100">
                    <div className="h-full w-[78%] rounded-full bg-[#b9946c]" />
                  </div>
                  <p className="mt-2 text-[9px] text-stone-400">
                    Stock levels looking healthy
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="border-t border-stone-100 bg-white px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a0784f]">
              Powerful Features
            </p>
            <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight md:text-4xl">
              Everything You Need to Run Your Pharmacy
            </h2>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group rounded-2xl border border-stone-200 bg-[#faf9f6] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-stone-300 hover:shadow-lg"
                >
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${feature.color} transition group-hover:bg-stone-900 group-hover:text-white`}
                  >
                    <Icon size={16} />
                  </div>
                  <h3 className="mt-5 font-serif text-lg font-semibold">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-stone-500">
                    {feature.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="stats" className="px-6 pb-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 rounded-3xl border border-[#e8ded0] bg-[#f5eee5] p-8 md:grid-cols-4 md:p-10">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`${
                index < stats.length - 1
                  ? "border-b border-[#ded2c3] pb-6 md:border-b-0 md:border-r md:pb-0"
                  : ""
              } ${index > 0 ? "md:pl-6" : ""}`}
            >
              <p className="font-serif text-3xl font-semibold">{stat.number}</p>
              <p className="mt-1 text-sm text-stone-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="border-t border-stone-100 bg-stone-900 px-6 py-20 text-white lg:px-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c7a986]">
            Get Started Today
          </p>
          <h2 className="mt-4 max-w-2xl font-serif text-4xl font-semibold leading-tight md:text-5xl">
            Ready to Transform Your Pharmacy Business?
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-6 text-stone-400">
            Simplify your pharmacy operations, improve inventory management and
            make smarter business decisions with MediStock.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => navigate("/signup")}
              className="flex items-center gap-3 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-stone-900 transition hover:bg-stone-100 hover:shadow-lg"
            >
              Start Your Free Trial
              <FaArrowRight size={13} />
            </button>
            <button
              onClick={() => scrollToSection("features")}
              className="flex items-center gap-3 rounded-xl border border-stone-700 px-6 py-3.5 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
            >
              Learn More
            </button>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-stone-500">
            <span className="flex items-center gap-2">
              <FaCheckCircle className="text-[#c7a986]" size={14} />
              No credit card required
            </span>
            <span className="flex items-center gap-2">
              <FaCheckCircle className="text-[#c7a986]" size={14} />
              14-day free trial
            </span>
            <span className="flex items-center gap-2">
              <FaCheckCircle className="text-[#c7a986]" size={14} />
              Cancel anytime
            </span>
          </div>
        </div>
      </section>

      <footer id="contact" className="bg-stone-900 px-6 pb-8 text-stone-400 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 border-t border-stone-800 pt-7 text-xs md:flex-row">
          <p>© 2026 MediStock. All rights reserved.</p>
          <div className="flex gap-6">
            <button
              onClick={() => scrollToSection("home")}
              className="transition hover:text-white"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("features")}
              className="transition hover:text-white"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="transition hover:text-white"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection("stats")}
              className="transition hover:text-white"
            >
              About
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}