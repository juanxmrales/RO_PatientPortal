"use client";

import useAdminGuard from "@/hooks/useAdminGuard";
import AdminNavbar from "@/components/AdminNavbar";
import AdminSidebar from "@/components/AdminSidebar";
import UserManagementPanel from "@/components/UserManagementPanel";

export default function AdminPage() {
  const { user, checking } = useAdminGuard();

  if (checking || !user) {
    return <div className="text-white p-4">Cargando...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-white">
      <AdminNavbar user={user} onLogout={() => {
        localStorage.removeItem("session");
        localStorage.removeItem("role");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }} />

      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <UserManagementPanel user={user} />
        </main>
      </div>
    </div>
  );
}
