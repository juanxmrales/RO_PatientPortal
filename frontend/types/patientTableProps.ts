import { Patient } from "./patient";

export interface PatientTableProps {
  patients: Patient[];
  columnWidths: Record<string, number>;
  sortColumn: string;
  sortDirection: "asc" | "desc";
  filters: Record<string, string>;
  handleSort: (column: string) => void;
  handleFilter: (column: string, value: string) => void;
  clearFilter: (column: string) => void;
  renderResizeHandle: (column: string) => React.ReactNode;
}


