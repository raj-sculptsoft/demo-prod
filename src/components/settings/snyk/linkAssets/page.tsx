import CustomButton from "@/components/core/custom-button";
import { FormMultiSelect } from "@/components/core/form-fields/multi-select";
import { FormSelect } from "@/components/core/form-fields/select";
import { Form } from "@/components/ui/form";
import { useAppDispatch, useAppSelector } from "@/hooks/use-store";
import { toast } from "@/hooks/use-toast";
import {
  defaultPayloadForWithoutPagination,
  getSelectOptions,
} from "@/lib/common";
import { FormSchemaAPI } from "@/schemas/settings";
import { getAllProducts } from "@/store/common/api";
import { addOrEditTargets, getTargetList } from "@/store/settings/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../ui/card";
import ConfirmationDialog from "./_component/dialog";
import TagList from "./_component/tag-list";
import Layout from "./layout";

export default function LinkAssetsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof FormSchemaAPI>>({
    resolver: zodResolver(FormSchemaAPI),
    defaultValues: {
      product_id: "",
      snyk_target_id: [],
    },
  });

  const { reset, setValue, watch } = form;
  const { loading: productsLoading, data: { list: productsList = [] } = {} } =
    useAppSelector(({ common }) => common.products);
  const { targetListLoading, targets } = useAppSelector(({ synk }) => synk);
  const targetsList = targets?.list || [];

  const [linkedData, setLinkedData] = useState<
    {
      product: string;
      product_id: string;
      tags: { id: string; label: string }[];
    }[]
  >([]);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    dispatch(
      getAllProducts({
        company_id: import.meta.env.VITE_PUBLIC_COMPANY_ID,
        ...defaultPayloadForWithoutPagination,
      }),
    );
    dispatch(getTargetList(import.meta.env.VITE_PUBLIC_COMPANY_ID));
  }, [dispatch]);

  const sortedProductsList = useMemo(() => {
    if (!productsList?.length) return [];
    return [...productsList].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  }, [productsList]);

  const handleDialogConfirm = async () => {
    try {
      const payload = {
        products: linkedData.map((item) => ({
          product_id: item.product_id,
          targets: item.tags.map((tag) => ({
            target_id: tag.id,
            target_name: tag.label,
          })),
        })),
      };

      const { message } = await dispatch(addOrEditTargets(payload)).unwrap();
      toast({
        title: message,
      });
      navigate(`/vulnerabilities?product=${linkedData[0]?.product_id}`);
      setLinkedData([]);
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setShowDialog(false);
    }
  };

  const onSubmit = async (data: z.infer<typeof FormSchemaAPI>) => {
    const selectedProduct = sortedProductsList.find(
      (product) => product.product_id === data.product_id,
    );
    const selectedTargets = targetsList.filter((target) =>
      data.snyk_target_id.includes(target.snyk_target_id),
    );

    if (selectedProduct) {
      setLinkedData((prev) => {
        const existingIndex = prev.findIndex(
          (item) => item.product_id === selectedProduct.product_id,
        );

        if (existingIndex > -1) {
          // Update existing product's tag list
          const updatedTags = selectedTargets.map((target) => ({
            id: target.snyk_target_id,
            label: target.snyk_target_name,
          }));

          const updatedLinkedData = [...prev];
          if (updatedLinkedData[existingIndex]) {
            updatedLinkedData[existingIndex].tags = updatedTags;
          }
          return updatedLinkedData;
        }

        // Add new product with targets
        return [
          ...prev,
          {
            product: selectedProduct.product_name,
            product_id: selectedProduct.product_id,
            tags: selectedTargets.map((target) => ({
              id: target.snyk_target_id,
              label: target.snyk_target_name,
            })),
          },
        ];
      });
    }

    reset();
  };
  const handleTagRemove = (productId: string, tagId: string) => {
    setLinkedData((prev) =>
      prev
        .map((item) =>
          item.product_id === productId
            ? {
                ...item,
                tags: item.tags.filter((tag) => tag.id !== tagId),
              }
            : item,
        )
        .filter(
          (item) => item.tags.length > 0 || item.product_id !== productId,
        ),
    );
  };

  const unselectedTargets = useMemo(() => {
    const selectedTargets = linkedData
      .filter((item) => item.product_id !== watch("product_id"))
      .flatMap((item) => item.tags.map((tag) => tag.id));

    return targetsList.filter(
      (target) => !selectedTargets.includes(target.snyk_target_id),
    );
  }, [linkedData, targetsList, watch("product_id")]);

  useEffect(() => {
    const selectedProductId = watch("product_id");
    const existingProduct = linkedData.find(
      (item) => item.product_id === selectedProductId,
    );

    if (existingProduct) {
      const tags = existingProduct.tags.map((tag) => tag.id);
      setValue("snyk_target_id", tags as [string, ...string[]]);
    } else {
      setValue("snyk_target_id", [] as unknown as [string, ...string[]]);
    }
  }, [watch("product_id"), linkedData, setValue]);

  return (
    <Layout>
      <div className="flex w-full space-x-4">
        <Card className="h-full w-full rounded-2xl">
          <CardHeader className="border-b p-4">
            <CardTitle className="text-lg font-semibold">Link Assets</CardTitle>
          </CardHeader>
          <CardContent className="px-5 py-7">
            <Form {...form}>
              <form
                id="link-assets-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid grid-cols-2 gap-x-4 gap-y-5"
              >
                <FormSelect
                  name="product_id"
                  label="Select Product"
                  placeholder="Select Product"
                  isLoading={productsLoading}
                  options={getSelectOptions(
                    sortedProductsList.map((item) => ({
                      ...item,
                      product_name:
                        item.product_name.length > 70
                          ? `${item.product_name.slice(0, 70)}...`
                          : item.product_name,
                    })),
                    "product_name",
                    "product_id",
                  )}
                />
                <FormMultiSelect
                  name="snyk_target_id"
                  label="Select Project"
                  placeholder="Select Project"
                  isLoading={targetListLoading}
                  options={getSelectOptions(
                    unselectedTargets.map((item) => ({
                      ...item,
                      snyk_target_name:
                        item.snyk_target_name.length > 70
                          ? `${item.snyk_target_name.slice(0, 70)}...`
                          : item.snyk_target_name,
                    })),
                    "snyk_target_name",
                    "snyk_target_id",
                  )}
                />
              </form>
            </Form>
          </CardContent>
          <CardFooter className="block text-start">
            <CustomButton
              className="px-14 py-6"
              type="submit"
              form="link-assets-form"
            >
              Link
            </CustomButton>
            <p className="mt-3">
              <span className="font-medium">Note:</span> If you need to add new
              product go to the product page.
            </p>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-6 flex flex-col gap-6">
        {linkedData.map((item, index) => (
          <Card key={index} className="h-full w-full rounded-2xl">
            <CardHeader className="border-b p-4">
              <CardTitle className="text-lg font-semibold">
                {item.product}
              </CardTitle>
            </CardHeader>
            <CardContent className="mt-3">
              <TagList
                tags={item.tags}
                onTagRemove={(tagId) => handleTagRemove(item.product_id, tagId)}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {linkedData.some((item) => item.tags.length > 0) && (
        <CardFooter className="ml-[-20px] mt-4 block text-start">
          <CustomButton
            className="px-14 py-6"
            onClick={() => setShowDialog(true)}
          >
            Save
          </CustomButton>
        </CardFooter>
      )}

      {showDialog && (
        <ConfirmationDialog
          open={true}
          title="Confirmation Required"
          description="Are you sure you want to proceed with this actions?"
          onConfirm={handleDialogConfirm}
          onCancel={() => setShowDialog(false)}
        />
      )}
    </Layout>
  );
}
