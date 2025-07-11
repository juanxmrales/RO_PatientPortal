"use client";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";


interface Props {
  open: boolean;
  onClose: () => void;
  patient: {
    firstName: string;
    lastName: string;
    dni: string;
    email: string;
  };
}

export default function PatientCreatedModal({ open, onClose, patient }: Props) {
  const handleEdit = () => {
    window.location.href = `/edit/${patient.dni}`;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 text-white border border-slate-600 rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl"> Paciente registrado!</DialogTitle>
        </DialogHeader>

        <div className="space-y-2 text-sm">
          <p><strong>Nombre:</strong> {patient.firstName}</p>
          <p><strong>Apellido:</strong> {patient.lastName}</p>
          <p><strong>DNI:</strong> {patient.dni}</p>
          <p><strong>Email:</strong> {patient.email}</p>
          <p className="text-green-400">📨 El paciente fue notificado por correo electrónico.</p>
        </div>

        <DialogFooter className="gap-2 mt-4">
          <Button variant="outline" onClick={handleEdit} className="hover:bg-blue-600 text-white">✏️ Editar</Button>
          <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-500 text-white" autoFocus>✔️ Aceptar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
