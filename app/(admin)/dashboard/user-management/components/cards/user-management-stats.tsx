import {
  Shield,
  Users,
  UserCheck,
  Briefcase,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

interface Props {
  total: number
  active: number
  inactive: number
  admins: number
  clients: number
}

export default function Stats({
  total,
  active,
  admins,
  clients,
}: Props) {
  const cards = [
    {
      title: "Total Users",
      value: total,
      icon: Users,
    },
    {
      title: "Active Users",
      value: active,
      icon: UserCheck,
    },
    {
      title: "Administrators",
      value: admins,
      icon: Shield,
    },
    {
      title: "Clients",
      value: clients,
      icon: Briefcase,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">
                {card.title}
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                {card.value}
              </h2>
            </div>

            <card.icon className="h-9 w-9 text-muted-foreground" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}