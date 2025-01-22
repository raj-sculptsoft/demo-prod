import CustomButton from "@/components/core/custom-button";
import FormInput from "@/components/core/form-fields/input";
import { FormSelect } from "@/components/core/form-fields/select";
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
import FormSchema from "@/schemas/assets";
import { addOrEditAsset } from "@/store/assets/api";
import { clearEditDetails, setShowAssetForm } from "@/store/assets/slice";
import { getListForTable } from "@/store/common/api";
import { setPage } from "@/store/common/slice";
import { Asset } from "@/types/assets";
import { StaticSelectOptions } from "@/types/common";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useSearchParams } from "react-router-dom"; // Updated imports
import { z } from "zod";

export default function AssetForm() {
  const open = useAppSelector(({ assets }) => assets.showAssetForm);
  const dispatch = useAppDispatch();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      asset_name: "",
      program_language: "",
    },
  });

  const { data: editData } = useAppSelector(({ assets }) => assets.editDetails);

  const { loading: submitLoading } = useAppSelector(
    ({ assets }) => assets.addOrEditAsset,
  );

  const { sorting, page, rowsPerPage } = useAppSelector(
    ({ common }) => common.dataTable,
  );
  const { column, direction } = sorting;
  const [searchParams] = useSearchParams(); // Fix: Destructure the first element
  const search = searchParams.get("assetSearch");
  const { productId } = useParams(); // Using react-router-dom's useParams

  const {
    loading,
    data: { list: programmingLanguagesList },
  } = useAppSelector(({ common }) => common.formSelectOptions);

  const { reset } = form;
  const editFormData = editData && Object.keys(editData).length > 0;

  useEffect(() => {
    if (editFormData) {
      reset(editData);
    } else {
      reset({
        asset_name: "",
        program_language: "",
      });
    }
  }, [editFormData, reset, editData]);

  const onClose = (open: boolean) => {
    reset({
      asset_name: "",
      program_language: "",
    });
    dispatch(clearEditDetails());
    dispatch(setShowAssetForm(open));
  };

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const payload = editData
        ? {
            ...data,
            asset_id: (editData as Asset).asset_id,
            product_id: productId,
          }
        : { ...data, product_id: productId };

      const { message } = await dispatch(addOrEditAsset(payload)).unwrap();
      toast({ title: message });
      onClose(false);
      if (page === 1 || editFormData) {
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
            {editFormData ? "Edit Asset" : "Add Asset"}
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
                  Technical Stack
                </p>
                <FormInput
                  label="Asset Name"
                  name="asset_name"
                  placeholder="Asset Name"
                />

                <FormSelect
                  name="program_language"
                  label="Programming Languages"
                  placeholder="Programming Languages"
                  isLoading={loading}
                  options={getSelectOptions<StaticSelectOptions>(
                    programmingLanguagesList,
                    "master_enum_name",
                    "master_enum_uuid",
                  )}
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
