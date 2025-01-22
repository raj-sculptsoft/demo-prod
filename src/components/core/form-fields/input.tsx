"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CommonFormFieldsProps } from "@/types/common";
import { useFormContext } from "react-hook-form";

export default function FormInput({
  name,
  label,
  placeholder,
}: CommonFormFieldsProps) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              className="h-12"
              placeholder={placeholder}
              {...field}
              onFocus={(e) => {
                setTimeout(() => {
                  e.target.setSelectionRange(
                    e.target.value.length,
                    e.target.value.length,
                  );
                }, 0);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
