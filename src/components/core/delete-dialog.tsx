"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppDispatch, useAppSelector } from "@/hooks/use-store";
import { setDeleteDialogOptions } from "@/store/common/slice";
import CustomButton from "./custom-button";

interface IDeleteDialogProps {
  onDeleteConfirm: () => Promise<void>;
}

export function DeleteDialog({ onDeleteConfirm }: IDeleteDialogProps) {
  const { open, title, description, loading } = useAppSelector(
    ({ common }) => common.deleteDialog,
  );

  const dispatch = useAppDispatch();

  const onClose = () => {
    dispatch(
      setDeleteDialogOptions({
        open: false,
        title: "",
        description: "",
        data: {},
      }),
    );
  };

  const onDelete = async () => {
    await onDeleteConfirm();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="mb-6">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-borderColor font-normal text-borderColor-dark hover:bg-borderColor/90 hover:text-borderColor-dark"
          >
            Cancel
          </Button>
          <CustomButton
            className="font-normal"
            variant="destructive"
            onClick={onDelete}
            isLoading={loading}
          >
            Delete
          </CustomButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
