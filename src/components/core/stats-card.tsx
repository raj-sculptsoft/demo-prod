import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface IStatsCardProps {
  title: string;
  icon: React.ReactNode;
  secondaryTitle?: string;
  value: string | number;
  secondaryValue?: string | number;
}

export default function StatsCard({
  title,
  icon,
  secondaryTitle,
  value,
  secondaryValue,
}: IStatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between space-y-0 pb-2 pt-4">
        <CardTitle className="text-base font-semibold text-secondary opacity-70">
          {title}
        </CardTitle>
        <div>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-3xl font-bold">{value}</div>
          {secondaryTitle && (
            <div className="mt-4 flex items-center">
              <p className="text-xs">Confidence score</p>
              <span className="ml-2 flex rounded-xl bg-green-lighter px-3 py-1">
                <span className="text-sm text-green">{secondaryValue}%</span>
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
