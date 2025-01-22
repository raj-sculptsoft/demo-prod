import Filter from "@/assets/icons/filter";
import FilterSeparator from "./filter-separator";

export default function FilterIcon() {
  return (
    <>
      <div className="self-center px-5 py-4">
        <Filter height={22} width={20} />
      </div>
      <div>
        <FilterSeparator />
      </div>
      <div>
        <p className="px-6 py-5 font-bold">Filter By</p>
      </div>
    </>
  );
}
