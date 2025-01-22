import CardSkeleton from "@/components/skeleton/card";
import { useAppDispatch, useAppSelector } from "@/hooks/use-store";
import { getDashboardStats } from "@/store/dashboard/api";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import FalsePositive from "../../../assets/icons/false-positive";
import Parcel from "../../../assets/icons/parcel";
import Security from "../../../assets/icons/security";
import Timer from "../../../assets/icons/timer";
import StatsCard from "../../../components/core/stats-card";

interface StatsProps {
  company_id: string;
}

export default function Stats({ company_id }: StatsProps) {
  const [searchParams] = useSearchParams();
  const product_id = searchParams.get("product") ?? "";
  const asset_id = searchParams.get("asset") ?? "";
  const dispatch = useAppDispatch();

  const { loading, data } = useAppSelector(({ dashboard }) => dashboard.stats);

  useEffect(() => {
    dispatch(
      getDashboardStats({
        company_id,
        product_id,
        asset_id,
      }),
    ).unwrap();
  }, [company_id, product_id, asset_id, dispatch]);

  let firstStat;
  if (product_id && !asset_id) {
    firstStat = {
      title: "Total Assets",
      icon: <Parcel className="fill-primary" />,
      value: data.total_assets,
    };
  } else if (asset_id) {
    firstStat = {
      title: "Total Files",
      icon: <Parcel className="fill-primary" />,
      value: data.total_files,
    };
  } else {
    firstStat = {
      title: "Total Products",
      icon: <Parcel className="fill-primary" />,
      value: data.total_products,
    };
  }

  const statsData = [
    firstStat,
    {
      title: "Total Vulnerabilities",
      icon: <Security className="fill-yellow" />,
      value: data.total_vulnerabilities,
    },
    {
      title: "False Positives",
      icon: <FalsePositive className="fill-green-light" />,
      value: data.total_false_positives,
      // secondaryTitle: asset_id ? "Confidence score" : undefined,
      // secondaryValue: asset_id ? 79 : undefined,
    },
    {
      title: "Engineering Hours Saved",
      icon: <Timer className="fill-orange" />,
      value: data.total_hours_saved,
    },
  ];

  return loading ? (
    <div className="mb-4">
      <CardSkeleton />
    </div>
  ) : (
    <div className="mb-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsData.map(({ title, icon, value }) => (
        <StatsCard key={title} {...{ title, icon, value }} />
      ))}
    </div>
  );
}
