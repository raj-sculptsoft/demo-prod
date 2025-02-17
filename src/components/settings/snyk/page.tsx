import CustomButton from "@/components/core/custom-button";
import { FormSelect } from "@/components/core/form-fields/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import config from "@/config/env";
import { useAppDispatch, useAppSelector } from "@/hooks/use-store";
import { toast } from "@/hooks/use-toast";
import { FormSchemaOrg } from "@/schemas/settings";
import { addOrEditSynk, getProjectLink, getSynk } from "@/store/settings/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import Integration from "../../core/integration";
import Layout from "./layout";

type FormData = z.infer<typeof FormSchemaOrg>;

export default function SynkPage() {
  const company_id = config.COMPANY_ID;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data } = useAppSelector((state) => state.synk);

  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<FormData | null>(null);

  const methods = useForm<FormData>({
    resolver: zodResolver(FormSchemaOrg),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = methods;

  const orgId = watch("orgId");
  const apiKey = watch("apiKey");
  const syncPeriod = watch("syncPeriod");

  useEffect(() => {
    dispatch(getSynk(company_id));
  }, [dispatch, company_id]);

  useEffect(() => {
    if (data) {
      setValue(
        "orgId",
        data.integration_data?.semgrep_api_keys.Organization_slug || "",
      );
      setValue(
        "apiKey",
        data.integration_data?.semgrep_api_keys.api_token || "",
      );
      setValue("syncPeriod", data.sync_period?.toString() || "");
      setInitialData({ orgId, apiKey, syncPeriod });
    } else {
      setInitialData({ orgId: "", apiKey: "", syncPeriod: "" });
    }
  }, [data, setValue]);

  const onSubmit = async (formData: FormData) => {
    setLoading(true);

    const payload = {
      company_id,
      third_party_integrations_id: data?.third_party_integrations_id ?? null,
      integration_data: {
        snyk_api_keys: { organization_id: null, api_access_key: null },
        semgrep_api_keys: {
          Organization_slug: formData.orgId,
          api_token: formData.apiKey,
        },
      },
      sync_period: Number(formData.syncPeriod),
    };

    try {
      const response = await dispatch(addOrEditSynk(payload)).unwrap();
      toast({ title: response?.message });
      navigate("/settings/semgrep/linkAssets");
    } catch (error) {
      toast({
        title:
          (error as { message: string })?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = async () => {
    try {
      await dispatch(getProjectLink(company_id));
      navigate("/settings/semgrep/linkAssets");
    } catch (error) {
      toast({
        title:
          (error as { message: string })?.message ||
          "Failed to fetch project details.",
        variant: "destructive",
      });
    }
  };

  const isFormChanged =
    initialData &&
    (orgId !== initialData.orgId ||
      apiKey !== initialData.apiKey ||
      syncPeriod !== initialData.syncPeriod);

  return (
    <Layout>
      <div className="flex w-full space-x-4">
        <Integration />
        <div className="flex h-full w-full flex-col">
          <Card className="rounded-2xl">
            <CardHeader className="border-b p-4">
              <CardTitle className="text-lg font-semibold">
                Semgrep Setting
              </CardTitle>
            </CardHeader>
            <CardContent className="h-full w-full overflow-auto px-5 pt-2">
              {/* Wrap the form with FormProvider */}
              <FormProvider {...methods}>
                <form
                  className="w-full space-y-6"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div className="mt-2 flex justify-between">
                    <div className="mr-3 w-1/2 space-y-2">
                      <Label
                        htmlFor="orgId"
                        className={errors.orgId ? "text-red-600" : ""}
                      >
                        Organization Slug
                      </Label>
                      <Input
                        id="orgId"
                        placeholder="Enter Organization Slug"
                        className="bg-bodyBackground"
                        {...register("orgId")}
                      />
                      {errors.orgId && (
                        <p className="text-sm font-medium text-red-600">
                          {errors.orgId.message}
                        </p>
                      )}
                    </div>

                    <div className="ml-3 w-1/2 space-y-2">
                      <Label
                        htmlFor="apiKey"
                        className={errors.apiKey ? "text-red-600" : ""}
                      >
                        API Token
                      </Label>
                      <Input
                        id="apiKey"
                        placeholder="Enter API Token"
                        className="bg-bodyBackground"
                        {...register("apiKey")}
                      />
                      {errors.apiKey && (
                        <p className="text-sm font-medium text-red-500">
                          {errors.apiKey.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* FormSelect with react-hook-form integration */}
                  <div className="w-[49%]">
                    <FormSelect
                      name="syncPeriod"
                      label="Select Frequency"
                      placeholder="Select Frequency"
                      options={[
                        { label: "4 Hours", value: "1" },
                        { label: "12 Hours", value: "2" },
                        { label: "24 Hours", value: "3" },
                        { label: "5 Days", value: "4" },
                        { label: "7 Days", value: "5" },
                      ]}
                    />
                  </div>

                  <CustomButton
                    type="submit"
                    className="px-12"
                    isLoading={loading}
                    disabled={!isFormChanged}
                  >
                    Save
                  </CustomButton>
                </form>
              </FormProvider>
            </CardContent>
          </Card>

          {data && (
            <CustomButton className="mt-4 w-36" onClick={handleEditClick}>
              Edit Link Assets
            </CustomButton>
          )}
        </div>
      </div>
    </Layout>
  );
}
