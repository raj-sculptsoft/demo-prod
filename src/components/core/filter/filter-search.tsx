import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Search from "../../../assets/icons/search";
import { cn } from "../../../lib/utils";
import { Input } from "../../ui/input";

export default function FilterSearch({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState(searchParams.get(name) ?? "");

  const handleSearch = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete(name);
    if (searchText) newSearchParams.append(name, searchText);
    setSearchParams(newSearchParams);
  };

  return (
    <div className={cn("relative basis-96", className)}>
      <Input
        className="peer rounded-full bg-bodyBackground ps-9"
        placeholder="Search"
        type="text"
        value={searchText}
        onChange={(event) => {
          setSearchText(event.target.value);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            handleSearch(); // Trigger search on Enter key press
          }
        }}
      />
      <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
        <Search height={16} width={16} />
      </div>
    </div>
  );
}
