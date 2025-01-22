import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, X } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

interface IFormMultiSelectProps {
  name: string;
  label: string;
  placeholder: string;
  isLoading?: boolean;
  disabled?: boolean;
  options: { label: string; value: string }[];
  onChange?: (newValue: string[]) => void;
}

export function FormMultiSelect({
  name,
  label,
  placeholder,
  options = [],
  isLoading = false,
  disabled = false,
  onChange = () => {},
}: IFormMultiSelectProps) {
  const { control } = useFormContext();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const { value = [], onChange: fieldOnChange } = field;

        // Ensure value is always an array
        const safeValue = Array.isArray(value) ? value : [];

        const handleValueChange = (
          optionValue: string,
          e?: React.MouseEvent,
        ) => {
          e?.preventDefault();
          e?.stopPropagation();
          const newValue = safeValue.includes(optionValue)
            ? safeValue.filter((v) => v !== optionValue)
            : [...safeValue, optionValue];
          fieldOnChange(newValue); // Update form state
          onChange(newValue); // Notify parent component
        };

        const removeTag = (optionValue: string) => {
          handleValueChange(optionValue); // Remove the value when "X" is clicked
        };

        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <div>
                <Select
                  value=""
                  open={isOpen}
                  onOpenChange={setIsOpen}
                  disabled={disabled || isLoading}
                  onValueChange={(selectedValue) =>
                    handleValueChange(selectedValue)
                  }
                >
                  <SelectTrigger
                    className={`text-border-dark ${
                      safeValue.length > 0
                        ? "text-secondary"
                        : "text-borderColor-dark"
                    } h-12 rounded bg-bodyBackground focus:ring-0 focus:ring-offset-0`}
                  >
                    <SelectValue placeholder={placeholder} />
                    {isLoading && (
                      <Loader2 className="ml-auto mr-2 h-4 w-4 animate-spin opacity-70" />
                    )}
                  </SelectTrigger>
                  <SelectContent
                    className="p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <SelectGroup>
                      {options.length === 0 && (
                        <SelectItem disabled value="empty">
                          No Options
                        </SelectItem>
                      )}
                      {options.map(({ label, value: optionValue }) => (
                        <SelectItem
                          key={optionValue}
                          value={optionValue}
                          onClick={(e) => {
                            handleValueChange(optionValue, e);
                          }}
                          className={`flex items-center ${
                            safeValue.includes(optionValue) ? "font-bold" : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            readOnly
                            checked={safeValue.includes(optionValue)}
                            className="mr-3"
                          />
                          {label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                {/* Selected Tags */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {safeValue.map((selected) => {
                    const option = options.find((o) => o.value === selected);
                    return (
                      <div
                        key={selected}
                        className="flex items-center gap-1 rounded-sm bg-gray-100 px-3 py-1 text-sm"
                      >
                        <span>{option?.label}</span>
                        <button
                          onClick={() => removeTag(selected)}
                          className="rounded-full p-0.5 transition-colors hover:bg-gray-200"
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">
                            Remove {option?.label}
                          </span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
