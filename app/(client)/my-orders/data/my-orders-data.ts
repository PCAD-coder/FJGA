import { Order } from "../types/order";

export const orders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2026-001",

    productName: "Glass Dining Table",

    image: "/products/glass-dining-table.jpg",

    madeToOrder: true,

    quantity: 2,

    width: 180,

    height: 90,

    aluminumSeries: "6063-T5",

    glassType: "10mm Tempered Glass",

    orderedAt: "June 5, 2026",

    estimatedDelivery: "June 18, 2026",

    total: 45000,

    currentStage: "Production",

    progressPercentage: 45,

    status: "Production",

    progress: {
      quotation: true,
      production: true,
      delivery: false,
      completed: false,
    },
  },

  {
    id: "2",

    orderNumber: "ORD-2026-002",

    productName: "Aluminum Sliding Window",

    image: "/products/sliding-window.jpg",

    madeToOrder: true,

    quantity: 6,

    width: 150,

    height: 120,

    aluminumSeries: "798 Series",

    glassType: "8mm Clear Glass",

    orderedAt: "June 2, 2026",

    estimatedDelivery: "June 14, 2026",

    total: 38000,

    currentStage: "Approved",

    progressPercentage: 100,

    status: "Approved",

    progress: {
      quotation: true,
      production: true,
      delivery: true,
      completed: true,
    },
  },

  {
    id: "3",

    orderNumber: "ORD-2026-003",

    productName: "Glass Office Partition",

    image: "/products/office-partition.jpg",

    madeToOrder: true,

    quantity: 1,

    width: 300,

    height: 240,

    aluminumSeries: "6063-T5",

    glassType: "12mm Frosted Glass",

    orderedAt: "May 28, 2026",

    estimatedDelivery: "June 15, 2026",

    total: 58000,

    currentStage: "Declined",

    progressPercentage: 0,

    status: "Declined",

    progress: {
      quotation: false,
      production: false,
      delivery: false,
      completed: false,
    },
  },

  {
    id: "4",

    orderNumber: "ORD-2026-004",

    productName: "Frameless Shower Enclosure",

    image: "/products/shower-enclosure.jpg",

    madeToOrder: true,

    quantity: 1,

    width: 120,

    height: 210,

    aluminumSeries: "6063-T5",

    glassType: "10mm Tempered Glass",

    orderedAt: "May 20, 2026",

    estimatedDelivery: "June 5, 2026",

    total: 32000,

    currentStage: "Completed",

    progressPercentage: 100,

    status: "Completed",

    progress: {
      quotation: true,
      production: true,
      delivery: true,
      completed: true,
    },
  },
];