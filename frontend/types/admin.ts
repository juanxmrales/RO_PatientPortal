import { User } from "./user";

interface Admin extends User {
  role: "admin";
}