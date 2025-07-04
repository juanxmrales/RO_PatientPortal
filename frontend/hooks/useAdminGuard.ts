"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function useAdminGuard() {
  const [user, setUser] = useState<any>(null);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

    useEffect(() => {
        const userRaw = localStorage.getItem("user");
        if (userRaw) {
            try {
            const parsedUser = JSON.parse(userRaw);
            if (parsedUser.role === "admin" || parsedUser.role === "admission") {
                setUser(parsedUser);
                setChecking(false);
            } else {
                router.replace("/login");
            }
            } catch (error) {
            console.error("Error al parsear user", error);
            router.replace("/login");
            }
        } else {
            router.replace("/login");
        }
    }, [router]);


  return { user, checking };
}
