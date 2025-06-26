"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Search, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Filter, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAdminGuard from "@/hooks/useAdminGuard";
import AdminNavbar from "@/components/AdminNavbar";
import AdminSidebar from "@/components/AdminSidebar";
import PatientTable from "@/components/PatientTable";


// Sample patient data
const patients = [
  {
    name: "Baez, Luis Alfredo",
    id: "772271",
    date: "19/06/2025",
    images: 576,
    priority: "Bajo",
    age: "20...",
    modality: "MR",
    identification: "790073835",
    organ: "HIP",
    birthDate: "14/11/1951",
    doctor: "Guffanti, Andrea Fanny",
    status: "Final",
  },
  {
    name: "Senno, Genaro",
    id: "917733",
    date: "19/06/2025",
    images: 322,
    priority: "Bajo",
    age: "20...",
    modality: "MR",
    identification: "790074019",
    organ: "KNEE",
    birthDate: "11/11/2008",
    doctor: "Morea Citale, Vanina",
    status: "Final",
  },
  {
    name: "Lenlo, Victoria Alejandra",
    id: "849868",
    date: "19/06/2025",
    images: 94,
    priority: "Bajo",
    age: "10...",
    modality: "MR",
    identification: "454",
    organ: "SHOULDER",
    birthDate: "04/12/1976",
    doctor: "Font, Martin",
    status: "Final",
  },
  {
    name: "Olondo, Adriana Elisabet",
    id: "844076",
    date: "19/06/2025",
    images: 17,
    priority: "Bajo",
    age: "50...",
    modality: "MR",
    identification: "444",
    organ: "LIVER",
    birthDate: "02/06/1961",
    doctor: "Martinez, Natalia",
    status: "No leído",
  },
  {
    name: "Herrera Gogley, Santiago",
    id: "719763",
    date: "19/06/2025",
    images: 108,
    priority: "Bajo",
    age: "20...",
    modality: "MR",
    identification: "454",
    organ: "SHOULDER",
    birthDate: "20/07/2009",
    doctor: "Marino Rodriguez, Lorena",
    status: "Final",
  },
  {
    name: "Mendez, Martin Edgardo",
    id: "851865",
    date: "19/06/2025",
    images: 164,
    priority: "Bajo",
    age: "10...",
    modality: "MR",
    identification: "129",
    organ: "SPINE",
    birthDate: "19/11/1970",
    doctor: "Peñeñory, Adolfo Ricardo",
    status: "Final",
  },
  {
    name: "Sposito, Alejandro Andrés",
    id: "809788",
    date: "19/06/2025",
    images: 18,
    priority: "Bajo",
    age: "50...",
    modality: "MR",
    identification: "454",
    organ: "SHOULDER",
    birthDate: "06/11/1971",
    doctor: "Marino Rodriguez, Lorena",
    status: "Final",
  },
  {
    name: "Cuniem, Mirta",
    id: "943528",
    date: "19/06/2025",
    images: 192,
    priority: "Bajo",
    age: "20...",
    modality: "MR",
    identification: "128",
    organ: "SPINE",
    birthDate: "22/03/1962",
    doctor: "Ciccioli, Nicolas",
    status: "Final",
  },
  {
    name: "Guevara, Delfina",
    id: "574765/3",
    date: "19/06/2025",
    images: 7,
    priority: "Bajo",
    age: "20...",
    modality: "US",
    identification: "44",
    organ: "",
    birthDate: "01/04/2019",
    doctor: "Lo Gioia, Maria Laura",
    status: "Lectura",
  },
  {
    name: "Ulacia, Ignacio Martin",
    id: "785802",
    date: "19/06/2025",
    images: 14,
    priority: "Bajo",
    age: "50...",
    modality: "MR",
    identification: "128",
    organ: "CSPINE",
    birthDate: "08/01/1972",
    doctor: "Muruaga, Alberto",
    status: "Final",
  },
]

export default function HospitalAdmin() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isListsOpen, setIsListsOpen] = useState(true);
  const [isAllListsOpen, setIsAllListsOpen] = useState(true);
  const [columnWidths, setColumnWidths] = useState({ /* ... */ });
  const [isResizing, setIsResizing] = useState(false);
  const [resizingColumn, setResizingColumn] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});

  const router = useRouter();

  const handleMouseDown = useCallback((column: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizingColumn(column);
    const startX = e.clientX;
    const startWidth = columnWidths[column as keyof typeof columnWidths];

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

       
      const { user, checking } = useAdminGuard();
      if (checking || !user) return null;

 

  const renderResizeHandle = (column: string) => (
    <div
      className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-blue-500/50 transition-colors flex items-center justify-center group/handle"
      onMouseDown={(e) => handleMouseDown(column, e)}
      style={{ zIndex: 10 }}
    >
      <div className="w-0.5 h-4 bg-slate-500 group-hover/handle:bg-blue-400 transition-colors" />
    </div>
  )

  const getUniqueValues = (column: string) => {
    const values = patients.map((patient) => {
      switch (column) {
        case "name":
          return patient.name
        case "priority":
          return patient.priority
        case "modality":
          return patient.modality
        case "organ":
          return patient.organ
        case "status":
          return patient.status
        default:
          return ""
      }
    })
    return [...new Set(values)].filter(Boolean)
  }

  const handleFilter = (column: string, value: string) => {
    setFilters((prev) => ({ ...prev, [column]: value }))
  }

  const clearFilter = (column: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev }
      delete newFilters[column]
      return newFilters
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Final":
        return (
          <Badge variant="secondary" className="bg-green-600 text-white">
            Final
          </Badge>
        )
      case "No leído":
        return <Badge variant="destructive">No leído</Badge>
      case "Lectura":
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-500">
            Lectura
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

   const handleLogout = () => {
      localStorage.removeItem("session");
      localStorage.removeItem("role");
      localStorage.removeItem("user");
      window.location.href = "/login";
    };


  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <AdminNavbar user={user} onLogout={handleLogout} />

      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Tabs */}
          <div className="flex space-x-6 mb-6 border-b border-slate-700">
            <button className="pb-2 text-blue-400 border-b-2 border-blue-400">Ver</button>
            <button className="pb-2 text-slate-400 hover:text-white">Ingresar</button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4 mb-6">
            <Button variant="outline" className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600">
              🔍 Paciente
            </Button>
            <Button variant="outline" className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600">
              📄 Ver pedido
            </Button>
            <Button variant="outline" className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600">
              📊 Informe
            </Button>
          </div>

          {/* Results Header */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">🔍 Resultados de búsqueda</h2>
          </div>

          {/* Patient Table */}
          <PatientTable
            patients={patients}
            columnWidths={columnWidths}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            filters={filters}
            handleSort={handleSort}
            handleFilter={handleFilter}
            clearFilter={clearFilter}
            renderResizeHandle={renderResizeHandle}
          />


          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-slate-400">1 - 19 de 747 items</div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="bg-blue-600 border-blue-600 text-white">
                1
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
              >
                2
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
              >
                3
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
              >
                4
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
              >
                5
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
