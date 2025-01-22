import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useAppDispatch, useAppSelector } from "@/hooks/use-store";
import { setShowAssetsGraph } from "@/store/dashboard/slice";
import { DashboardTopVulnerabilityList } from "@/types/dashboard";
import { DialogTitle } from "@radix-ui/react-dialog";
import Graph from "./graph";

export default function TopVulnerableAssets({
  data,
}: {
  data: DashboardTopVulnerabilityList;
}) {
  const newData = useAppSelector(
    ({ dashboard }) => dashboard.vulnerabilityData,
  );

  const open = useAppSelector(({ dashboard }) => dashboard.showAssetsGraph);
  const dispatch = useAppDispatch();

  const graphData = newData ?? data;

  let title = "";

  if (graphData.list[0]?.product_name) {
    title = "Top Vulnerable Products";
  } else if (graphData.list[0]?.asset_name) {
    title = "Top Vulnerable Assets";
  } else {
    title = "Top Vulnerabilities";
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        dispatch(setShowAssetsGraph(open));
      }}
    >
      <DialogContent
        className="max-w-2xl"
        closeButtonClassName="-top-3 -right-3 border-2	rounded-full text-blue bg-white opacity-100 p-2"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
        </DialogHeader>
        <Graph data={graphData} />
      </DialogContent>
    </Dialog>
  );
}
