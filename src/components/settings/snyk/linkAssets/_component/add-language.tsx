import CustomButton from "@/components/core/custom-button";
import { FormMultiSelect } from "@/components/core/form-fields/multi-select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppDispatch, useAppSelector } from "@/hooks/use-store";
import { getSelectOptions, SelectsEnum } from "@/lib/common";
import { getFormSelectOptions } from "@/store/common/api";
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

  useEffect(() => {
    if (open) {
      dispatch(
        getFormSelectOptions({
          request: `Enum/${SelectsEnum["Programming_Language"]}`,
        }),
      );
    }
  }, [dispatch, open]);

  useEffect(() => {
    methods.reset({
      program_language: selectedProject.selected_languages || [],
    });
  }, [selectedProject, methods]);

  const {
    loading,
    data: { list: programmingLanguagesList = [] },
  } = useAppSelector(({ common }) => common.formSelectOptions);

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
          />
        </FormProvider>
        <CustomButton
          className="mx-auto w-28"
          onClick={() => onConfirm(methods.getValues("program_language"))}
          disabled={methods.getValues("program_language").length === 0}
        >
          Confirm
        </CustomButton>
      </DialogContent>
    </Dialog>
  );
}
