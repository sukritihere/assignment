"use client";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { toggleSidebar, setCollapsed } from "@/store/slices/sidebarSlice";
import {
  LayoutDashboard,
  Users,
  Package,
  Scale,
  FileText,
  FileEdit,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Table,
} from "lucide-react";

type SidebarProps = {
  activeView: "table" | "calendar";
  setActiveView: (view: "table" | "calendar") => void;
};

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Users, label: "Accounts", href: "/accounts" },
  { icon: Package, label: "Batches", href: "/batches" },
  { icon: Scale, label: "Resolution", href: "/resolution" },
  { icon: FileText, label: "Assessments", href: "/assessments" },
  { icon: FileEdit, label: "Appeal Letter", href: "/appeal-letter" },
  { icon: BarChart3, label: "Summary", href: "/summary" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export default function Sidebar({ activeView, setActiveView }: SidebarProps) {
  const isCollapsed = useSelector(
    (state: RootState) => state.sidebar.isCollapsed
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const handleResize = () => {
      dispatch(setCollapsed(window.innerWidth < 768));
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  return (
    <div
      className={`sidebar-bg text-white transition-all duration-300 flex flex-col relative h-full rounded-xl ${
        isCollapsed ? "w-16" : "w-60"
      }`}
    >
      <button
        onClick={() => dispatch(toggleSidebar())}
        className="absolute -right-3 top-6 w-6 h-6 bg-white border border-gray-300 rounded-full flex items-center justify-center cursor-pointer shadow-sm hover:bg-gray-50 z-10"
      >
        {isCollapsed ? (
          <ChevronRight size={25} className="text-[#3FC3AC]" />
        ) : (
          <ChevronLeft size={25} className="text-[#3FC3AC]" />
        )}
      </button>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {sidebarItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="flex items-center py-3 px-3 text-sm font-semibold transition-colors text-white hover:text-white hover:bg-[#497092] rounded-lg"
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span className="ml-3">{item.label}</span>}
              </a>
            </li>
          ))}
          <li>
            <button
              onClick={() => setActiveView("table")}
              className={`flex items-center w-full py-3 px-3 text-sm font-semibold rounded-lg transition-colors ${
                activeView === "table"
                  ? "bg-[#497092] text-white"
                  : " hover:text-white hover:bg-[#497092]"
              }`}
            >
              <Table className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="ml-3">Table View</span>}
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveView("calendar")}
              className={`flex items-center w-full py-3 px-3 text-sm font-semibold rounded-lg transition-colors ${
                activeView === "calendar"
                  ? "bg-[#497092] text-white"
                  : " hover:text-white hover:bg-[#497092]"
              }`}
            >
              <CalendarIcon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="ml-3">Calendar View</span>}
            </button>
          </li>
        </ul>
      </nav>
      <div className="p-3 border-t border-gray-600">
        <button className="flex items-center w-full py-3 px-3 text-sm text-white btn-teal hover:bg-opacity-90 rounded-lg transition-colors">
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </div>
  );
}
