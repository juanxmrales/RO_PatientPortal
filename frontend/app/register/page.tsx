"use client";

import { useEffect, useState } from "react";
import AdminNavbar from "@/components/AdminNavbar";
import AdminSidebar from "@/components/AdminSidebar";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useAdminGuard from "@/hooks/useAdminGuard";
import PatientCreatedModal from "@/components/PatientCreatedModal";
import { useRef } from "react";

export default function RegisterPatient() {
  const { user, checking } = useAdminGuard();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [createdPatient, setCreatedPatient] = useState<null | typeof formData>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dni: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!checking && (!user || (user.role !== "admin" && user.role !== "admission"))) {
      router.replace("/login");
    }
  }, [checking, user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role: "patient" }),
      });

      if (!res.ok) throw new Error("Error al registrar paciente");

      setCreatedPatient(formData);
      setShowModal(true);
      setFormData({ firstName: "", lastName: "", dni: "", email: "" });
    } catch (err) {
      console.error(err);
      alert("Error al registrar");
    } finally {
      setLoading(false);
    }
  };

  if (checking || !user) return <div className="text-white p-4">Cargando...</div>;


  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-white">
      <AdminNavbar user={user} onLogout={() => router.push("/login")} />
      <div className="flex flex-1">
        <AdminSidebar />
        <div className="flex-1 p-6">
          <h2 className="text-lg font-semibold mb-4">📝 Registrar nuevo paciente</h2>
          <div className="space-y-4 max-w-md">
            <Input
              ref={nameInputRef}
              placeholder="Nombre"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              autoFocus
            />
            <Input
              placeholder="Apellido"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
            <Input
              placeholder="DNI"
              name="dni"
              value={formData.dni}
              onChange={handleChange}
            />
            <Input
              placeholder="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-500"
            >
              {loading ? "Registrando..." : "Registrar paciente"}
            </Button>
          </div>
        </div>
      </div>
      {createdPatient && (
        <PatientCreatedModal
          open={showModal}
          onClose={() => {
            setShowModal(false);
            setTimeout(() => {
              nameInputRef.current?.focus();
            }, 100);
          }}
          patient={createdPatient}
        />
      )}
    </div>
  );
}
