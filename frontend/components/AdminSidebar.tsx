"use client";

import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronLeft } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

export default function AdminSidebar() {
  const [isListsOpen, setIsListsOpen] = useState(true);
  const [isAllListsOpen, setIsAllListsOpen] = useState(true);

  return (
    <div className="w-64 bg-slate-800 border-r border-slate-700 min-h-screen">
      <div className="p-4">
        <nav className="space-y-2">
          <Collapsible open={isListsOpen} onOpenChange={setIsListsOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full text-left text-sm font-medium text-slate-300 hover:text-white p-2 rounded">
              <span>📋 Mis registros</span>
              {isListsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </CollapsibleTrigger>
          </Collapsible>

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

          <Button variant="ghost" className="w-full justify-start text-slate-400 hover:text-white text-sm">
            👁️ Visto últimamente
          </Button>
          <Button variant="ghost" className="w-full justify-start text-slate-400 hover:text-white text-sm">
            📁 Archivos
          </Button>
        </nav>
      </div>
    </div>
  );
}
