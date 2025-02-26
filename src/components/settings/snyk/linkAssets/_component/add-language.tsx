import CustomButton from "@/components/core/custom-button";
import { FormMultiSelect } from "@/components/core/form-fields/multi-select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppDispatch, useAppSelector } from "@/hooks/use-store";
import { toast } from "@/hooks/use-toast";
import { getSelectOptions, SelectsEnum } from "@/lib/common";
import { addFormSelectOptions, getFormSelectOptions } from "@/store/common/api";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

interface LanguageSelectionDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (languages: string[]) => void;
  selectedProject: {
    product_id: string;
    product_name: string;
    project_id: string;
    project_name: string;
    selected_languages?: string[];
  };
}

export default function LanguageSelectionDialog({
  open,
  onClose,
  onConfirm,
  selectedProject,
}: LanguageSelectionDialogProps) {
  const methods = useForm<{ program_language: string[] }>({
    defaultValues: {
      program_language: selectedProject.selected_languages || [],
    },
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDialogClose = () => {
    if (!isDropdownOpen) {
      onClose();
    }
  };

  const dispatch = useAppDispatch();

  // Fetch language options only when the dialog opens
  useEffect(() => {
    if (open) {
      dispatch(
        getFormSelectOptions({
          request: `Enum/${SelectsEnum["Programming_Language"]}`,
        }),
      );
    }
  }, [dispatch, open]);

  // Reset selected languages when project changes
  useEffect(() => {
    methods.reset({
      program_language: selectedProject.selected_languages || [],
    });
  }, [selectedProject, methods]);

  const {
    loading,
    data: { list: programmingLanguagesList = [] },
  } = useAppSelector(({ common }) => common.formSelectOptions);

  const handleCustomOptionAdd = async (value: string) => {
    try {
      // Capitalize first letter
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
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Select Languages for {selectedProject.project_name}
          </DialogTitle>
        </DialogHeader>
        <FormProvider {...methods}>
          <FormMultiSelect
            name="program_language"
            label="Programming Language"
            placeholder="Select a Language"
            isLoading={loading}
            options={getSelectOptions(
              programmingLanguagesList,
              "master_enum_name",
              "master_enum_uuid",
            )}
            onDropdownOpenChange={setIsDropdownOpen}
            onCustomOptionAdd={handleCustomOptionAdd}
          />
        </FormProvider>
        <CustomButton
          className="mx-auto mt-20 w-28"
          onClick={() => {
            const selectedLanguages =
              methods.getValues("program_language") || [];
            onConfirm(selectedLanguages.length > 0 ? selectedLanguages : []);
          }}
          disabled={methods.getValues("program_language").length === 0}
        >
          Confirm
        </CustomButton>
      </DialogContent>
    </Dialog>
  );
}
