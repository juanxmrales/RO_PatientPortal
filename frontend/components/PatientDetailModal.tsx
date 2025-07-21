import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Patient } from "@/types/patient";

export default function PatientDetailModal({
    patient,
    isOpen,
    onClose,
    onDelete,
    onEdit,
}: {
    patient: Patient;
    isOpen: boolean;
    onClose: () => void;
    onDelete: (id: number) => void;
    onEdit: (updatedPatient: Patient) => void;
}) {
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState<Patient>({ ...patient });

    if (!patient) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev: Patient) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        onEdit(formData);
        setEditMode(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-slate-900 text-white">
                <DialogHeader>
                    <DialogTitle>{editMode ? "Editar paciente" : "Detalle del paciente"}</DialogTitle>
                </DialogHeader>

                <div className="space-y-3 mt-2">
                    {editMode ? (
                        <>
                            <Input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Nombre" className="bg-slate-800 border-slate-700 text-white" />
                            <Input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Apellido" className="bg-slate-800 border-slate-700 text-white" />
                            <Input name="dni" value={formData.dni} onChange={handleChange} placeholder="DNI" className="bg-slate-800 border-slate-700 text-white" />
                            <Input name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="bg-slate-800 border-slate-700 text-white" />
                        </>
                    ) : (
                        <>
                            <p><strong>Nombre:</strong> {patient.firstName} {patient.lastName}</p>
                            <p><strong>DNI:</strong> {patient.dni}</p>
                            <p><strong>Email:</strong> {patient.email}</p>
                            <p><strong>Rol:</strong> {patient.role}</p>
                            <p><strong>Último acceso:</strong> {patient.lastLogin || 'Nunca'}</p>
                        </>
                    )}
                </div>

                <div className="flex justify-end gap-2 mt-4">
                    {editMode ? (
                        <>
                            <Button variant="outline" onClick={() => setEditMode(false)}>
                                Cancelar
                            </Button>
                            <Button onClick={handleSave}>
                                Guardar
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="destructive" onClick={() => onDelete(patient.id)}>
                                Eliminar
                            </Button>
                            <Button onClick={() => setEditMode(true)}>
                                Editar
                            </Button>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
