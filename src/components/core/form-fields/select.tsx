"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFormContext } from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CommonFormFieldsProps } from "@/types/common";
import { Loader2 } from "lucide-react";

interface IFormSelectProps extends CommonFormFieldsProps {
  isLoading?: boolean;
  disabled?: boolean;
  options: { label: string; value: string }[];
}

export function FormSelect({
  name,
  label,
  placeholder,
  options = [],
  isLoading = false,
  disabled = false,
  onChange = () => {},
}: IFormSelectProps) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { ref, ...rest } = field;

        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Select
                {...rest}
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value);
                  onChange(value);
                }}
                disabled={disabled || isLoading}
              >
                <SelectTrigger
                  className={`text-border-dark ${field.value ? "text-secondary" : "text-borderColor-dark"} h-12 rounded bg-bodyBackground focus:ring-0 focus:ring-offset-0`}
                >
                  <SelectValue placeholder={placeholder} />
                  {isLoading && (
                    <Loader2 className="ml-auto mr-2 h-4 w-4 animate-spin opacity-70" />
                  )}
                </SelectTrigger>
                <SelectContent className="p-0">
                  <SelectGroup>
                    {options.length === 0 && (
                      <SelectItem disabled value="empty">
                        No Options
                      </SelectItem>
                    )}
                    {options.map(({ label, value }, index) => (
                      <SelectItem
                        key={value}
                        value={value}
                        className={` ${index < options.length - 1 ? "border-b" : ""}`}
                      >
                        {label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
