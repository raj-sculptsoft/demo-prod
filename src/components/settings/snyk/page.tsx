import CustomButton from "@/components/core/custom-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from "@/hooks/use-store";
import { toast } from "@/hooks/use-toast";
import { FormSchemaOrg } from "@/schemas/settings";
import { addOrEditSynk, getSynk } from "@/store/settings/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import Integration from "../../core/integration";
import Layout from "./layout";

type FormData = z.infer<typeof FormSchemaOrg>;

export default function SynkPage() {
  const company_id = import.meta.env.VITE_PUBLIC_COMPANY_ID;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data } = useAppSelector((state) => state.synk);

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(FormSchemaOrg),
  });

  useEffect(() => {
    dispatch(getSynk(company_id));
  }, [dispatch, company_id]);

  // useEffect(() => {
  //   if (data) {
  //     setValue(
  //       "orgId",
  //       data.integration_data?.snyk_api_keys.organization_id || "",
  //     );
  //     setValue(
  //       "apiKey",
  //       data.integration_data?.snyk_api_keys.api_access_key || "",
  //     );
  //   }
  // }, [data, setValue]);

  useEffect(() => {
    if (data) {
      setValue(
        "orgId",
        "",
        // data.integration_data?.semgrep_api_keys.Organization_slug || "",
      );
      setValue(
        "apiKey",
        "",
        // data.integration_data?.semgrep_api_keys.api_token || "",
      );
    }
  }, [data, setValue]);

  const onSubmit = async (formData: FormData) => {
    setLoading(true);

    const payload = {
      company_id: company_id,
      third_party_integrations_id: data?.third_party_integrations_id ?? null,
      integration_data: {
        snyk_api_keys: {
          organization_id: null,
          api_access_key: null,
        },
        semgrep_api_keys: {
          Organization_slug: formData.orgId,
          api_token: formData.apiKey,
        },
      },
    };

    try {
      const response = await dispatch(addOrEditSynk(payload)).unwrap();
      const successMessage =
        response?.message || "Third Party Integration added successfully.";
      toast({ title: successMessage });
      navigate("/settings/semgrep/linkAssets");
    } catch (error) {
      const errorMessage =
        (error as { message: string })?.message || "Something went wrong";
      toast({
        title: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex w-full space-x-4">
        <Integration />
        {/* <Card className="h-full w-full rounded-2xl">
          <CardHeader className="border-b p-4">
            <CardTitle className="text-lg font-semibold">
              Snyk Setting
            </CardTitle>
          </CardHeader>
          <CardContent className="h-full w-full overflow-auto px-5 pt-2">
            <form
              className="w-full space-y-6"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="mt-2 flex justify-between">
                <div className="mr-3 w-1/2 space-y-2">
                  <Label htmlFor="orgId">Organization ID</Label>
                  <Input
                    id="orgId"
                    placeholder="Enter Organization ID"
                    className="bg-bodyBackground"
                    {...register("orgId")}
                  />
                  {errors.orgId && (
                    <p className="text-sm text-red-500">
                      {errors.orgId.message}
                    </p>
                  )}
                </div>

                <div className="ml-3 w-1/2 space-y-2">
                  <Label htmlFor="apiKey">API Access Key</Label>
                  <Input
                    id="apiKey"
                    placeholder="Enter API Access Key"
                    className="bg-bodyBackground"
                    {...register("apiKey")}
                  />
                  {errors.apiKey && (
                    <p className="text-sm text-red-500">
                      {errors.apiKey.message}
                    </p>
                  )}
                </div>
              </div>
              <CustomButton type="submit" className="px-12" isLoading={loading}>
                Save
              </CustomButton>
            </form>
          </CardContent>
        </Card> */}
        <Card className="h-full w-full rounded-2xl">
          <CardHeader className="border-b p-4">
            <CardTitle className="text-lg font-semibold">
              Semgrep Setting
            </CardTitle>
          </CardHeader>
          <CardContent className="h-full w-full overflow-auto px-5 pt-2">
            <form
              className="w-full space-y-6"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="mt-2 flex justify-between">
                <div className="mr-3 w-1/2 space-y-2">
                  <Label htmlFor="orgId">Organization Slug</Label>
                  <Input
                    id="orgId"
                    placeholder="Enter Organization ID"
                    className="bg-bodyBackground"
                    {...register("orgId")}
                  />
                  {errors.orgId && (
                    <p className="text-sm text-red-500">
                      {errors.orgId.message}
                    </p>
                  )}
                </div>

                <div className="ml-3 w-1/2 space-y-2">
                  <Label htmlFor="apiKey">API Token</Label>
                  <Input
                    id="apiKey"
                    placeholder="Enter API Access Key"
                    className="bg-bodyBackground"
                    {...register("apiKey")}
                  />
                  {errors.apiKey && (
                    <p className="text-sm text-red-500">
                      {errors.apiKey.message}
                    </p>
                  )}
                </div>
              </div>
              <CustomButton type="submit" className="px-12" isLoading={loading}>
                Save
              </CustomButton>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
