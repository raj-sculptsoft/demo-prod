import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface IFilterSelectProps {
  defaultValue?: string;
  placeholder: string;
  options: { label: string; value: string }[];
  name: string;
  disabled?: boolean;
  isLoading?: boolean;
  value: string;
  onValueChange?: (value: string) => void;
}

export default function FilterSelect({
  defaultValue = "",
  placeholder = "",
  options = [],
  name = "",
  disabled = false,
  isLoading = false,
  onValueChange = () => {},
}: IFilterSelectProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [selectValue, setSelectValue] = useState(
    queryParams.get(name) ?? defaultValue,
  );

  useEffect(() => {
    setSelectValue(queryParams.get(name) ?? defaultValue);
  }, [queryParams.get(name)]);

  const handleValueChange = (value: string) => {
    const params = new URLSearchParams(location.search);
    params.delete(name);
    if (value) {
      params.append(name, value);
    }

    setSelectValue(value);
    navigate(`${location.pathname}?${params.toString()}`);
    onValueChange(value);
  };

  return (
    <div className="max-w-40 grow pl-3">
      <Select
        value={selectValue}
        onValueChange={handleValueChange}
        disabled={disabled || isLoading}
      >
        <SelectTrigger className="bg h-full w-full rounded-none border-0 font-bold text-secondary focus:ring-0 focus:ring-offset-0">
          <SelectValue placeholder={placeholder} />
          {isLoading && (
            <Loader2 className="ml-auto mr-1 h-4 w-4 animate-spin opacity-70" />
          )}
        </SelectTrigger>
        <SelectContent className="p-0">
          <SelectGroup className="w-[250px]">
            {options.map(({ label, value }, index) => (
              <SelectItem
                key={value}
                value={value}
                className={`${index < options.length - 1 ? "border-b" : ""}`}
              >
                {label.length > 30 ? `${label.slice(0, 30)}...` : label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
