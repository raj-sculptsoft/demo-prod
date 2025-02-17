import Info from "@/assets/icons/info";
import CustomButton from "@/components/core/custom-button";
import ConfirmationDialog from "@/components/core/dialog";
import FormInput from "@/components/core/form-fields/input";
import { FormSelect } from "@/components/core/form-fields/select";
import FormTextArea from "@/components/core/form-fields/text-area";
import CustomTooltip from "@/components/core/tooltip";
import { Form } from "@/components/ui/form";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import config from "@/config/env";
import { useAppDispatch, useAppSelector } from "@/hooks/use-store";
import { toast } from "@/hooks/use-toast";
import { getSelectOptions } from "@/lib/common";
import { IError } from "@/lib/fetcher/types";
import FormSchema from "@/schemas/product";
import { setShowAssetForm } from "@/store/assets/slice";
import { getListForTable } from "@/store/common/api";
import { setPage } from "@/store/common/slice";
import { addOrEditProduct } from "@/store/products/api";
import { clearEditDetails, setShowProductForm } from "@/store/products/slice";
import { StaticSelectOptions } from "@/types/common";
import { Product } from "@/types/products";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";

export default function ProductForm() {
  const open = useAppSelector(({ products }) => products.showProductForm);
  const {
    loading: loadingTarget,
    data: { list: targetAudiencesList },
  } = useAppSelector(({ common }) => common.formSelectOptions);

  const {
    loading: loadingProductLive,
    data: { list: productLiveList },
  } = useAppSelector(({ common }) => common.formSelectProductOptions);

  const {
    loading: loadingRevenueImpact,
    data: { list: revenueImpactList },
  } = useAppSelector(({ common }) => common.formSelectRevenueOptions);

  const {
    loading: loadingCustomerDataType,
    data: { list: customerDataTypeList },
  } = useAppSelector(({ common }) => common.formSelectCustomerOptions);

  const {
    loading: loadingComplianceRequired,
    data: { list: complianceRequiredList },
  } = useAppSelector(({ common }) => common.formSelectComplianceOptions);

  const {
    loading: loadingDependencyImpact,
    data: { list: dependencyImpactList },
  } = useAppSelector(({ common }) => common.formSelectDependencyOptions);

  const { data: editData } = useAppSelector(
    ({ products }) => products.editDetails,
  );

  const { loading: submitLoading } = useAppSelector(
    ({ products }) => products.addOrEditProduct,
  );

  const { sorting, page, rowsPerPage } = useAppSelector(
    ({ common }) => common.dataTable,
  );

  const { column, direction } = sorting;

  const [searchParams] = useSearchParams();
  const search = searchParams.get("productSearch");
  const [showDialog, setShowDialog] = useState(false);
  const [productData, setProductData] = useState("");
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      product_name: "",
      product_description: "",
      product_domain: "",
      target_audience: "",
      product_live: "",
      revenue_impact: "",
      customer_data_type: "",
      compliance_required: "",
      dependency_impact: "",
      system_architech: "",
    },
  });

  const { reset } = form;
  const editFormData = editData && Object.keys(editData).length > 0;

  useEffect(() => {
    if (editFormData) {
      reset({
        product_name: editData?.product_name ?? "",
        product_description: editData?.product_description ?? "",
        product_domain: editData?.product_domain ?? "",
        target_audience: editData?.target_audience ?? "",
        product_live: editData?.product_live ?? "",
        revenue_impact: editData?.revenue_impact ?? "",
        customer_data_type: editData?.customer_data_type ?? "",
        compliance_required: editData?.compliance_required ?? "",
        dependency_impact: editData?.dependency_impact ?? "",
        system_architech: editData?.system_architech ?? "",
      });
    } else {
      reset({
        product_name: "",
        product_description: "",
        product_domain: "",
        target_audience: "",
        product_live: "",
        revenue_impact: "",
        customer_data_type: "",
        compliance_required: "",
        dependency_impact: "",
        system_architech: "",
      });
    }
  }, [editFormData, reset, editData]);

  const onClose = (open: boolean) => {
    reset({
      product_name: "",
      product_description: "",
      product_domain: "",
      target_audience: "",
      product_live: "",
      revenue_impact: "",
      customer_data_type: "",
      compliance_required: "",
      dependency_impact: "",
      system_architech: "",
    });
    dispatch(clearEditDetails());
    dispatch(setShowProductForm(open));
  };

  const handleDialogConfirm = () => {
    navigate(`/product/${productData}/assets`);
    dispatch(setShowAssetForm(true));
  };

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const company_id = config.COMPANY_ID;

      // Convert empty string values to null for optional fields
      const cleanedData = {
        ...data,
        product_live: data.product_live || null,
        revenue_impact: data.revenue_impact || null,
        customer_data_type: data.customer_data_type || null,
        compliance_required: data.compliance_required || null,
        dependency_impact: data.dependency_impact || null,
        system_architech: data.system_architech || null,
      };

      const payload = editData
        ? {
            ...cleanedData,
            product_id: (editData as Product).product_id,
            company_id,
          }
        : { ...cleanedData, company_id };

      const { data: productData, message } = await dispatch(
        addOrEditProduct(payload),
      ).unwrap();
      setProductData(productData.product_id);

      if (editData) {
        toast({ title: message });
      }

      if (!editData) {
        setShowDialog(true);
      }

      onClose(false);

      if (page === 1 || editFormData) {
        dispatch(
          getListForTable({
            request: "Product/List",
            payload: {
              search: search,
              order_by: column,
              sort_by: direction,
              page_index: page,
              page_size: rowsPerPage,
              company_id,
            },
          }),
        );
      } else {
        dispatch(setPage(1));
      }
    } catch (error) {
      toast({
        title: (error as IError)?.message ?? "Something went wrong",
        variant: "destructive",
      });
    }
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(open) => {
        onClose(open);
      }}
    >
      <SheetContent className="flex h-full flex-col p-0 md:max-w-md">
        <SheetHeader className="border-b p-6 pb-4">
          <SheetTitle className="text-lg font-bold">
            {editFormData ? "Edit Product" : "Add Product"}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-4">
            <Form {...form}>
              <form
                id="product-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-y-5"
              >
                <p className="text-lg font-bold text-borderColor-dark">
                  Product Overview
                </p>
                <FormInput
                  label="Product Name"
                  name="product_name"
                  placeholder="Product Name"
                />
                <FormTextArea
                  name="product_description"
                  label="Product Description"
                  placeholder="Product Description"
                />

                <FormInput
                  label="Business Domain"
                  name="product_domain"
                  placeholder="Business Domain"
                />
                <FormSelect
                  name="target_audience"
                  label="Target Audience"
                  placeholder="Target Audience"
                  isLoading={loadingTarget}
                  options={getSelectOptions<StaticSelectOptions>(
                    targetAudiencesList.map((item) => ({
                      ...item,
                      master_enum_name:
                        item.master_enum_name.length > 50
                          ? `${item.master_enum_name.slice(0, 50)}...`
                          : item.master_enum_name,
                    })),

                    "master_enum_name",
                    "master_enum_uuid",
                  )}
                />

                <FormSelect
                  name="product_live"
                  label="Is this Product live and available for external customers to use?"
                  placeholder="Product Live"
                  isLoading={loadingProductLive}
                  options={getSelectOptions<StaticSelectOptions>(
                    productLiveList.map((item) => ({
                      ...item,
                      master_enum_name:
                        item.master_enum_name.length > 50
                          ? `${item.master_enum_name.slice(0, 50)}...`
                          : item.master_enum_name,
                    })),

                    "master_enum_name",
                    "master_enum_uuid",
                  )}
                />

                <FormSelect
                  name="revenue_impact"
                  label="What is approximate revenue contribution from this product?"
                  placeholder="Revenue Impact "
                  isLoading={loadingRevenueImpact}
                  options={getSelectOptions<StaticSelectOptions>(
                    revenueImpactList.map((item) => ({
                      ...item,
                      master_enum_name:
                        item.master_enum_name.length > 50
                          ? `${item.master_enum_name.slice(0, 50)}...`
                          : item.master_enum_name,
                    })),

                    "master_enum_name",
                    "master_enum_uuid",
                  )}
                />

                <FormSelect
                  name="customer_data_type"
                  label="Does this product store or process customer data?"
                  placeholder="Customer Data_Type "
                  isLoading={loadingCustomerDataType}
                  options={getSelectOptions<StaticSelectOptions>(
                    customerDataTypeList.map((item) => ({
                      ...item,
                      master_enum_name:
                        item.master_enum_name.length > 50
                          ? `${item.master_enum_name.slice(0, 50)}...`
                          : item.master_enum_name,
                    })),

                    "master_enum_name",
                    "master_enum_uuid",
                  )}
                />

                <FormSelect
                  name="compliance_required"
                  label="Are there any compliance requirements associated with this product?"
                  placeholder="Compliance Required "
                  isLoading={loadingComplianceRequired}
                  options={getSelectOptions<StaticSelectOptions>(
                    complianceRequiredList.map((item) => ({
                      ...item,
                      master_enum_name:
                        item.master_enum_name.length > 50
                          ? `${item.master_enum_name.slice(0, 50)}...`
                          : item.master_enum_name,
                    })),

                    "master_enum_name",
                    "master_enum_uuid",
                  )}
                />

                <FormSelect
                  name="dependency_impact"
                  label="Can this product impact one or more upstream or downstream products due to dependencies?"
                  placeholder="Dependency Impact"
                  isLoading={loadingDependencyImpact}
                  options={getSelectOptions<StaticSelectOptions>(
                    dependencyImpactList.map((item) => ({
                      ...item,
                      master_enum_name: item.master_enum_name
                        ? `${item.master_enum_name.charAt(0).toUpperCase()}${item.master_enum_name.slice(1)}`.slice(
                            0,
                            50,
                          ) + (item.master_enum_name.length > 50 ? "..." : "")
                        : "",
                    })),
                    "master_enum_name",
                    "master_enum_uuid",
                  )}
                />

                <p className="hidden text-lg font-bold text-borderColor-dark">
                  Architecture
                </p>

                <div className="flex hidden flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium">
                      System Architecture
                    </label>
                    <CustomTooltip
                      trigger={
                        <div className="cursor-pointer">
                          <Info className="text-secondary" />
                        </div>
                      }
                      triggerAsChild
                      content={
                        "Provide a brief overview of how the frontend and backend interact, including key components like databases, APIs, authentication, caching, and background processes if applicable."
                      }
                      contentWrapperClassName="bg-secondary border-0 text-white"
                      maxWidth={"300px"}
                    />
                  </div>
                  <FormTextArea
                    name="system_architech"
                    placeholder="System Architecture"
                  />
                </div>
              </form>
            </Form>
          </div>
        </div>

        <SheetFooter className="bg-background sticky bottom-0 z-10 border-t px-6 py-4">
          <CustomButton
            type="submit"
            form="product-form"
            className="px-12"
            isLoading={submitLoading}
          >
            {editFormData ? "Save" : "Add"}
          </CustomButton>
        </SheetFooter>
      </SheetContent>

      {showDialog && (
        <ConfirmationDialog
          open={true}
          title="Add Assets"
          description="The product is added successfully. Would you like to add assets to this product?"
          onConfirm={handleDialogConfirm}
          onCancel={() => setShowDialog(false)}
          flag={true}
        />
      )}
    </Sheet>
  );
}
