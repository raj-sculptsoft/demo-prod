import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, Loader2, Plus, X } from "lucide-react";
import * as React from "react";
import { useFormContext } from "react-hook-form";

interface Option {
  value: string;
  label: string;
}

interface FormMultiSelectProps {
  name: string;
  label: string;
  placeholder: string;
  isLoading?: boolean;
  options: Option[];
  className?: string;
  allowCustomOptions?: boolean;
  onChange?: (newValue: string[]) => void;
  onDropdownOpenChange?: (isOpen: boolean) => void;
  onCustomOptionAdd?: (value: string) => Promise<Option | void>;
}

export function FormMultiSelect({
  name,
  label,
  placeholder,
  options = [],
  isLoading = false,
  className,
  allowCustomOptions = true,
  onChange = () => {},
  onDropdownOpenChange,
  onCustomOptionAdd,
}: FormMultiSelectProps) {
  const { control } = useFormContext();
  const [isOpen, setIsOpen] = React.useState(false);
  const [showCustomInput, setShowCustomInput] = React.useState(false);
  const [customValue, setCustomValue] = React.useState("");
  const buttonRef = React.useRef<HTMLButtonElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    onDropdownOpenChange?.(isOpen);
  }, [isOpen, onDropdownOpenChange]);

  React.useEffect(() => {
    if (showCustomInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showCustomInput]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const { value = [], onChange: fieldOnChange } = field;
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
          fieldOnChange(newValue);
          onChange(newValue);
          setIsOpen(true);
        };

        const removeTag = (optionValue: string) => {
          handleValueChange(optionValue);
          setIsOpen(false);
        };

        const handleCustomSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          e.stopPropagation();

          if (customValue.trim()) {
            const newOption = await onCustomOptionAdd?.(customValue.trim());

            if (newOption) {
              fieldOnChange([...safeValue, newOption.value]); // Add new UUID to selection
              onChange([...safeValue, newOption.value]);
            }

            setCustomValue("");
            setShowCustomInput(false);
          }
        };

        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <>
                <Popover open={isOpen} onOpenChange={setIsOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      ref={buttonRef}
                      variant="outline"
                      role="combobox"
                      aria-expanded={isOpen}
                      className="h-12 w-full justify-between bg-gray-100 hover:bg-gray-100"
                    >
                      <span
                        className={`ml-[-15px] truncate font-normal ${
                          safeValue.length === 0 ? "text-borderColor-dark" : ""
                        }`}
                      >
                        {safeValue.length === 0
                          ? placeholder
                          : `${safeValue.length} selected`}
                      </span>

                      {isLoading && (
                        <Loader2 className="ml-auto h-4 w-4 animate-spin opacity-20" />
                      )}
                      <ChevronsUpDown className="mr-[-15px] h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="p-0"
                    style={{
                      width: buttonRef.current
                        ? `${buttonRef.current.offsetWidth}px`
                        : "auto",
                    }}
                  >
                    <Command className={className ?? "max-h-[125px]"}>
                      <CommandList>
                        <CommandEmpty>No options found.</CommandEmpty>
                        <CommandGroup>
                          {options.map(
                            (
                              { value: optionValue, label: optionLabel },
                              index,
                            ) => (
                              <CommandItem
                                key={optionValue}
                                onSelect={() => handleValueChange(optionValue)}
                                className={`flex h-12 items-center font-normal hover:bg-slate-100 ${
                                  index < options.length - 1 ? "border-b" : ""
                                } ${safeValue.includes(optionValue) ? "font-medium" : ""}`}
                              >
                                <div
                                  className={`mr-2 flex h-4 w-4 items-center justify-center rounded border ${
                                    safeValue.includes(optionValue)
                                      ? "border-primary bg-primary"
                                      : "border-gray-400"
                                  }`}
                                >
                                  {safeValue.includes(optionValue) && (
                                    <Check className="h-5 w-8 text-white" />
                                  )}
                                </div>
                                {optionLabel}
                              </CommandItem>
                            ),
                          )}

                          {/* Custom Input Option */}
                          {allowCustomOptions && (
                            <CommandItem
                              onSelect={() => setShowCustomInput(true)}
                              className="flex h-12 items-center border-t font-normal hover:bg-slate-100"
                            >
                              {showCustomInput ? (
                                <form
                                  onSubmit={handleCustomSubmit}
                                  className="flex w-full items-center gap-2"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Input
                                    ref={inputRef}
                                    value={customValue}
                                    onChange={(e) =>
                                      setCustomValue(e.target.value)
                                    }
                                    placeholder="Add Language"
                                    className="h-8 flex-1"
                                  />
                                  <Button
                                    type="submit"
                                    size="sm"
                                    className="h-8 px-2"
                                  >
                                    Add
                                  </Button>
                                </form>
                              ) : (
                                <>
                                  <Plus className="mr-2 h-4 w-4" />
                                  Add Other Language
                                </>
                              )}
                            </CommandItem>
                          )}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {/* Selected Tags */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {safeValue.map((selected) => {
                    const option = options.find((o) => o.value === selected);
                    return (
                      <Badge
                        key={selected}
                        variant="secondary"
                        className="flex h-8 items-center gap-1 rounded-sm text-sm font-normal"
                      >
                        {option?.label}
                        <button
                          onClick={() => removeTag(selected)}
                          className="ml-1 rounded-full outline-none"
                        >
                          <X className="text-muted-foreground hover:text-foreground h-4 w-4" />
                        </button>
                      </Badge>
                    );
                  })}
                </div>
              </>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
