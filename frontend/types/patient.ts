import { User } from "./user";

export interface Patient extends User{
    role: "patient";
}