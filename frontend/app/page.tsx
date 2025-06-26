'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const session = localStorage.getItem("session");
    const role = localStorage.getItem("role");

    if (!session) {
      router.push("/login");
    } else if (role === "admin") {
      router.push("/admin");
    } else if (role === "patient") {
      // Reemplazá con el token real cuando lo tengas
      window.location.href = "https://medicos.imagenesmdq.com/portal?urltoken=...";
    } else {
      router.push("/login");
    }
  }, []);

  return null;
}
