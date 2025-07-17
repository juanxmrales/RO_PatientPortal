"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminNavbar from "@/components/AdminNavbar";
import AdminSidebar from "@/components/AdminSidebar";
import PatientTable from "@/components/PatientTable";
import useAdminGuard from "@/hooks/useAdminGuard";
import type { Patient } from "@/types/patient";

export default function HospitalAdmin() {
  const [users, setUsers] = useState<Patient[]>([]);
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const [isResizing, setIsResizing] = useState(false);
  const [resizingColumn, setResizingColumn] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const { user, checking } = useAdminGuard();

  const handleLogout = () => {
    localStorage.removeItem("session");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const handleFilter = (column: string, value: string) => {
    setFilters((prev) => ({ ...prev, [column]: value }));
  };

  const clearFilter = (column: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[column];
      return newFilters;
    });
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/users", { cache: "no-store" });
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleMouseDown = useCallback(
    (column: string, e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsResizing(true);
      setResizingColumn(column);
      const startX = e.clientX;
      const startWidth = columnWidths[column];

      const handleMouseMove = (e: MouseEvent) => {
        const diff = e.clientX - startX;
        const newWidth = Math.max(80, startWidth + diff);
        setColumnWidths((prev) => ({ ...prev, [column]: newWidth }));
      };

      const handleMouseUp = () => {
        setIsResizing(false);
        setResizingColumn(null);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };

      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }, [columnWidths]);

  if (checking || !user) {
    return <div className="text-white p-4">Cargando...</div>;
  }

  const renderResizeHandle = (column: string) =>
  (
    <div
      className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-blue-500/50 transition-colors flex items-center justify-center group/handle"
      onMouseDown={(e) => handleMouseDown(column, e)}
      style={{ zIndex: 10 }}
    >
      <div className="w-0.5 h-4 bg-slate-500 group-hover/handle:bg-blue-400 transition-colors" />
    </div>
  );

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-white">
      <AdminNavbar user={user} onLogout={handleLogout} />
      <div className="flex flex-1">
        <AdminSidebar />
        <div className="flex-1 p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">👥 Usuarios del sistema</h2>
          </div>
          <div className="overflow-y-auto max-h-[calc(95vh-200px)] bg-slate-800 rounded-lg border border-slate-700 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
            <PatientTable
              patients={users}
              columnWidths={columnWidths}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              filters={filters}
              handleSort={handleSort}
              handleFilter={handleFilter}
              clearFilter={clearFilter}
              renderResizeHandle={renderResizeHandle}
            />
          </div>

          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-slate-400">1 - 19 de {users.length} items</div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="bg-blue-600 border-blue-600 text-white">
                1
              </Button>
              <Button variant="outline" size="sm" className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600">
                2
              </Button>
              <Button variant="outline" size="sm" className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
