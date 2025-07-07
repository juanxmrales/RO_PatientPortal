"use client";
import { useState, useEffect } from "react";

export function useRole(): string | null {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setRole(parsed.role || null);
      } catch (e) {
        console.error("Error al parsear el rol del usuario:", e);
        setRole(null);
      }
    }
  }, []);

  return role;
}