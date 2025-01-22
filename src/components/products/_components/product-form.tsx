import CustomButton from "@/components/core/custom-button";
import FormInput from "@/components/core/form-fields/input";
import { FormSelect } from "@/components/core/form-fields/select";
import FormTextArea from "@/components/core/form-fields/text-area";
import { Form } from "@/components/ui/form";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useAppDispatch, useAppSelector } from "@/hooks/use-store";
import { toast } from "@/hooks/use-toast";
import { getSelectOptions } from "@/lib/common";
import { IError } from "@/lib/fetcher/types";
import FormSchema from "@/schemas/product";
import { getListForTable } from "@/store/common/api";
import { setPage } from "@/store/common/slice";
import { addOrEditProduct } from "@/store/products/api";
import { clearEditDetails, setShowProductForm } from "@/store/products/slice";
import { StaticSelectOptions } from "@/types/common";
import { Product } from "@/types/products";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";

export default function ProductForm() {
  const open = useAppSelector(({ products }) => products.showProductForm);
  const {
    loading,
    data: { list: targetAudiencesList },
  } = useAppSelector(({ common }) => common.formSelectOptions);

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

  const dispatch = useAppDispatch();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      product_name: "",
      product_description: "",
      product_domain: "",
      target_audience: "",
      system_architech: "",
    },
  });

  const { reset } = form;
  const editFormData = editData && Object.keys(editData).length > 0;

  useEffect(() => {
    if (editFormData) {
      reset(editData);
    } else {
      reset({
        product_name: "",
        product_description: "",
        product_domain: "",
        target_audience: "",
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
      system_architech: "",
    });
    dispatch(clearEditDetails());
    dispatch(setShowProductForm(open));
  };

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const company_id = import.meta.env.VITE_PUBLIC_COMPANY_ID;
      const payload = editData
        ? { ...data, product_id: (editData as Product).product_id, company_id } // Include product_id for editing
        : { ...data, company_id };

      const { message } = await dispatch(addOrEditProduct(payload)).unwrap();

      toast({ title: message });
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
                  isLoading={loading}
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

                <p className="text-lg font-bold text-borderColor-dark">
                  Architecture
                </p>

                <FormTextArea
                  name="system_architech"
                  label="System Architecture"
                  placeholder="System Architecture"
                />
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
    </Sheet>
  );
}
