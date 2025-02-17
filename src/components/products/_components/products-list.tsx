import config from "@/config/env";
import { getListForTable } from "@/store/common/api";
import { deleteProduct, getProductStats } from "@/store/products/api";
import {
  resetList,
  setEditDetails,
  setShowProductForm,
} from "@/store/products/slice";
import React, { useCallback, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Delete from "../../../assets/icons/delete";
import Edit from "../../../assets/icons/edit";
import View from "../../../assets/icons/view";
import RowSkeleton from "../../../components/core/data-table/row-skeleton";
import SortIcon from "../../../components/core/data-table/sort-icon";
import DataTable from "../../../components/core/data-table/table";
import { DeleteDialog } from "../../../components/core/delete-dialog";
import CustomTooltip from "../../../components/core/tooltip";
import { TableCell, TableHead, TableRow } from "../../../components/ui/table";
import { useAppDispatch, useAppSelector } from "../../../hooks/use-store";
import { toast } from "../../../hooks/use-toast";
import { getFormattedDate } from "../../../lib/date";
import { IError } from "../../../lib/fetcher/types";
import {
  resetTableData,
  setDeleteDialogOptions,
  setPage,
  setSorting,
} from "../../../store/common/slice";
import { Product } from "../../../types/products";

const columns = [
  { key: "product_name", label: "Product Name" },
  { key: "created_at", label: "Created Date/Time" },
  { key: "no_of_asset", label: "No. of Assets" },
];

export default function ProductsList() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const productSearch = searchParams.get("productSearch");

  const {
    sorting,
    data: { list = [] } = {},
    page,
    rowsPerPage,
  } = useAppSelector(({ common }) => common.dataTable);
  const { column, direction } = sorting;

  const { data: productDetails } = useAppSelector(
    ({ common }) => common.deleteDialog,
  );

  useEffect(() => {
    dispatch(setPage(1));
  }, [productSearch, dispatch]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [list]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(
        getListForTable({
          request: "Product/List",
          payload: {
            search: productSearch,
            order_by: column,
            sort_by: direction,
            page_index: page,
            page_size: rowsPerPage,
            company_id: config.COMPANY_ID,
          },
        }),
      );
    }, 50);

    return () => clearTimeout(timeout);
  }, [column, direction, dispatch, page, rowsPerPage, productSearch]);

  useEffect(() => {
    return () => {
      dispatch(resetTableData());
      dispatch(resetList());
    };
  }, [dispatch]);

  const onDeleteConfirm = async () => {
    try {
      const { message } = await dispatch(
        deleteProduct((productDetails as Product).product_id),
      ).unwrap();

      toast({ title: message });

      const newPage =
        (list as Product[]).length <= 1 && page > 1 ? page - 1 : page;

      dispatch(setPage(newPage));

      dispatch(
        getListForTable({
          request: "Product/List",
          payload: {
            search: productSearch,
            order_by: column,
            sort_by: direction,
            page_index: newPage,
            page_size: rowsPerPage,
            company_id: config.COMPANY_ID,
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
    (product: Product) => {
      dispatch(setEditDetails(product));
      dispatch(setShowProductForm(true));
    },
    [dispatch],
  );

  const onDelete = useCallback(
    (product: Product) => {
      dispatch(
        setDeleteDialogOptions({
          open: true,
          title: "Delete Product",
          description: "Are you sure want to delete this product?",
          data: product,
        }),
      );
    },
    [dispatch],
  );

  const onViewAssets = useCallback(
    ({ product_id }: Product) => {
      navigate(`/product/${product_id}/assets`);
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

  const body = React.useMemo(
    () =>
      (list as Product[]).map((item) => (
        <TableRow key={item.product_id}>
          <TableCell>
            <div className="flex gap-2">
              <CustomTooltip
                trigger={
                  <div
                    className="cursor-pointer"
                    onClick={() => onViewAssets(item)}
                  >
                    <View />
                  </div>
                }
                triggerAsChild
                content={"View Assets"}
                contentWrapperClassName="bg-secondary border-0 text-white"
              />
              <CustomTooltip
                trigger={
                  <div className="cursor-pointer" onClick={() => onEdit(item)}>
                    <Edit />
                  </div>
                }
                triggerAsChild
                content={"Edit Product"}
                contentWrapperClassName="bg-secondary border-0 text-white"
              />
              <CustomTooltip
                trigger={
                  <div
                    className="cursor-pointer"
                    onClick={() => onDelete(item)}
                  >
                    <Delete />
                  </div>
                }
                triggerAsChild
                content={"Delete Product"}
                contentWrapperClassName="bg-secondary border-0 text-white"
              />
            </div>
          </TableCell>
          {columns.map((column) => {
            if (column.key === "product_name") {
              return (
                <TableCell
                  key={column.key}
                  className="cursor-pointer"
                  onClick={() => onViewAssets(item)}
                >
                  {item.product_name?.length > 30
                    ? `${item.product_name.slice(0, 30)}...`
                    : item.product_name}
                </TableCell>
              );
            } else if (column.key === "created_at") {
              return (
                <TableCell
                  key={column.key}
                  className="cursor-pointer"
                  onClick={() => onViewAssets(item)}
                >
                  {getFormattedDate(item.created_at)}
                </TableCell>
              );
            } else {
              return (
                <TableCell
                  key={column.key}
                  className="cursor-pointer"
                  onClick={() => onViewAssets(item)}
                >
                  {item[column.key as keyof (typeof columns)["keys"]] ?? "-"}
                </TableCell>
              );
            }
          })}
        </TableRow>
      )),
    [list, onDelete, onEdit, onViewAssets],
  );

  return (
    <>
      <DataTable
        headers={headers}
        body={body}
        noOfColumns={4}
        rowSkeleton={<RowSkeleton />}
      />
      <DeleteDialog onDeleteConfirm={onDeleteConfirm} />
    </>
  );
}
