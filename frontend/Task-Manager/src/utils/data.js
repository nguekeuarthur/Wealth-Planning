import {
  LuLayoutDashboard,
  LuUsers,
  LuClipboardCheck,
  LuSquarePlus,
  LuLogOut,
  LuUserCheck,
  LuFileText,
  LuBell,
  LuMessageSquare,
  LuFolder,

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
    id: "04c",
    label: "Messagerie",
    icon: LuMessageSquare,
    path: "/admin/chat",
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
    label: "Mes projets",
    icon: LuClipboardCheck,
    path: "/user/projects",
  },

  {
    id: "06",
    label: "Messagerie",
    icon: LuMessageSquare,
    path: "/user/chat",
  },
  {
    id: "07",
    label: "Notifications",
    icon: LuBell,
    path: "/user/notifications",
  },
  {
    id: "08",
    label: "Déconnexion",
    icon: LuLogOut,
    path: "logout",
  },
];

export const SIDE_MENU_CLIENT_DATA = [
  {
    id: "01",
    label: "Tableau de bord",
    icon: LuLayoutDashboard,
    path: "/client/dashboard",
  },
  {
    id: "02",
    label: "Mes projets",
    icon: LuClipboardCheck,
    path: "/client/projects",
  },
  {
    id: "03",
    label: "Factures",
    icon: LuFileText,
    path: "/client/invoices",
  },
  {
    id: "04",
    label: "Documents",
    icon: LuFolder,
    path: "/client/documents",
  },
  {
    id: "05",
    label: "Messagerie",
    icon: LuMessageSquare,
    path: "/client/chat",
  },
  {
    id: "06",
    label: "Notifications",
    icon: LuBell,
    path: "/client/messages",
  },
  {
    id: "07",
    label: "Déconnexion",
    icon: LuLogOut,
    path: "logout",
  },
];

export const SIDE_MENU_PARTNER_DATA = [
  {
    id: "01",
    label: "Tableau de bord",
    icon: LuLayoutDashboard,
    path: "/partner/dashboard",
  },
  {
    id: "02",
    label: "Mes projets",
    icon: LuClipboardCheck,
    path: "/partner/projects",
  },
  {
    id: "03",
    label: "Tâches",
    icon: LuClipboardCheck,
    path: "/partner/tasks",
  },
  {
    id: "05",
    label: "Messagerie",
    icon: LuMessageSquare,
    path: "/partner/chat",
  },
  {
    id: "06",
    label: "Notifications",
    icon: LuBell,
    path: "/partner/messages",
  },
  {
    id: "06",
    label: "Déconnexion",
    icon: LuLogOut,
    path: "logout",
  },
];

export const SIDE_MENU_COLLABORATOR_DATA = [
  {
    id: "01",
    label: "Tableau de bord",
    icon: LuLayoutDashboard,
    path: "/collaborator/dashboard",
  },
  {
    id: "02",
    label: "Projets",
    icon: LuClipboardCheck,
    path: "/collaborator/projects",
  },
  {
    id: "03",
    label: "Tâches",
    icon: LuClipboardCheck,
    path: "/collaborator/tasks",
  },
  {
    id: "04",
    label: "Factures",
    icon: LuFileText,
    path: "/collaborator/invoices",
  },
  {
    id: "05",
    label: "Documents",
    icon: LuFolder,
    path: "/collaborator/documents",
  },
  {
    id: "06",
    label: "Messagerie",
    icon: LuMessageSquare,
    path: "/collaborator/chat",
  },
  {
    id: "07",
    label: "Notifications",
    icon: LuBell,
    path: "/collaborator/messages",
  },
  {
    id: "07",
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
