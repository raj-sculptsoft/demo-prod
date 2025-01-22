import { useAppDispatch, useAppSelector } from "@/hooks/use-store";
import { toast } from "@/hooks/use-toast";
import { VULNERABILITY_DETAILS_SOURCE } from "@/lib/common";
import { fetchReportById } from "@/store/upload-reports/api";
import {
  resetReportId,
  resetReportStatusState,
} from "@/store/upload-reports/slice";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getDashboardStats } from "../../store/dashboard/api";
import VulnerabilitiesPageClient from "../core/vulnerabilities/vulnerabilities-page";
import Layout from "./layout";

export default function VulnerabilitiesPage() {
  const company_id = import.meta.env.VITE_PUBLIC_COMPANY_ID || "";
  const dispatch = useAppDispatch();

  const { loading, data } = useAppSelector(({ dashboard }) => dashboard.stats);
  const [searchParams] = useSearchParams();

  const product_id = searchParams.get("product") ?? "";
  const asset_id = searchParams.get("asset") ?? "";

  const [source] = useState<VULNERABILITY_DETAILS_SOURCE>(
    VULNERABILITY_DETAILS_SOURCE.VULNERABILITY,
  );

  const { reportId } = useAppSelector((state) => state.uploadReport);
  const { data: reportData } = useAppSelector(
    (state) => state.uploadReport.reportStatus,
  );

  const [initialLoad, setInitialLoad] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    const handleReportStatus = (status: string) => {
      if (status === "Done") {
        toast({
          title:
            "The analysis has been successfully completed. You can now review all the vulnerabilities.",
        });
        setTimeout(() => {
          dispatch(resetReportStatusState());
          dispatch(resetReportId());
        }, 4000);
      } else if (status === "Fail") {
        toast({
          title:
            "There was an issue with the analysis. Could you please try again?",
        });
        setTimeout(() => {
          dispatch(resetReportStatusState());
          dispatch(resetReportId());
        }, 4000);
      } else if (status === "Partial Done") {
        toast({
          title:
            "The analysis is partially complete. The review identified vulnerabilities; some data is incomplete.",
        });
        setTimeout(() => {
          dispatch(resetReportStatusState());
          dispatch(resetReportId());
        }, 4000);
      }
    };

    if (initialLoad && (company_id || product_id || asset_id)) {
      dispatch(resetReportStatusState());
      dispatch(resetReportId());
    } else {
      setInitialLoad(true);
    }

    const fetchStats = () => {
      if (company_id || (product_id && asset_id)) {
        dispatch(
          getDashboardStats({
            company_id,
            product_id: product_id,
            asset_id: asset_id,
          }),
        );
      }

      if (reportId) {
        dispatch(fetchReportById(reportId));
      }
    };

    if (company_id || (product_id && asset_id)) {
      if (
        reportData.status === "Done" ||
        reportData.status === "Fail" ||
        reportData.status === "Partial Done"
      ) {
        handleReportStatus(reportData.status);
        return;
      }

      fetchStats();

      if (reportData.status === "In Progress") {
        interval = setInterval(fetchStats, 15000);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [asset_id, product_id, company_id, dispatch, reportData.status]);

  return (
    <Layout>
      <VulnerabilitiesPageClient
        loading={loading}
        data={data}
        source={source}
      />
    </Layout>
  );
}
