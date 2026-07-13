// components/menus/client-menu.ts

import {
  Home,
  Package,
  CreditCard,
  Truck,
  Bell,
  MessageSquare,
  BookOpen,
  PencilRuler,
  ListChecks,
  RotateCcw,
} from "lucide-react";

export const clientMenu = [
  {
    title: "Dashboard",
    url: "/client-dashboard",
    icon: Home,
  },
  {
    title: "Catalog",
    url: "catalog",
    icon: BookOpen,
  },
  {
    title: "Custom Orders",
    url: "custom-orders",
    icon: PencilRuler,
  },
  {
    title: "My Orders",
    url: "my-orders",
    icon: Package,
  },
  {
    title: "Order Monitoring",
    url: "/order-monitoring",
    icon: ListChecks,
  },
  {
    title: "Payments",
    url: "/payments",
    icon: CreditCard,
  },
  {
    title: "Delivery Tracking",
    url: "#",
    icon: Truck,
  },
  {
    title: "Notifications",
    url: "#",
    icon: Bell,
  },
  {
    title: "Feedback",
    url: "#",
    icon: MessageSquare,
  },
  {
    title: "Returns",
    url: "returns",
    icon: RotateCcw,
  },
];