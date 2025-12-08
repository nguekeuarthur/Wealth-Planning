import {
    LuLayoutDashboard,
    LuUsers,
    LuClipboardCheck,
    LuSquarePlus,
    LuLogOut,
    LuUserCheck,
    LuFileText,
    LuBell,
  
  } from "react-icons/lu";
  
  
  export const SIDE_MENU_DATA = [
    {
      id: "01",
      label: "Tableau de bord",
      icon: LuLayoutDashboard,
      path: "/admin/dashboard",
    },
    {
      id: "02",
      label: "Projets",
      icon: LuClipboardCheck,
      path: "/admin/projects",
    },
    {
      id: "04",
      label: "Utilisateurs",
      icon: LuUserCheck,
      path: "/admin/team",
    },
    {
      id: "04b",
      label: "Équipes",
      icon: LuUsers,
      path: "/admin/teams",
    },
    {
      id: "05",
      label: "Factures",
      icon: LuFileText,
      path: "/admin/invoices",
    },
    {
      id: "06",
      label: "Contrats",
      icon: LuFileText,
      path: "/admin/contracts",
    },
    {
      id: "08",
      label: "Notifications",
      icon: LuBell,
      path: "/admin/notifications",
    },
    {
      id: "09",
      label: "Déconnexion",
      icon: LuLogOut,
      path: "logout",
    },
  ];
  
  export const SIDE_MENU_USER_DATA = [
    {
      id: "01",
      label: "Tableau de bord",
      icon: LuLayoutDashboard,
      path: "/user/dashboard",
    },
    {
      id: "02",
      label: "Mes tâches",
      icon: LuClipboardCheck,
      path: "/user/tasks",
    },
    {
      id: "03",
      label: "Notifications",
      icon: LuBell,
      path: "/user/notifications",
    },
    {
      id: "04",
      label: "Déconnexion",
      icon: LuLogOut,
      path: "logout",
    },
  ];
  
  export const PRIORITY_DATA = [
    { label: "Low", value: "Low" },
    { label: "Medium", value: "Medium" },
    { label: "High", value: "High" },
  ];
  
  export const STATUS_DATA = [
    { label: "Pending", value: "Pending" },
    { label: "In Progress", value: "In Progress" },
    { label: "Completed", value: "Completed" },
  ];
