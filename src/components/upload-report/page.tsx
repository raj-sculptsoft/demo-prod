"use client";

import CustomButton from "@/components/core/custom-button";
import FormFileUpload from "@/components/core/form-fields/file-upload";
import { FormSelect } from "@/components/core/form-fields/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import config from "@/config/env";
import { useAppDispatch, useAppSelector } from "@/hooks/use-store";
import { toast } from "@/hooks/use-toast";
import {
  defaultPayloadForWithoutPagination,
  getSelectOptions,
} from "@/lib/common";
import { IError } from "@/lib/fetcher/types";
import FormSchema from "@/schemas/upload-report";
import { getAllProducts, getAssetsByProduct } from "@/store/common/api";
import { fetchReportById, uploadReport } from "@/store/upload-reports/api";
import { setReportId } from "@/store/upload-reports/slice";
import { Asset } from "@/types/assets";
import { Product } from "@/types/products";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import Layout from "./layout";

export default function UploadReport() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      product_id: "",
      asset_id: "",
      file: null,
    },
  });

  const { watch, resetField, reset } = form;

  const { loading: productsLoading, data: { list: productsList = [] } = {} } =
    useAppSelector(({ common }) => common.products);

  const { loading: assetsLoading, data: { list: assetsList = [] } = {} } =
    useAppSelector(({ common }) => common.assets);

  const { loading: formLoading } = useAppSelector(
    ({ uploadReport }) => uploadReport.uploadReport,
  );

  useEffect(() => {
    dispatch(
      getAllProducts({
        company_id: config.COMPANY_ID,
        ...defaultPayloadForWithoutPagination,
      }),
    );
  }, [dispatch]);

  function onProductChange(product_id: string) {
    resetField("asset_id");
    dispatch(
      getAssetsByProduct({
        product_id,
        ...defaultPayloadForWithoutPagination,
      }),
    );
  }

  // Sort lists using useMemo to avoid unnecessary re-sorting
  const sortedProductsList = useMemo(() => {
    if (!productsList?.length) return [];
    return [...productsList].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  }, [productsList]);

  const sortedAssetsList = useMemo(() => {
    if (!assetsList?.length) return [];
    return [...assetsList].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  }, [assetsList]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const formData = new FormData();
    for (const [key, value] of Object.entries(data)) {
      formData.append(key, value);
    }
    try {
      const { data } = await dispatch(uploadReport(formData)).unwrap();
      // toast({ title: message });
      dispatch(setReportId(data.report_id));
      await dispatch(fetchReportById(data.report_id));
      navigate(
        `/vulnerabilities?product=${data.product_id}&asset=${data.asset_id}`,
      );
      reset();
    } catch (error) {
      toast({
        title: (error as IError)?.message ?? "Something went wrong",
        variant: "destructive",
      });
    }
  }

  return (
    <Layout
      children={
        <Card>
          <CardHeader className="border-b p-4">
            <CardTitle className="text-lg font-semibold">
              Upload Scanned Report
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 py-7">
            <Form {...form}>
              <form
                id="upload-report-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid grid-cols-2 gap-x-4 gap-y-5"
              >
                <FormSelect
                  name="product_id"
                  label="Select Product"
                  placeholder="Select Product"
                  isLoading={productsLoading}
                  options={getSelectOptions<Product>(
                    sortedProductsList.map((item) => ({
                      ...item,
                      product_name:
                        item.product_name.length > 70
                          ? `${item.product_name.slice(0, 70)}...`
                          : item.product_name,
                    })),
                    "product_name",
                    "product_id",
                  )}
                  onChange={onProductChange}
                />
                <FormSelect
                  name="asset_id"
                  label="Select Asset"
                  placeholder="Select Asset"
                  isLoading={assetsLoading}
                  disabled={!watch("product_id")}
                  options={getSelectOptions<Asset>(
                    sortedAssetsList.map((item) => ({
                      ...item,
                      asset_name:
                        item.asset_name.length > 70
                          ? `${item.asset_name.slice(0, 70)}...`
                          : item.asset_name,
                    })),
                    "asset_name",
                    "asset_id",
                  )}
                />
                <FormFileUpload
                  name="file"
                  label="Upload Scanned Report"
                  acceptedFiles=".pdf, .csv, .json"
                  description="Supported Formats: PDF, CSV or Json file "
                />
              </form>
            </Form>
          </CardContent>
          <CardFooter className="mt-6 block text-center">
            <CustomButton
              className="px-14"
              type="submit"
              form="upload-report-form"
              isLoading={formLoading}
            >
              Scan
            </CustomButton>
          </CardFooter>
        </Card>
      }
    />
  );
}
