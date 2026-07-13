// components/menus/admin-menu.ts

import {
  Home,
  UserPen,
  ShelvingUnit,
  ShoppingCart,
  Box,
  ClipboardList,
  Tag,
  ListTodo,
  Truck,
  BanknoteX,
  FolderPen,
  Send,
  ChartNoAxesCombined,
  ClipboardClock,
  CloudBackup,
} from "lucide-react";

export const adminMenu = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Client Management",
    url: "/dashboard/client-management",
    icon: UserPen,
  },
  {
    title: "Products",
    url: "/dashboard/products",
    icon: ShelvingUnit,
  },
  {
    title: "Sales",
    url: "/dashboard/sales",
    icon: ShoppingCart,
  },
  {
    title: "Inventory",
    url: "/dashboard/inventorym",
    icon: Box,
  },
  {
    title: "Custom Orders",
    url: "/dashboard/custom-orders",
    icon: ClipboardList,
  },
  {
    title: "Pricing",
    url: "/dashboard/pricing",
    icon: Tag,
  },
  {
    title: "Production",
    url: "/dashboard/production",
    icon: ListTodo,
  },
  {
    title: "Delivery",
    url: "/dashboard/delivery",
    icon: Truck,
  },
  {
    title: "Returns",
    url: "/dashboard/returns",
    icon: BanknoteX,
  },
  {
    title: "Content",
    url: "/dashboard/contentm",
    icon: FolderPen,
  },
  {
    title: "Feedback",
    url: "/dashboard/feedback",
    icon: Send,
  },
  {
    title: "Analytics",
    url: "/dashboard/analytics",
    icon: ChartNoAxesCombined,
  },
  {
    title: "Activity Logs",
    url: "/dashboard/activity-logs",
    icon: ClipboardClock,
  },
  {
    title: "Backup and Restore",
    url: "/dashboard/backup-and-restore",
    icon: CloudBackup,
  },
];