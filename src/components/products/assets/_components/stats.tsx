import Critical from "@/assets/icons/critical";
import High from "@/assets/icons/high";
import Low from "@/assets/icons/low";
import Medium from "@/assets/icons/medium";
import { useAppSelector } from "@/hooks/use-store";
import StatsCard from "../../../core/stats-card";

export default function Stats() {
  const { data: statsData } = useAppSelector((state) => state.assets.stats);

  // Maps statistics data to display different severity levels with default values
  const stats = [
    {
      title: "Critical",
      icon: <Critical className="fill-red" />,
      value: statsData.Critical ?? 0, // Ensure value defaults to 0 if undefined
    },
    {
      title: "High",
      icon: <High className="fill-orange" />,
      value: statsData.High ?? 0,
    },
    {
      title: "Medium",
      icon: <Medium className="fill-yellow" />,
      value: statsData.Medium ?? 0,
    },
    {
      title: "Low",
      icon: <Low className="fill-green-light" />,
      value: statsData.Low ?? 0,
    },
  ];

  return (
    <div className="mb-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatsCard
          key={stat.title}
          title={stat.title}
          icon={stat.icon}
          value={stat.value}
        />
      ))}
    </div>
  );
}
