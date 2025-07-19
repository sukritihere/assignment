"use client";

import { Search, Bell, Grid3X3, ChevronDown } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 md:px-6 flex flex-wrap items-center justify-between gap-4 rounded-md">
      <div className="flex items-center min-w-[40px]">
        <div className="w-[90px] sm:w-[140px] md:w-[160px] lg:w-[180px]">
          <img
            src="/AppealsLogo.png"
            alt="Company Logo"
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-end gap-4 flex-1">
        <div className="hidden lg:flex items-center space-x-2">
          <span className="text-sm text-gray-600 font-medium">
            Client Workspace:
          </span>
          <div className="flex items-center space-x-1">
            <img
              src="/logo.png"
              alt="G&W Logo"
              className="w-9 h-9 rounded-full object-cover"
            />
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>
        </div>
        <div className="relative w-full max-w-[200px] sm:max-w-[280px] md:max-w-[320px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
          />
        </div>
        <div className="hidden lg:flex items-center space-x-3">
          <img
            src="/logo.png"
            alt="User Logo"
            className="w-9 h-9 rounded-full object-cover"
          />
          <div className="w-8 h-8 bg-[#69ABEF] rounded-full flex items-center justify-center text-white font-bold text-sm">
            AK
          </div>
        </div>
        <Bell className="w-5 h-5 text-[#2C4E6C] cursor-pointer hover:text-gray-700 hidden sm:inline" />
        <Grid3X3 className="w-5 h-5 text-[#2C4E6C] cursor-pointer hover:text-gray-700 hidden lg:inline" />
      </div>
    </header>
  );
}
