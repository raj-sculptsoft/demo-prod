import { useAppSelector } from "@/hooks/use-store";
import { RadialBar, RadialBarChart } from "recharts";
import { ChartContainer } from "../../../../ui/chart";
import { Label } from "../../../../ui/label";
import SummaryCardWrapper from "../summary-card-wrapper";

export default function Vulnerabilities() {
  const { data } = useAppSelector(({ dashboard }) => dashboard.vulnerabilities);

  const chartData = [
    { type: "Low", value: data.low_count, className: "fill-green-chart" },
    { type: "Medium", value: data.medium_count, className: "fill-yellow" },
    { type: "High", value: data.high_count, className: "fill-orange-chart" },
    { type: "Critical", value: data.critical_count, className: "fill-red" },
  ];

  const vulnerabilitiesData = [
    { name: "Critical", value: data.critical_count, className: "bg-red" },
    { name: "High", value: data.high_count, className: "bg-orange-chart" },
    { name: "Medium", value: data.medium_count, className: "bg-yellow" },
    { name: "Low", value: data.low_count, className: "bg-green-chart" },
  ];

  return (
    <SummaryCardWrapper title="Vulnerabilities">
      <div className="flex">
        <ChartContainer config={{}} className="aspect-square basis-7/12">
          <RadialBarChart
            data={chartData}
            innerRadius={50}
            startAngle={90}
            endAngle={-270}
            outerRadius={120}
            barSize={12}
          >
            <RadialBar dataKey="value" background />
          </RadialBarChart>
        </ChartContainer>
        <div className="flex flex-col justify-center">
          <div className="mb-6">
            <p className="mb-1 text-borderColor-dark">Total</p>
            <p className="font-bold">{data.total_vulnerabilities}</p>
          </div>
          <div className="space-y-3">
            {vulnerabilitiesData.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between gap-2"
              >
                <div className="mr-24 flex items-center gap-2">
                  <div className={`h-4 w-4 rounded ${item.className}`} />
                  <Label className="font-normal text-borderColor-dark">
                    {item.name}
                  </Label>
                </div>
                <span className="font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SummaryCardWrapper>
  );
}
