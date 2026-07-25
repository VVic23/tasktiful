import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Clock, AlertTriangle, ListTodo } from "lucide-react";

interface StatsProps {
  stats: {
    total: number;
    completed: number;
    inProgress: number;
    todo: number;
    urgent: number;
  };
}

export function TaskStats({ stats }: StatsProps) {
  const cards = [
    {
      title: "Total Tasks",
      value: stats.total,
      icon: ListTodo,
      color: "text-blue-500",
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      icon: Clock,
      color: "text-purple-500",
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: CheckCircle2,
      color: "text-green-500",
    },
    {
      title: "Urgent Priority",
      value: stats.urgent,
      icon: AlertTriangle,
      color: "text-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">{card.title}</p>
                <p className="text-2xl font-bold mt-1">{card.value}</p>
              </div>
              <Icon className={`h-6 w-6 ${card.color}`} />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}