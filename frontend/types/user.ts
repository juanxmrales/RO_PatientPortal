export interface User {
  id: number;
  dni: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "patient" | "admin"; // común a ambos
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
}