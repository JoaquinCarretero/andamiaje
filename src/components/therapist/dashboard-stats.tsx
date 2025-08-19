import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { FileText, Calendar, Users, CheckCircle } from "lucide-react"

export function DashboardStats() {
  const stats = [
    {
      title: "Planes de Trabajo",
      value: "12",
      subtitle: "8 completados",
      icon: FileText,
      progress: 67,
      color: "text-primary",
    },
    {
      title: "Informes Semestrales",
      value: "3",
      subtitle: "1 pendiente",
      icon: Calendar,
      progress: 67,
      color: "text-secondary",
    },
    {
      title: "Actas Pendientes",
      value: "5",
      subtitle: "2 vencidas",
      icon: Users,
      progress: 40,
      color: "text-destructive",
    },
    {
      title: "Facturas Subidas",
      value: "8/12",
      subtitle: "Este año",
      icon: CheckCircle,
      progress: 67,
      color: "text-primary",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-all duration-200 border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <div className="p-2 rounded-lg bg-primary/10">
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-serif mb-2">{stat.value}</div>
            <p className="text-sm text-muted-foreground mb-3">{stat.subtitle}</p>
            <Progress value={stat.progress} className="h-3" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
