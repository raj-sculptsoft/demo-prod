import CustomButton from "@/components/core/custom-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ConfirmationDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  description: string;
}

export default function ConfirmationDialog({
  open,
  onConfirm,
  onCancel,
  title,
  description,
}: ConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader className="mb-6">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <CustomButton
            variant="outline"
            onClick={onCancel}
            className="bg-borderColor font-normal text-borderColor-dark hover:bg-borderColor/90 hover:text-borderColor-dark"
          >
            Cancel
          </CustomButton>
          <CustomButton className="font-normal" onClick={onConfirm}>
            Okay
          </CustomButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
