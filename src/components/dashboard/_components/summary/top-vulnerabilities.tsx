import { useAppSelector } from "@/hooks/use-store";
import { impactColor } from "../../../../lib/common";
import { DashboardVulnerabilitiesDetails } from "../../../../types/dashboard";
import { Badge } from "../../../ui/badge";
import { Progress } from "../../../ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../ui/table";
import SummaryCardWrapper from "./summary-card-wrapper";

const tableHeads = [
  { label: "#", className: "w-16 text-center" },
  { label: "Vulnerability" },
  { label: "Severity" },
  { label: "Impact" },
];

export default function TopVulnerabilities() {
  const { data } = useAppSelector(
    ({ dashboard }) => dashboard.vulnerabilityDetails,
  );

  const getSeverityColor = (
    impact: DashboardVulnerabilitiesDetails["impact"],
  ) => {
    // Returns appropriate background and indicator colors based on severity level
    switch (impact) {
      case "Critical":
        return { indicator: "bg-red", indicatorBg: "bg-red-lighter" };
      case "High":
        return {
          indicator: "bg-orange-chart",
          indicatorBg: "bg-orange-lighter",
        };
      case "Medium":
        return { indicator: "bg-yellow", indicatorBg: "bg-yellow-light" };
      default:
        return { indicator: "bg-green", indicatorBg: "bg-green-lighter" };
    }
  };

  const severityMapping = {
    Critical: 90,
    High: 80,
    Medium: 70,
    Low: 60,
  };

  // Maps severity levels to numerical values for the progress bar representation
  const vulnerabilities = data.list.map((item) => ({
    id: String(item.id),
    vulnerability_name: item.vulnerability_name,
    severity:
      severityMapping[item.severity as keyof typeof severityMapping] || 0,
    impact: item.impact,
  }));

  return (
    <SummaryCardWrapper title="Top Vulnerabilities" cardContentClassName="px-0">
      <Table className="pointer-events-none">
        <TableHeader>
          <TableRow>
            {tableHeads.map(({ label, className = "" }) => (
              <TableHead key={label} className={className}>
                {label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="p-0">
          {vulnerabilities.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No Vulnerabilities Found
              </TableCell>
            </TableRow>
          ) : (
            vulnerabilities.map((vulnerability) => (
              <TableRow key={vulnerability.id}>
                <TableCell className="text-muted-foreground text-center">
                  {vulnerability.id}
                </TableCell>
                <TableCell>{vulnerability.vulnerability_name}</TableCell>
                <TableCell className="w-[35%] py-4">
                  <div className="flex items-center">
                    <Progress
                      value={vulnerability.severity}
                      className={`h-[5px] ${getSeverityColor(vulnerability.impact).indicatorBg}`}
                      indicatorClassName={
                        getSeverityColor(vulnerability.impact).indicator +
                        " rounded-lg"
                      }
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      impactColor[
                        vulnerability.impact as keyof typeof impactColor
                      ]
                    }
                  >
                    {vulnerability.impact}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </SummaryCardWrapper>
  );
}
