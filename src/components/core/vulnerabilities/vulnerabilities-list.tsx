import MultiPage from "@/assets/icons/multi-page";
import RowSkeleton from "@/components/core/data-table/row-skeleton";
import SortIcon from "@/components/core/data-table/sort-icon";
import DataTable from "@/components/core/data-table/table";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableHead, TableRow } from "@/components/ui/table";
import { useAppDispatch, useAppSelector } from "@/hooks/use-store";
import { VULNERABILITY_DETAILS_SOURCE } from "@/lib/common";
import { getFormattedDate } from "@/lib/date";
import { getListForTable } from "@/store/common/api";
import { resetTableData, setPage, setSorting } from "@/store/common/slice";
import { resetStatusReportState } from "@/store/settings/slice";
import { resetReportStatusState } from "@/store/upload-reports/slice";
import { Asset } from "@/types/assets";
import { Product } from "@/types/products";
import { Vulnerability } from "@/types/vulnerability";
import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CustomTooltip from "../tooltip";

export default function VulnerabilitiesList({
  source,
}: {
  source: VULNERABILITY_DETAILS_SOURCE;
}) {
  const dispatch = useAppDispatch();
  const { assetId: paramAssetId } = useParams<{ assetId: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const search = searchParams.get("productSearch");
  const positivity_filter = searchParams.get("type") ?? "False";
  const productId = searchParams.get("product");
  const queryAssetId = searchParams.get("asset");

  const assetId = paramAssetId ?? queryAssetId ?? null;

  const {
    sorting,
    data: { list = [] },
    page,
    rowsPerPage,
  } = useAppSelector(({ common }) => common.dataTable);
  const { column, direction } = sorting;

  const columns = React.useMemo(() => {
    const baseColumns = [
      { key: "id", label: "ID" },
      { key: "file_name", label: "File Name" },
      { key: "vulnerability", label: "Vulnerability" },
      { key: "severity", label: "Severity" },
      { key: "confidence_score", label: "Confidence Score" },
      { key: "cwe", label: "CWE" },
      { key: "cve", label: "CVE" },
      { key: "created_at", label: "Reported Date/Time" },
      { key: "updated_at", label: "Last Updated Date/Time" },
      { key: "assets", label: "Asset" },
      { key: "products", label: "Product" },
    ];
    return positivity_filter === "True"
      ? baseColumns.filter((column) => column.key !== "confidence_score")
      : baseColumns;
  }, [positivity_filter]);

  useEffect(() => {
    dispatch(setPage(1));
  }, [search, dispatch, positivity_filter, assetId, productId]);

  const { data: reportData } = useAppSelector(
    (state) => state.uploadReport.reportStatus,
  );

  const { data: statusReportData } = useAppSelector(
    (state) => state.synk.statusReport,
  );

  const [initialLoad, setInitialLoad] = useState(false);
  const [firstLoading, setFirstLoading] = useState(true);

  useEffect(() => {
    if (initialLoad && (productId || assetId)) {
      setFirstLoading(true);
      dispatch(resetReportStatusState());

      dispatch(resetStatusReportState());
    } else {
      setInitialLoad(true);
    }

    // Function to trigger the API call
    const fetchListForTable = () => {
      dispatch(
        getListForTable({
          request: "Vulnerability/List",
          payload: {
            search,
            positivity_filter: positivity_filter ?? null,
            order_by: column,
            sort_by: direction,
            page_index: page,
            page_size: rowsPerPage,
            asset_id: assetId,
            product_id: productId,
          },
        }),
      );
    };

    if (reportData.status === "In Progress") {
      setFirstLoading(false);
      const interval = setInterval(fetchListForTable, 15000);

      return () => clearInterval(interval);
    } else {
      fetchListForTable();
    }

    if (statusReportData.status === "In Progress") {
      setFirstLoading(false);
      const interval = setInterval(fetchListForTable, 15000);

      return () => clearInterval(interval);
    } else {
      fetchListForTable();
    }

    return () => {};
  }, [
    statusReportData.status,
    reportData.status,
    column,
    direction,
    dispatch,
    page,
    rowsPerPage,
    search,
    assetId,
    positivity_filter,
    productId,
  ]);

  useEffect(() => {
    return () => {
      dispatch(resetTableData());
    };
  }, [dispatch]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [list]);

  const onViewDetails = useCallback(
    (
      { product_id }: Product,
      { asset_id }: Asset,
      { vulnerability_id }: Vulnerability,
    ) => {
      const navigateTo =
        source === VULNERABILITY_DETAILS_SOURCE.PRODUCT
          ? `/product/${product_id}/asset/${asset_id}/vulnerability/${vulnerability_id}/details`
          : `/vulnerability/product/${product_id}/asset/${asset_id}/vulnerability/${vulnerability_id}/details`;

      navigate(navigateTo);
    },
    [navigate, source],
  );

  const capitalizeFirstLetter = (str: string | undefined) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const headers = React.useMemo(
    () => (
      <>
        <TableHead className="max-w-28 px-2 font-medium">Action</TableHead>
        {columns.map((column) => (
          <TableHead
            key={column.key}
            className="max-w-28 cursor-pointer px-2 font-medium"
            onClick={() =>
              dispatch(
                setSorting({
                  column: column.key,
                  direction: sorting.direction === "asc" ? "desc" : "asc",
                }),
              )
            }
          >
            <div className="flex items-center gap-1">
              {column.label} <SortIcon column={column.key} />
            </div>
          </TableHead>
        ))}
      </>
    ),
    [dispatch, sorting.direction, columns],
  );

  const body = React.useMemo(
    () =>
      (list as Vulnerability[]).map((item) => {
        return (
          <TableRow
            key={item.vulnerability_id}
            className="cursor-pointer"
            onClick={() =>
              onViewDetails(item.assets.products, item.assets, item)
            }
          >
            <TableCell className="max-w-28 pl-1">
              <CustomTooltip
                trigger={
                  <div className="cursor-pointer pl-4">
                    <MultiPage
                      className="pl-2"
                      onClick={() =>
                        onViewDetails(item.assets.products, item.assets, item)
                      }
                    />
                  </div>
                }
                triggerAsChild
                content={"View Vulnerabilities Details"}
                contentWrapperClassName="bg-secondary border-0 text-white"
              />
            </TableCell>
            {columns.map((column) => {
              const value = item[column.key as keyof Vulnerability];
              const impactColor = {
                Critical: "border-red bg-red-lighter text-red",
                High: "border-orange-chart bg-orange-lighter text-orange-chart",
                Medium: "border-yellow bg-yellow-light text-yellow",
                Low: "border-green bg-green-lighter text-green",
              };
              const key = column.key;
              switch (key) {
                case "products": {
                  return (
                    <TableCell
                      key={`${item.vulnerability_id}-${column.key}`}
                      className="max-w-20 overflow-hidden text-ellipsis whitespace-nowrap break-keep px-2"
                    >
                      <CustomTooltip
                        trigger={
                          <span className="block overflow-hidden text-ellipsis whitespace-nowrap">
                            {item?.assets?.products?.product_name}
                          </span>
                        }
                        triggerAsChild
                        content={item?.assets?.products?.product_name}
                        contentWrapperClassName="bg-secondary border-0 text-white"
                      />
                    </TableCell>
                  );
                }

                case "assets": {
                  return (
                    <TableCell
                      key={`${item.vulnerability_id}-${column.key}`}
                      className="max-w-20 overflow-hidden text-ellipsis whitespace-nowrap break-keep px-2"
                    >
                      <CustomTooltip
                        trigger={
                          <span className="block overflow-hidden text-ellipsis whitespace-nowrap">
                            {item?.assets?.asset_name}
                          </span>
                        }
                        triggerAsChild
                        content={item?.assets?.asset_name}
                        contentWrapperClassName="bg-secondary border-0 text-white"
                      />
                    </TableCell>
                  );
                }
                case "created_at": {
                  const formattedDateTime = getFormattedDate(
                    value as Vulnerability["created_at"],
                  );
                  const [date, time] = formattedDateTime.split(" ");
                  return (
                    <TableCell
                      key={`${item.vulnerability_id}-${column.key}`}
                      className="max-w-20 px-2"
                    >
                      <div>{date}</div>
                      <div className="text-sm">{time}</div>{" "}
                    </TableCell>
                  );
                }

                case "updated_at": {
                  const formattedDateTime = getFormattedDate(
                    value as Vulnerability["updated_at"],
                  );
                  const [date, time] = formattedDateTime.split(" ");

                  return (
                    <TableCell
                      key={`${item.vulnerability_id}-${column.key}`}
                      className="max-w-20 px-2"
                    >
                      <div>{date}</div>
                      <div className="text-sm">{time}</div>{" "}
                    </TableCell>
                  );
                }

                case "severity": {
                  const severity = capitalizeFirstLetter(
                    value as Vulnerability["severity"],
                  );
                  return (
                    <TableCell
                      key={`${item.vulnerability_id}-${column.key}`}
                      className="max-w-28 px-2"
                    >
                      {severity ? (
                        <Badge
                          variant="outline"
                          className={
                            impactColor[severity as keyof typeof impactColor]
                          }
                        >
                          {severity}
                        </Badge>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                  );
                }
                case "confidence_score": {
                  return (
                    <TableCell
                      key={`${item.vulnerability_id}-${column.key}`}
                      className="max-w-28 px-2"
                    >
                      {value !== undefined && value !== null
                        ? `${value as ReactNode}%`
                        : "N/A"}
                    </TableCell>
                  );
                }
                case "cve": {
                  return (
                    <TableCell
                      key={`${item.vulnerability_id}-${column.key}`}
                      className="max-w-32 overflow-hidden text-ellipsis whitespace-nowrap px-2"
                    >
                      {value !== undefined &&
                      value !== null &&
                      value !== "" &&
                      value !== "N/A"
                        ? (value as ReactNode)
                        : "No CVE assigned"}
                    </TableCell>
                  );
                }
                case "cwe": {
                  return (
                    <TableCell
                      key={`${item.vulnerability_id}-${column.key}`}
                      className="max-w-32 overflow-hidden text-ellipsis whitespace-nowrap px-2"
                    >
                      {value !== undefined &&
                      value !== null &&
                      value !== "" &&
                      value !== "N/A"
                        ? (value as ReactNode)
                        : "No CWE assigned"}
                    </TableCell>
                  );
                }
                default:
                  return (
                    <TableCell
                      key={`${item.vulnerability_id}-${column.key}`}
                      className="max-w-32 overflow-hidden text-ellipsis whitespace-nowrap px-2"
                    >
                      {value !== undefined && value !== null && value !== ""
                        ? (value as ReactNode)
                        : "N/A"}
                    </TableCell>
                  );
              }
            })}
          </TableRow>
        );
      }),
    [list, onViewDetails, columns],
  );

  return (
    <DataTable
      headers={headers}
      body={body}
      noOfColumns={columns.length + 1}
      rowSkeleton={<RowSkeleton noOfColumns={columns.length + 1} />}
      firstLoading={firstLoading}
    />
  );
}
