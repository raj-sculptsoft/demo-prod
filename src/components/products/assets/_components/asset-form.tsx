import CustomButton from "@/components/core/custom-button";
import FormInput from "@/components/core/form-fields/input";
import { FormMultiSelect } from "@/components/core/form-fields/multi-select";
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
import { getSelectOptions, SelectsEnum } from "@/lib/common";
import { IError } from "@/lib/fetcher/types";
import FormSchema from "@/schemas/assets";
import { addOrEditAsset } from "@/store/assets/api";
import { clearEditDetails, setShowAssetForm } from "@/store/assets/slice";
import {
  addFormSelectOptions,
  getFormSelectOptions,
  getListForTable,
} from "@/store/common/api";
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
      program_language_all_data: [],
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

  // Populate the form with existing asset details if editing, otherwise reset the form
  useEffect(() => {
    if (editFormData) {
      reset({
        asset_name: editData?.asset_name || "",
        program_language_all_data:
          editData?.program_languages?.map(
            (lang) => lang.program_languages_enum.master_enum_uuid,
          ) || [],
      });
    } else {
      reset({
        asset_name: "",
        program_language_all_data: [],
      });
    }
  }, [editFormData, reset, editData]);

  // Resets the form and clears edit state when the asset form is closed
  const onClose = (open: boolean) => {
    reset({
      asset_name: "",
      program_language_all_data: [],
    });
    dispatch(clearEditDetails());
    dispatch(setShowAssetForm(open));
  };

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const payload = {
        asset_id: editData ? (editData as Asset).asset_id : undefined,
        asset_name: data.asset_name,
        product_id: productId,
        program_language_all_data: data.program_language_all_data || [], // Ensure array is sent
      };

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

  // Handles adding a custom programming language, ensuring it is unique before updating the dropdown list
  const handleCustomOptionAdd = async (value: string) => {
    try {
      const formattedValue =
        value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

      const response = await dispatch(
        addFormSelectOptions({
          master_enum_uuid: null,
          master_enum_type_id: 2,
          master_enum_name: formattedValue,
        }),
      ).unwrap();

      const newUUID = response?.data?.master_enum_uuid; // Extract UUID

      if (newUUID) {
        // Refresh the dropdown list with new options
        dispatch(
          getFormSelectOptions({
            request: `Enum/${SelectsEnum["Programming_Language"]}`,
          }),
        );

        return { value: newUUID, label: formattedValue }; // Return the new language object
      }
    } catch {
      toast({
        title: "This language is already added. Please add a new language.",
        variant: "destructive",
      });

      return undefined; // Explicitly return undefined
    }

    return undefined; // Ensure the function always returns a value
  };

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
                className="grid h-full gap-y-5"
              >
                <p className="text-lg font-bold text-borderColor-dark">
                  Technical Stack
                </p>
                <FormInput
                  label="Asset Name"
                  name="asset_name"
                  placeholder="Asset Name"
                />

                <FormMultiSelect
                  name="program_language_all_data"
                  label="Programming Languages"
                  placeholder="Programming Languages"
                  isLoading={loading}
                  options={getSelectOptions<StaticSelectOptions>(
                    programmingLanguagesList,
                    "master_enum_name",
                    "master_enum_uuid",
                  )}
                  className="max-h-[230px]"
                  onCustomOptionAdd={handleCustomOptionAdd}
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
