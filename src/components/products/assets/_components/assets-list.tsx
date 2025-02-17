import Delete from "@/assets/icons/delete";
import Edit from "@/assets/icons/edit";
import View from "@/assets/icons/view";
import RowSkeleton from "@/components/core/data-table/row-skeleton";
import SortIcon from "@/components/core/data-table/sort-icon";
import DataTable from "@/components/core/data-table/table";
import { DeleteDialog } from "@/components/core/delete-dialog";
import CustomTooltip from "@/components/core/tooltip";
import { TableCell, TableHead, TableRow } from "@/components/ui/table";
import config from "@/config/env";
import { useAppDispatch, useAppSelector } from "@/hooks/use-store";
import { toast } from "@/hooks/use-toast";
import { getFormattedDate } from "@/lib/date";
import { IError } from "@/lib/fetcher/types";
import { deleteAsset } from "@/store/assets/api";
import { setEditDetails, setShowAssetForm } from "@/store/assets/slice";
import { getListForTable } from "@/store/common/api";
import {
  clearAsset,
  resetTableData,
  setDeleteDialogOptions,
  setPage,
  setSorting,
} from "@/store/common/slice";
import { getProductStats } from "@/store/products/api";
import { Asset } from "@/types/assets";
import React, { useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Updated imports

const columns = [
  { key: "asset_name", label: "Asset Name" },
  { key: "created_at", label: "Created Date/Time" },
  { key: "no_of_file", label: "No. of Files" },
  { key: "no_of_vulnerability", label: "No. of Vulnerabilities" },
];

export default function AssetsList() {
  const dispatch = useAppDispatch();
  const searchParams = new URLSearchParams(window.location.search); // Replacing useSearchParams
  const search = searchParams.get("assetSearch");
  const { productId } = useParams<{ productId: string | undefined }>();
  const navigate = useNavigate();

  const {
    sorting,
    data: { list = [] } = {},
    page,
    rowsPerPage,
  } = useAppSelector(({ common }) => common.dataTable);
  const { column, direction } = sorting;

  const { data: assetDetails } = useAppSelector(
    ({ common }) => common.deleteDialog,
  );

  useEffect(() => {
    dispatch(setPage(1));
  }, [search, dispatch]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [list]);

  useEffect(() => {
    dispatch(
      getListForTable({
        request: "Asset/List",
        payload: {
          search: search,
          order_by: column,
          sort_by: direction,
          page_index: page,
          page_size: rowsPerPage,
          product_id: productId,
        },
      }),
    );
  }, [column, direction, dispatch, page, rowsPerPage, search, productId]);

  useEffect(() => {
    return () => {
      dispatch(resetTableData());
    };
  }, [dispatch]);

  const onDeleteConfirm = async () => {
    try {
      const { message } = await dispatch(
        deleteAsset((assetDetails as Asset).asset_id),
      ).unwrap();

      toast({ title: message });

      const newPage =
        (list as Asset[]).length <= 1 && page > 1 ? page - 1 : page;

      if ((list as Asset[]).length <= 1) {
        dispatch(clearAsset());
      }

      dispatch(setPage(newPage));

      dispatch(
        getListForTable({
          request: "Asset/List",
          payload: {
            search: search,
            order_by: column,
            sort_by: direction,
            page_index: newPage,
            page_size: rowsPerPage,
            product_id: productId,
          },
        }),
      );

      dispatch(getProductStats(config.COMPANY_ID));
    } catch (error) {
      toast({
        title: (error as IError)?.message ?? "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const onEdit = useCallback(
    (asset: Asset) => {
      dispatch(setEditDetails(asset));
      dispatch(setShowAssetForm(true));
    },
    [dispatch],
  );

  const onDelete = useCallback(
    (asset: Asset) => {
      dispatch(
        setDeleteDialogOptions({
          open: true,
          title: "Delete Asset",
          description: "Are you sure want to delete this asset?",
          data: asset,
        }),
      );
    },
    [dispatch],
  );

  const onViewVulnerabilities = useCallback(
    ({ asset_id }: Asset, product_id: string | undefined) => {
      navigate(`/product/${product_id}/asset/${asset_id}/vulnerabilities`);
    },
    [navigate],
  );

  const headers = React.useMemo(
    () => (
      <>
        <TableHead className="w-[250px] font-medium">Action</TableHead>
        {columns.map((column) => (
          <TableHead
            key={column.key}
            className="cursor-pointer font-medium"
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
    [dispatch, sorting.direction],
  );

  const body = React.useMemo(() => {
    // Slice the data to match rowsPerPage
    const visibleList = (list as Asset[]).slice(0, rowsPerPage);

    return visibleList.map((item) => (
      <TableRow key={item.asset_id}>
        <TableCell>
          <div className="flex gap-2">
            <CustomTooltip
              trigger={
                <div
                  className="cursor-pointer"
                  onClick={() => onViewVulnerabilities(item, productId)}
                >
                  <View />
                </div>
              }
              triggerAsChild
              content={"View Vulnerabilities"}
              contentWrapperClassName="bg-secondary border-0 text-white"
            />
            <CustomTooltip
              trigger={
                <div className="cursor-pointer" onClick={() => onEdit(item)}>
                  <Edit />
                </div>
              }
              triggerAsChild
              content={"Edit Asset"}
              contentWrapperClassName="bg-secondary border-0 text-white"
            />
            <CustomTooltip
              trigger={
                <div className="cursor-pointer" onClick={() => onDelete(item)}>
                  <Delete />
                </div>
              }
              triggerAsChild
              content={"Delete Asset"}
              contentWrapperClassName="bg-secondary border-0 text-white"
            />
          </div>
        </TableCell>
        {columns.map((column) => {
          if (column.key === "asset_name") {
            return (
              <TableCell
                key={column.key}
                className="cursor-pointer"
                onClick={() => onViewVulnerabilities(item, productId)}
              >
                {item.asset_name?.length > 30
                  ? `${item.asset_name.slice(0, 30)}...`
                  : item.asset_name}
              </TableCell>
            );
          } else if (column.key === "created_at") {
            return (
              <TableCell
                key={column.key}
                className="cursor-pointer"
                onClick={() => onViewVulnerabilities(item, productId)}
              >
                {getFormattedDate(item.created_at)}
              </TableCell>
            );
          } else {
            return (
              <TableCell
                key={column.key}
                className="cursor-pointer"
                onClick={() => onViewVulnerabilities(item, productId)}
              >
                {item[column.key as keyof (typeof columns)["keys"]]}
              </TableCell>
            );
          }
        })}
      </TableRow>
    ));
  }, [list, rowsPerPage, onDelete, onEdit, onViewVulnerabilities, productId]);

  return (
    <>
      <DataTable
        headers={headers}
        body={body}
        noOfColumns={5}
        rowSkeleton={<RowSkeleton noOfColumns={5} />}
      />
      <DeleteDialog onDeleteConfirm={onDeleteConfirm} />
    </>
  );
}
