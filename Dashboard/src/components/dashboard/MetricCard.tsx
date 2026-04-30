import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  children: ReactNode;
}

const MetricCard = ({ title, children }: MetricCardProps) => {
  return (
    <Card className="rounded-card border-none shadow-md hover:shadow-lg transition-all duration-300 flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-0 flex flex-col flex-1">{children}</CardContent>
    </Card>
  );
};

export default MetricCard;
