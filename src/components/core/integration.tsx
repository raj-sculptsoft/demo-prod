import IntegrationIcon from "@/assets/icons/integration";
import { Button } from "@/components/ui/button";

export default function Integration() {
  return (
    <div className="flex h-[calc(100vh-82px)] w-[286px] rounded-2xl bg-white p-4">
      <Button
        variant="ghost"
        className="h-[39px] w-[240px] justify-start gap-2 bg-bodyBackground px-3 text-sm font-normal"
      >
        <IntegrationIcon />
        Integration
      </Button>
    </div>
  );
}
