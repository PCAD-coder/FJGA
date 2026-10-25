import { Shield, Users, UserCheck, Briefcase } from "lucide-react"

import { DashboardCard } from "@/components/dashboard_cards"

interface Props {
  total: number
  active: number
  inactive: number
  admins: number
  clients: number
}

export default function Stats({ total, active, admins, clients }: Props) {
  const cards = [
    {
      title: "Total Users",
      description: "All registered accounts",
      color: "text-blue-600 dark:text-blue-400",
      value: total,
      icon: Users,
    },
    {
      title: "Active Users",
      description: "Accounts with active access",
      color: "text-emerald-600 dark:text-emerald-400",
      value: active,
      icon: UserCheck,
    },
    {
      title: "Administrators",
      description: "Accounts with administrator access",
      color: "text-primary",
      value: admins,
      icon: Shield,
    },
    {
      title: "Clients",
      description: "Registered customer accounts",
      color: "text-amber-600 dark:text-amber-400",
      value: clients,
      icon: Briefcase,
    },
  ]

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <DashboardCard
          key={card.title}
          title={card.title}
          value={String(card.value)}
          description={card.description}
          icon={card.icon}
          color={card.color}
        />
      ))}
    </div>
  )
}
