import { useState, useEffect } from "react";
import type { Patient } from "@/types/patient";

export default function usePatientData() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const res = await fetch("http://localhost:3001/api/users", { cache: "no-store" });
                const data = await res.json();
                setPatients(data);
            } catch (error) {
                console.error("Error al cargar usuarios:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, []);

    return { patients, loading };
}
