import { useAppSelector } from "@/hooks/use-store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import { DashboardRiskMatrixCount } from "../../../../types/dashboard";
import SummaryCardWrapper from "./summary-card-wrapper";

export default function RiskMatrix() {
  const { data } = useAppSelector(({ dashboard }) => dashboard.riskMatrix);

  const riskMatrix: DashboardRiskMatrixCount = data.risk_matrix;

  // Define impact levels with type safety
  const impactLevels = ["Critical", "High", "Medium", "Low"] as const;

  // Generate the matrix with adjusted column values
  const matrix = impactLevels.map((impact) => {
    const values = impactLevels.map(
      (likelihood) => riskMatrix[likelihood][impact],
    );
    // Rearrange values: [first -> last, last -> first, second -> third, third -> second]
    return {
      impact,
      values: [values[3], values[2], values[1], values[0]], // Rearranged columns
    };
  });

  // Dynamically create likelihood levels array based on impactLevels
  const likelihoodLevels = ["Risk Matrix", "Low", "Medium", "High", "Critical"];

  const getCellColor = (
    likelihood: string | undefined,
    impact: string | undefined,
  ) => {
    if (impact === "Critical" && likelihood === "Critical")
      return "bg-[#D04D6C]";
    if (impact === "Critical" && likelihood === "High") return "bg-[#D04D6C]";
    if (impact === "Critical" && likelihood === "Medium") return "bg-[#FB9199]";
    if (impact === "Critical" && likelihood === "Low") return "bg-[#FED677]";
    if (impact === "High" && likelihood === "Critical") return "bg-[#D04D6C]";
    if (impact === "High" && likelihood === "High") return "bg-[#FB9199]";
    if (impact === "High" && likelihood === "Medium") return "bg-[#FED677]";
    if (impact === "High" && likelihood === "Low") return "bg-[#31D080B2]";
    if (impact === "Medium" && likelihood === "Critical") return "bg-[#FB9199]";
    if (impact === "Medium" && likelihood === "High") return "bg-[#FED677]";
    if (impact === "Medium" && likelihood === "Medium") return "bg-[#FED677]";
    if (impact === "Medium" && likelihood === "Low") return "bg-[#31D080B2]";
    if (impact === "Low" && likelihood === "Critical") return "bg-[#FED677]";
    if (impact === "Low" && likelihood === "High") return "bg-[#FED677]";
    if (impact === "Low" && likelihood === "Medium") return "bg-[#31D080B2]";
    if (impact === "Low" && likelihood === "Low") return "bg-[#31D080B2]";
    return "bg-[#77DD77]";
  };

  return (
    <SummaryCardWrapper title="Risk Matrix (Heat Map)">
      <div className="mb-3 text-center font-semibold">Likelihood</div>
      <div className="relative px-4">
        <Table>
          <TableHeader>
            <TableRow>
              {likelihoodLevels.map((likelihood, index) => (
                <TableHead
                  key={`header-${likelihood}-${index}`}
                  className={`pointer-events-none min-w-24 text-center font-normal ${
                    index > 0 ? "border bg-bodyBackground" : "border"
                  }`}
                >
                  {likelihood}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {matrix.map((row, rowIndex) => (
              <TableRow key={`row-${rowIndex}-${row.impact}`}>
                <TableCell className="bg-bodyBackground text-center font-normal">
                  {row.impact}
                </TableCell>
                {row.values.map((value, colIndex) => (
                  <TableCell
                    key={`cell-${rowIndex}-${colIndex}-${row.impact}-${likelihoodLevels[colIndex + 1]}`}
                    className={`border-[3px] border-l-0 border-t-0 border-white text-center ${getCellColor(
                      likelihoodLevels[colIndex + 1],
                      row.impact,
                    )}`}
                  >
                    {value}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="absolute -left-6 top-1/2 origin-center -translate-y-1/2 -rotate-90 transform whitespace-nowrap font-semibold">
          Impact
        </div>
      </div>
    </SummaryCardWrapper>
  );
}
