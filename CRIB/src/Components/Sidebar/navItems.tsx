import { UserCheck, Users2 } from "lucide-react";
import React from "react";

export interface NavItem {
  label: string;
  icon: React.ReactNode;
  path?: string;
  role: string[];
}

export const navItems: NavItem[] = [
  { label: "Approvals", icon: <UserCheck size={18} />, path: "/crib-requests" , role:["crib"]},
  { label: "Users", icon: <Users2 size={18} />, path: "/create-account" , role:["bank"]},
  
];
