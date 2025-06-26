import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";
import React from "react";

interface Patient {
  name: string;
  id: string;
  date: string;
  images: number;
  priority: string;
  age: string;
  modality: string;
  identification: string;
  organ: string;
  birthDate: string;
  doctor: string;
  status: string;
}

interface Props {
  patients: Patient[];
  columnWidths: Record<string, number>;
  sortColumn: string;
  sortDirection: "asc" | "desc";
  filters: Record<string, string>;
  handleSort: (column: string) => void;
  handleFilter: (column: string, value: string) => void;
  clearFilter: (column: string) => void;
  renderResizeHandle: (column: string) => React.ReactNode;
}

export default function PatientTable({
  patients,
  columnWidths,
  sortColumn,
  sortDirection,
  filters,
  handleSort,
  handleFilter,
  clearFilter,
  renderResizeHandle,
}: Props) {
  const getUniqueValues = (column: string) => {
    const values = patients.map((p) => (p as any)[column]);
    return [...new Set(values)].filter(Boolean);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Final":
        return (
          <Badge variant="secondary" className="bg-green-600 text-white">
            Final
          </Badge>
        );
      case "No leído":
        return <Badge variant="destructive">No leído</Badge>;
      case "Lectura":
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-500">
            Lectura
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <TooltipProvider>
      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-700 hover:bg-slate-700">
              {[
                { key: "name", label: "Nombre del paciente" },
                { key: "id", label: "DNI" },
                { key: "date", label: "Fecha de alta" },
                { key: "age", label: "Ac..." },
                { key: "birthDate", label: "Fecha de nac" },
                { key: "doctor", label: "Médico solicitante" },
                { key: "status", label: "Estado" },
              ].map(({ key, label }) => (
                <TableHead
                  key={key}
                  className="text-slate-300 relative group cursor-pointer select-none"
                  style={{ width: columnWidths[key] }}
                  onClick={() => handleSort(key)}
                >
                  <div className="flex items-center justify-between pr-4">
                    <div className="flex items-center space-x-1">
                      <span>{label}</span>
                      {sortColumn === key && (
                        sortDirection === "asc" ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )
                      )}
                    </div>
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-slate-600">
                                <Filter className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Filtrar por {label.toLowerCase()}</p>
                            </TooltipContent>
                          </Tooltip>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-slate-700 border-slate-600">
                          <DropdownMenuItem
                            onClick={() => clearFilter(key)}
                            className="text-slate-300 hover:bg-slate-600"
                          >
                            Mostrar todos
                          </DropdownMenuItem>
                          {getUniqueValues(key).slice(0, 5).map((value) => (
                            <DropdownMenuItem
                              key={value}
                              onClick={() => handleFilter(key, value)}
                              className="text-slate-300 hover:bg-slate-600"
                            >
                              {value}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-slate-600"
                            onClick={() => handleSort(key)}
                          >
                            <ArrowUpDown className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Ordenar por {label.toLowerCase()}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                  {renderResizeHandle(key)}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((patient, index) => (
              <TableRow key={index} className="border-slate-700 hover:bg-slate-700">
                <TableCell className="text-white font-medium" style={{ width: columnWidths.name }}>
                  {patient.name}
                </TableCell>
                <TableCell className="text-slate-300" style={{ width: columnWidths.id }}>
                  {patient.id}
                </TableCell>
                <TableCell className="text-slate-300" style={{ width: columnWidths.date }}>
                  {patient.date}
                </TableCell>
                <TableCell className="text-slate-300" style={{ width: columnWidths.age }}>
                  {patient.age}
                </TableCell>
                <TableCell className="text-slate-300" style={{ width: columnWidths.birthDate }}>
                  {patient.birthDate}
                </TableCell>
                <TableCell className="text-slate-300" style={{ width: columnWidths.doctor }}>
                  {patient.doctor}
                </TableCell>
                <TableCell style={{ width: columnWidths.status }}>
                  {getStatusBadge(patient.status)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  );
}
