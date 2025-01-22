import Revert from "@/assets/icons/revert";
import { useLocation, useNavigate } from "react-router-dom";

export default function ResetFilter({ name = "" }: { name?: string }) {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const value = queryParams.get(name);

  const onReset = () => {
    if (value) {
      queryParams.delete(name);
      navigate(`${location.pathname}?${queryParams.toString()}`);
    } else {
      navigate(location.pathname);
    }
  };

  return (
    <div
      className="flex cursor-pointer select-none items-center justify-center gap-2 px-6"
      onClick={onReset}
    >
      <Revert height={18} width={18} className="fill-red" />
      <span className="font-semibold text-red">Reset Filter</span>
    </div>
  );
}
