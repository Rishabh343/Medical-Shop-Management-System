import React from "react";
import SideBar from "./SideBar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* 1. Sidebar - Fixed width on left */}
      <aside className="w-64 flex-shrink-0 bg-white border-r border-gray-200 hidden md:block">
        <SideBar />
      </aside>

      {/* 2. Main Area (Navbar + Page Content) */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
          {/* <Navbar /> */}
        </header>

        {/* Dynamic Page Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
