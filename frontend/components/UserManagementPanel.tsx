import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import PatientTable from "@/components/PatientTable";
import PatientDetailModal from "@/components/PatientDetailModal";
import type { Patient } from "@/types/patient";
import type { User } from "@/types/user";
import usePatientData from "@/hooks/usePatientData";
import useResizableColumns from "@/hooks/useResizableColumns";

type Props = {
    user: User;
};

export default function UserManagementPanel({ user }: Props) {
    const { patients: users, loading } = usePatientData();
    const [sortColumn, setSortColumn] = useState("");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [filters, setFilters] = useState<Record<string, string>>({});
    const { columnWidths, handleMouseDown } = useResizableColumns();
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);


    const renderResizeHandle = (column: string) => (
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

    const handleEdit = (updatedPatient: Patient) => {
        console.log("Paciente actualizado:", updatedPatient);
        setIsModalOpen(false);
        setSelectedPatient(null);
    };

    const handleDelete = (id: number) => {
        console.log("Paciente eliminado con ID:", id);
        setIsModalOpen(false);
        setSelectedPatient(null);
    };

    const handleSelectPatient = (patient: Patient) => {
        setSelectedPatient(patient);
        setIsModalOpen(true);
    };

    return (
        <>
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
                    onSelectPatient={handleSelectPatient}
                />
            </div>
            <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-slate-400">1 - {users.length} de {users.length} items</div>
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

            {selectedPatient && (
                <PatientDetailModal
                    patient={selectedPatient}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}
        </>
    );
}
