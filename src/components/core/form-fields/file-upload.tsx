import UploadFile from "@/assets/icons/upload-file";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CommonFormFieldsProps } from "@/types/common";
import { useRef } from "react";
import { useFormContext } from "react-hook-form";

export default function FormFileUpload({
  name,
  label,
  acceptedFiles,
  description = "",
}: Omit<CommonFormFieldsProps, "placeholder"> & {
  acceptedFiles: string;
  description?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { control, setValue } = useFormContext();

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = Array.from(e.target.files)[0];
    setValue(name, file, { shouldValidate: true });
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { value } }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <>
              <div
                onClick={handleClick}
                className={`border-muted-foreground/25 flex cursor-pointer items-center justify-center gap-2 rounded border-2 border-dashed bg-bodyBackground py-2.5 transition-colors`}
              >
                {value?.name && (
                  <p className="text-base text-borderColor-dark">
                    {value.name}
                  </p>
                )}
                {!value?.name && (
                  <>
                    <UploadFile height={24} width={24} />
                    <p className="text-base text-borderColor-dark">
                      Browse File to Upload
                    </p>
                  </>
                )}

                <input
                  ref={inputRef}
                  type="file"
                  className="hidden"
                  onChange={handleChange}
                  max={1}
                  accept={acceptedFiles}
                  onClick={(event) => {
                    (event.target as HTMLInputElement).value = "";
                  }}
                />
              </div>
              {description && <FormDescription>{description}</FormDescription>}
            </>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
