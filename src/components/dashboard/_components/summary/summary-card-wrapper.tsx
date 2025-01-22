import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function SummaryCardWrapper({
  title,
  children,
  cardContentClassName = "",
  cardMainClassName = "",
}: {
  title: string;
  children: React.ReactNode;
  cardContentClassName?: string;
  cardMainClassName?: string;
}) {
  return (
    <Card className={cardMainClassName}>
      <CardHeader className="px-4 py-5 pb-2">
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className={cn("p-5 pt-0", cardContentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
}
