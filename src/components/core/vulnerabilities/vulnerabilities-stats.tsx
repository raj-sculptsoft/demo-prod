import Critical from "@/assets/icons/critical";
import High from "@/assets/icons/high";
import Low from "@/assets/icons/low";
import Medium from "@/assets/icons/medium";
import Total from "@/assets/icons/total";
import StatsCard from "@/components/core/stats-card";
import { DashboardStats } from "@/types/dashboard";
import { VulnerabilityCounts } from "@/types/vulnerability";

type VulnerabilitiesStatsProps = {
  data: VulnerabilityCounts | DashboardStats;
};

export default function VulnerabilitiesStats({
  data,
}: VulnerabilitiesStatsProps) {
  const isDashboardStats = (
    data: VulnerabilityCounts | DashboardStats,
  ): data is DashboardStats => "total_vulnerabilities" in data;

  const searchParams = new URLSearchParams(location.search);
  const positivity_filter = searchParams.get("type") === "True"; // Correctly interpret the positivity filter as a boolean

  // Construct statsData based on whether the data comes from DashboardStats or VulnerabilityCounts.
  // - If `positivity_filter` is true, show true positive counts.
  // - Otherwise, show false positive counts.
  // - Different field names are used depending on the type of `data`, so we check its type first.
  const statsData = isDashboardStats(data)
    ? positivity_filter
      ? [
          {
            title: "Total",
            icon: <Total className="fill-primary" />,
            value: data.total_true_positives ?? 0,
          },
          {
            title: "Critical",
            icon: <Critical className="fill-red" />,
            value: data.critical_true_count ?? 0,
          },
          {
            title: "High",
            icon: <High className="fill-orange" />,
            value: data.high_true_count ?? 0,
          },
          {
            title: "Medium",
            icon: <Medium className="fill-yellow" />,
            value: data.medium_true_count ?? 0,
          },
          {
            title: "Low",
            icon: <Low className="fill-green-light" />,
            value: data.low_true_count ?? 0,
          },
        ]
      : [
          {
            title: "Total",
            icon: <Total className="fill-primary" />,
            value: data.total_false_positives ?? 0,
          },
          {
            title: "Critical",
            icon: <Critical className="fill-red" />,
            value: data.critical_false_count ?? 0,
          },
          {
            title: "High",
            icon: <High className="fill-orange" />,
            value: data.high_false_count ?? 0,
          },
          {
            title: "Medium",
            icon: <Medium className="fill-yellow" />,
            value: data.medium_false_count ?? 0,
          },
          {
            title: "Low",
            icon: <Low className="fill-green-light" />,
            value: data.low_false_count ?? 0,
          },
        ]
    : positivity_filter
      ? [
          {
            title: "Total",
            icon: <Total className="fill-primary" />,
            value: data.Total_True ?? 0,
          },
          {
            title: "Critical",
            icon: <Critical className="fill-red" />,
            value: data.Critical_True ?? 0,
          },
          {
            title: "High",
            icon: <High className="fill-orange" />,
            value: data.High_True ?? 0,
          },
          {
            title: "Medium",
            icon: <Medium className="fill-yellow" />,
            value: data.Medium_True ?? 0,
          },
          {
            title: "Low",
            icon: <Low className="fill-green-light" />,
            value: data.Low_True ?? 0,
          },
        ]
      : [
          {
            title: "Total",
            icon: <Total className="fill-primary" />,
            value: data.Total_False ?? 0,
          },
          {
            title: "Critical",
            icon: <Critical className="fill-red" />,
            value: data.Critical_False ?? 0,
          },
          {
            title: "High",
            icon: <High className="fill-orange" />,
            value: data.High_False ?? 0,
          },
          {
            title: "Medium",
            icon: <Medium className="fill-yellow" />,
            value: data.Medium_False ?? 0,
          },
          {
            title: "Low",
            icon: <Low className="fill-green-light" />,
            value: data.Low_False ?? 0,
          },
        ];

  return (
    <div className="mb-4 grid gap-3 md:grid-cols-2 lg:grid-cols-5">
      {statsData.map(({ title, icon, value }) => (
        <StatsCard key={title} {...{ title, icon, value }} />
      ))}
    </div>
  );
}
