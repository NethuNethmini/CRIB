import { UserCheck, UserCircle, Users2 } from "lucide-react";
import React from "react";

export interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  roles: string[]; 
}

export const navItems: NavItem[] = [
  {
    label: "Approvals",
    icon: <UserCheck size={18} />,
    path: "/crib-requests",
    roles: ["crib"], 
  },

  {
    label:"Accounts",
    icon:<UserCircle size={18}/>,
    path:"/accounts",
    roles:["bank","crib"]
  },
  {
    label: "Users",
    icon: <Users2 size={18} />,
    path: "/create-account",
    roles: ["bank"], 
  },
   {
    label: "  Facilities",
    icon: <Users2 size={18} />,
    path: "/facilities",
    roles: ["bank"], 
  },

   {
    label: "Reports",
    icon: <Users2 size={18} />,
    path: "/reports",
    roles: ["crib"], 
  },
  {
    label: "Crib Report",
    icon: <UserCheck size={18} />,
    path: "/crib-report",
    roles: ["bank"],
  },

  
];


