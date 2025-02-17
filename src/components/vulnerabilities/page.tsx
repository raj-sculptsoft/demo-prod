import config from "@/config/env";
import { useAppDispatch, useAppSelector } from "@/hooks/use-store";
import { toast } from "@/hooks/use-toast";
import { VULNERABILITY_DETAILS_SOURCE } from "@/lib/common";
import { fetchStatusById } from "@/store/settings/api";
import { resetStatusId, resetStatusReportState } from "@/store/settings/slice";
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
  const company_id = config.COMPANY_ID || "";
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

  const statusId = useAppSelector((state) => state.synk.statusId);
  const { data: statusReportData, message } = useAppSelector(
    (state) => state.synk.statusReport,
  );

  const [initialLoad, setInitialLoad] = useState(false);
  const [firstLoading, setFirstLoading] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    const handleReportStatus = (status: string) => {
      if (status === "Done") {
        toast({
          title:
            "The analysis has been successfully completed. You can now review all the vulnerabilities.",
        });
        setTimeout(() => {
          setFirstLoading(true);
          dispatch(resetReportStatusState());
          dispatch(resetReportId());

          dispatch(resetStatusReportState());
          dispatch(resetStatusId());
        }, 4000);
      } else if (status === "Fail") {
        toast({
          title:
            "There was an issue with the analysis. Could you please try again?",
        });
        setTimeout(() => {
          setFirstLoading(true);
          dispatch(resetReportStatusState());
          dispatch(resetReportId());

          dispatch(resetStatusReportState());
          dispatch(resetStatusId());
        }, 4000);
      } else if (status === "Partial Done") {
        if (statusReportData) {
          toast({
            title: message,
          });
        } else {
          toast({
            title:
              "The analysis is partially complete. The review identified vulnerabilities; some data is incomplete.",
          });
        }
        setTimeout(() => {
          setFirstLoading(true);
          dispatch(resetReportStatusState());
          dispatch(resetReportId());

          dispatch(resetStatusReportState());
          dispatch(resetStatusId());
        }, 4000);
      }
    };

    if (initialLoad && (company_id || product_id || asset_id)) {
      setFirstLoading(true);
      dispatch(resetReportStatusState());
      dispatch(resetReportId());

      dispatch(resetStatusReportState());
      dispatch(resetStatusId());
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
      if (statusId) {
        dispatch(fetchStatusById(statusId));
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

      if (
        statusReportData.status === "Done" ||
        statusReportData.status === "Fail" ||
        statusReportData.status === "Partial Done"
      ) {
        handleReportStatus(statusReportData.status);
        return;
      }

      fetchStats();

      if (reportData.status === "In Progress") {
        setFirstLoading(false);
        interval = setInterval(fetchStats, 15000);
      }

      if (statusReportData.status === "In Progress") {
        setFirstLoading(false);
        interval = setInterval(fetchStats, 15000);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [
    asset_id,
    product_id,
    company_id,
    dispatch,
    reportData.status,
    statusReportData.status,
  ]);

  return (
    <Layout>
      <VulnerabilitiesPageClient
        loading={loading && firstLoading}
        data={data}
        source={source}
      />
    </Layout>
  );
}
