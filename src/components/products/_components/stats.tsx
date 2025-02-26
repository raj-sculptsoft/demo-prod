import Medium from "@/assets/icons/medium";
import { useAppSelector } from "@/hooks/use-store";
import { useEffect, useState } from "react";
import Critical from "../../../assets/icons/critical";
import High from "../../../assets/icons/high";
import Low from "../../../assets/icons/low";
import StatsCard from "../../../components/core/stats-card";

export default function Stats() {
  const { data } = useAppSelector(({ products }) => products.stats);
  const [statsData, setStatsData] = useState([
    {
      title: "Critical",
      icon: <Critical className="fill-red" />,
      value: 0, // Default value, will be updated from API response
    },
    { title: "High", icon: <High className="fill-orange" />, value: 0 },
    {
      title: "Medium",
      icon: <Medium className="fill-yellow" />,
      value: 0,
    },
    { title: "Low", icon: <Low className="fill-green-light" />, value: 0 },
  ]);

  useEffect(() => {
    if (data) {
      setStatsData((prev) =>
        prev.map((item) => ({
          ...item,
          value: data[item.title as keyof typeof data] ?? 0, // Ensure correct type mapping and prevent undefined values
        })),
      );
    }
  }, [data]);

  return (
    <div className="mb-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsData.map(({ title, icon, value }) => (
        <StatsCard key={title} {...{ title, icon, value }} />
      ))}
    </div>
  );
}
