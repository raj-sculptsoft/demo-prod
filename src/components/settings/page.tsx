import SemGrepIcon from "@/assets/icons/semgrep";
import { useAppDispatch, useAppSelector } from "@/hooks/use-store";
import { getSynk } from "@/store/settings/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Integration from "../core/integration";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Layout from "./layout";

export default function SettingsPage() {
  const company_id = import.meta.env.VITE_PUBLIC_COMPANY_ID;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data } = useAppSelector((state) => state.synk);

  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    dispatch(getSynk(company_id));
  }, [dispatch, company_id]);

  useEffect(() => {
    if (data?.third_party_integrations_id) {
      setIsConfigured(true);
    } else {
      setIsConfigured(false);
    }
  }, [data]);

  return (
    <Layout>
      <div className="flex w-full space-x-4">
        <Integration />
        {/* <Card className="h-full w-full rounded-2xl">
          <CardHeader className="border-b p-4">
            <CardTitle className="text-lg font-semibold">
              Code Scanners
            </CardTitle>
          </CardHeader>
          <CardContent className="h-full w-full overflow-auto px-5 pt-2">
            <div className="mx-auto h-full w-full">
              <div className="mb-3 flex justify-between">
                <div className="text-muted-foreground ml-8 text-sm font-medium">
                  Name
                </div>
                <div className="text-muted-foreground mr-24 text-sm font-medium">
                  Connection
                </div>
                <div></div>
              </div>
              <div className="bg-card text-card-foreground shadow-all-sides group rounded-lg border transition-colors">
                <div className="grid grid-cols-[1fr,1fr,auto] items-center gap-4 p-3">
                  <div className="flex items-center">
                    <div className="flex h-12 w-12 items-center justify-center">
                      <SynkIcon />
                    </div>
                    <span className="ml-2 font-medium">Snyk</span>
                  </div>
                  <div
                    className={`text-muted-foreground text-sm font-medium ${
                      isConfigured ? "ml-7" : ""
                    }`}
                  >
                    {isConfigured ? "Configured" : "Not Configured"}
                  </div>
                  <Button
                    className="bg-primary text-white"
                    onClick={() => navigate("/settings/synk")}
                  >
                    {isConfigured ? "Edit Configure" : "Configure"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card> */}
        <Card className="h-full w-full rounded-2xl">
          <CardHeader className="border-b p-4">
            <CardTitle className="text-lg font-semibold">
              Code Scanners
            </CardTitle>
          </CardHeader>
          <CardContent className="h-full w-full overflow-auto px-5 pt-2">
            <div className="mx-auto h-full w-full">
              <div className="mb-3 flex justify-between">
                <div className="text-muted-foreground ml-8 text-sm font-medium">
                  Name
                </div>
                <div className="text-muted-foreground mr-24 text-sm font-medium">
                  Connection
                </div>
                <div></div>
              </div>
              <div className="bg-card text-card-foreground shadow-all-sides group rounded-lg border transition-colors">
                <div className="grid grid-cols-[1fr,1fr,auto] items-center gap-4 p-3">
                  <div className="flex items-center">
                    <div className="mt-2 flex w-14 items-center justify-center">
                      <SemGrepIcon />
                    </div>
                    <span className="ml-[-5px] font-medium">Semgrep</span>
                  </div>
                  <div
                    className={`text-muted-foreground text-sm font-medium ${
                      isConfigured ? "ml-7" : ""
                    }`}
                  >
                    {isConfigured ? "Configured" : "Not Configured"}
                  </div>
                  <Button
                    className="bg-primary text-white"
                    onClick={() => navigate("/settings/semgrep")}
                  >
                    {isConfigured ? "Edit Configure" : "Configure"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
