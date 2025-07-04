"use client";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar" ;
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

type Props = {
  user: { firstName: string; lastName: string; email?: string };
  onLogout: () => void;
};

export default function AdminNavbar({ user, onLogout }: Props) {
  return (
    <div className="border-b border-slate-700 bg-slate-800">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-semibold">RO Patient Portal</h1>
        </div>

        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center space-x-2 cursor-pointer">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-red-600 text-white">A</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <div className="font-medium">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-muted-foreground text-xs">
                    {user.email || ""}
                  </div>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-card border-border text-sm">
              <DropdownMenuItem onClick={onLogout}>
                🚪 Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
