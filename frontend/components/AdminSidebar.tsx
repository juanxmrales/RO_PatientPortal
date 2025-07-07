"use client";

import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronLeft } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import { useRole } from "@/hooks/useRole";


export default function AdminSidebar() {
  const [isListsOpen, setIsListsOpen] = useState(true);
  const [isAllListsOpen, setIsAllListsOpen] = useState(true);
  const role = useRole();
  const [isConfigOpen, setIsConfigOpen] = useState(role === "admin");

  return (
    <div className="w-64 bg-slate-800 border-r border-slate-700">
      <div className="p-4 flex-grow">
        <nav className="space-y-2">
          {/* Registro de pacientes */}
          <Collapsible open={isListsOpen} onOpenChange={setIsListsOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full text-left text-sm font-medium text-slate-300 hover:text-white p-2 rounded">
              <span>📋 Registro de pacientes</span>
              {isListsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </CollapsibleTrigger>
          </Collapsible>

          {/* Todas los registros */}
          <Collapsible open={isAllListsOpen} onOpenChange={setIsAllListsOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full text-left text-sm font-medium text-slate-300 hover:text-white p-2 rounded">
              <span>📊 Todas los registros</span>
              {isAllListsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </CollapsibleTrigger>
            <CollapsibleContent className="ml-4 space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start text-blue-400 hover:text-blue-300 text-sm bg-slate-700"
              >
                👥 Buscar pacientes
              </Button>
            </CollapsibleContent>
          </Collapsible>
        </nav>
      </div>

  {/* Configuración abajo del todo */}
  {role === "admin" && (
    <div className="p-4 border-t border-slate-700">
      <Collapsible open={isConfigOpen} onOpenChange={setIsConfigOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full text-left text-sm font-medium text-slate-300 hover:text-white p-2 rounded">
          <span>⚙️ Configuración</span>
          {isConfigOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="ml-4 space-y-1 mt-2">
          <Button
            variant="ghost"
            className="w-full justify-start text-blue-400 hover:text-blue-300 text-sm"
          >
            👥 Administrar usuarios
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-blue-400 hover:text-blue-300 text-sm"
          >
            🛠️ Otras configuraciones
          </Button>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )}
</div>
  );
}
