"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import AppealsTable from "@/components/AppealsTable";
import Calendar from "@/components/Calendar";

export default function Home() {
  const [activeView, setActiveView] = useState<"table" | "calendar">("table");

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100">
      <header className="px-1 md:px-6 pt-1 md:pt-4">
        <Header />
      </header>

      <div className="flex h-screen px-2 md:px-6 py-2 md:py-4">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />

        <main className="flex-1 overflow-auto px-6 py-4">
          <div className="p-1 md:p-6">
            {activeView === "table" ? <AppealsTable /> : <Calendar />}
          </div>
        </main>
      </div>
    </div>
  );
}
