// LinkAssetsPage.tsx
import CustomButton from "@/components/core/custom-button";
import { FormMultiSelect } from "@/components/core/form-fields/multi-select";
import { FormSelect } from "@/components/core/form-fields/select";
import config from "@/config/env";
import { useAppDispatch, useAppSelector } from "@/hooks/use-store";
import { toast } from "@/hooks/use-toast";
import {
  defaultPayloadForWithoutPagination,
  getSelectOptions,
} from "@/lib/common";
import { FormSchemaAPI } from "@/schemas/settings";
import { getAllProducts } from "@/store/common/api";
import {
  addOrEditTargets,
  fetchStatusById,
  getProjectLink,
  getTargetList,
} from "@/store/settings/api";
import { resetLinkProjectState, setStatusId } from "@/store/settings/slice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form"; // NEW: Import FormProvider
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import ConfirmationDialog from "../../../core/dialog";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../ui/card";
import LanguageSelectionDialog from "./_component/add-language";
import TagList from "./_component/tag-list";
import Layout from "./layout";

interface PendingProject {
  product_id: string;
  product_name: string;
  project_id: string;
  project_name: string;
  selected_languages: string[];
}

export default function LinkAssetsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof FormSchemaAPI>>({
    resolver: zodResolver(FormSchemaAPI),
    defaultValues: {
      product_id: "",
      semgrep_project_id: [],
    },
  });

  const { reset, setValue, watch } = form;
  const { loading: productsLoading, data: { list: productsList = [] } = {} } =
    useAppSelector(({ common }) => common.products);
  const { targetListLoading, targets, linkProject } = useAppSelector(
    ({ synk }) => synk,
  );
  const targetsList = targets?.list || [];

  const [linkedData, setLinkedData] = useState<
    {
      product: string;
      product_id: string;
      tags: { id: string; label: string; program_language: string[] | null }[];
    }[]
  >([]);
  const [showDialog, setShowDialog] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [pendingProject, setPendingProject] = useState<PendingProject | null>(
    null,
  );
  const [languageSelections, setLanguageSelections] = useState<
    Record<string, string[]>
  >({});
  const [languageErrors, setLanguageErrors] = useState<{
    [key: string]: string;
  }>({});

  useEffect(() => {
    dispatch(
      getAllProducts({
        company_id: config.COMPANY_ID,
        ...defaultPayloadForWithoutPagination,
      }),
    );
    dispatch(getProjectLink(config.COMPANY_ID));
    dispatch(getTargetList(config.COMPANY_ID));
  }, [dispatch]);

  const sortedProductsList = useMemo(() => {
    if (!productsList?.length) return [];
    return [...productsList].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  }, [productsList]);

  useEffect(() => {
    if (linkProject && targets) {
      const validTargetIds = new Set(
        targets.list.map((target) => target.semgrep_project_id),
      );

      const transformedData = linkProject?.products
        .map((product) => ({
          product: product.product_name,
          product_id: product.product_id,
          tags: product.projects
            .filter((project) => validTargetIds.has(project.project_id))
            .map((project) => ({
              id: project.project_id,
              label: project.project_name,
              program_language: Array.isArray(project.program_language)
                ? project.program_language
                : project.program_language
                  ? [project.program_language]
                  : null,
            })),
        }))
        .filter((product) => product.tags.length > 0);

      setLinkedData(transformedData);

      const newLanguageSelections: Record<string, string[]> = {};
      transformedData.forEach((product) => {
        product.tags.forEach((tag) => {
          if (tag.program_language) {
            newLanguageSelections[tag.id] = tag.program_language;
          }
        });
      });

      setLanguageSelections(newLanguageSelections);
    }
  }, [linkProject, targets]);

  const handleSave = () => {
    const errors: { [key: string]: string } = {};

    linkedData.forEach((item) => {
      item.tags.forEach((tag) => {
        if (!tag.program_language) {
          errors[tag.id] = "Programming Language is required.";
        }
      });
    });

    setLanguageErrors(errors);

    if (Object.keys(errors).length === 0) {
      setShowDialog(true);
    }
  };

  const handleDialogConfirm = async () => {
    try {
      const payload = {
        products: linkedData.map((item) => ({
          product_id: item.product_id,
          projects: item.tags.map((tag) => ({
            project_id: tag.id,
            project_name: tag.label,
            program_language: tag.program_language || null,
          })),
        })),
      };

      const { data } = await dispatch(addOrEditTargets(payload)).unwrap();
      dispatch(resetLinkProjectState());
      const statusId = data.list[0]?.status_id;
      if (statusId) {
        dispatch(setStatusId(statusId));
        await dispatch(fetchStatusById(statusId));
      }
      if (linkedData.length > 0 && (linkedData[0]?.tags ?? []).length > 1) {
        navigate(`/vulnerabilities?product=${data.list[0]?.product_id}`);
      } else {
        navigate(
          `/vulnerabilities?product=${data.list[0]?.product_id}&asset=${data.list[0]?.asset_id}`,
        );
      }
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
      data.semgrep_project_id.includes(target.semgrep_project_id),
    );

    if (selectedProduct) {
      const tagList = selectedTargets.map((target) => {
        let selectedLanguage: string[] | null = null;

        const targetLanguage = languageSelections[target.semgrep_project_id];
        if (targetLanguage !== undefined) {
          selectedLanguage = Array.isArray(targetLanguage)
            ? targetLanguage
            : [targetLanguage];
        }

        const productInLinked = linkedData.find(
          (item) => item.product_id === selectedProduct.product_id,
        );
        if (productInLinked) {
          const existingTag = productInLinked.tags.find(
            (tag) => tag.id === target.semgrep_project_id,
          );

          if (existingTag?.program_language) {
            selectedLanguage = Array.isArray(existingTag.program_language)
              ? existingTag.program_language
              : [existingTag.program_language]; // Ensure it's an array
          }
        }
        return {
          id: target.semgrep_project_id,
          label: target.semgrep_project_name,
          program_language: selectedLanguage,
        };
      });

      setLinkedData((prev) => {
        const otherProducts = prev.filter(
          (item) => item.product_id !== selectedProduct.product_id,
        );
        return [
          {
            product: selectedProduct.product_name,
            product_id: selectedProduct.product_id,
            tags: tagList,
          },
          ...otherProducts,
        ];
      });
    }

    reset();
  };

  const handleLanguageSelect = (program_language: string[]) => {
    if (pendingProject) {
      setLanguageSelections((prev) => ({
        ...prev,
        [pendingProject.project_id]: program_language,
      }));

      setLinkedData((prev) =>
        prev.map((product) => {
          if (product.product_id === pendingProject.product_id) {
            return {
              ...product,
              tags: product.tags.map((tag) =>
                tag.id === pendingProject.project_id
                  ? { ...tag, program_language }
                  : tag,
              ),
            };
          }
          return product;
        }),
      );
    }
    setLanguageErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      if (pendingProject) {
        delete updatedErrors[pendingProject.project_id];
      }
      return updatedErrors;
    });
    setShowLanguageModal(false);
  };

  const handleEditLanguage = (projectId: string) => {
    const productItem = linkedData.find((item) =>
      item.tags.some((tag) => tag.id === projectId),
    );
    if (productItem) {
      const project = productItem.tags.find((tag) => tag.id === projectId);
      if (project) {
        const selectedLanguages =
          languageSelections[projectId] || project.program_language || [];

        setPendingProject({
          product_id: productItem.product_id,
          product_name: productItem.product,
          project_id: project.id,
          project_name: project.label,
          selected_languages: selectedLanguages,
        });
        setShowLanguageModal(true);
      }
    }
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
        .filter((item) => item.tags.length > 0),
    );

    setLanguageSelections((prev) => {
      const newSelections = { ...prev };
      delete newSelections[tagId];
      return newSelections;
    });

    setLanguageErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[tagId];
      return newErrors;
    });
  };

  const unselectedTargets = useMemo(() => {
    const selectedTargets = linkedData
      .filter((item) => item.product_id !== watch("product_id"))
      .flatMap((item) => item.tags.map((tag) => tag.id));

    return targetsList.filter(
      (target) => !selectedTargets.includes(target.semgrep_project_id),
    );
  }, [linkedData, targetsList, watch("product_id")]);

  useEffect(() => {
    const selectedProductId = watch("product_id");
    const existingProduct = linkedData.find(
      (item) => item.product_id === selectedProductId,
    );

    if (existingProduct) {
      const tags = existingProduct.tags.map((tag) => tag.id);
      setValue("semgrep_project_id", tags as [string, ...string[]]);
    } else {
      setValue("semgrep_project_id", [] as unknown as [string, ...string[]]);
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
            <FormProvider {...form}>
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
                  name="semgrep_project_id"
                  label="Select Project"
                  placeholder="Select Project"
                  isLoading={targetListLoading}
                  options={getSelectOptions(
                    unselectedTargets.map((item) => ({
                      ...item,
                      semgrep_project_name:
                        item.semgrep_project_name.length > 70
                          ? `${item.semgrep_project_name.slice(0, 70)}...`
                          : item.semgrep_project_name,
                    })),
                    "semgrep_project_name",
                    "semgrep_project_id",
                  )}
                />
              </form>
            </FormProvider>
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
                onTagEdit={handleEditLanguage}
                languageErrors={languageErrors}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {linkedData.some((item) => item.tags.length > 0) && (
        <CardFooter className="ml-[-20px] mt-4 block text-start">
          <CustomButton className="px-14 py-6" onClick={() => handleSave()}>
            Save
          </CustomButton>
        </CardFooter>
      )}

      {showDialog && (
        <ConfirmationDialog
          open={true}
          title="Confirmation Required"
          description="Are you sure you want to proceed with these actions?"
          onConfirm={handleDialogConfirm}
          onCancel={() => setShowDialog(false)}
        />
      )}

      {showLanguageModal && pendingProject && (
        <LanguageSelectionDialog
          open={true}
          onClose={() => setShowLanguageModal(false)}
          onConfirm={handleLanguageSelect}
          selectedProject={pendingProject}
        />
      )}
    </Layout>
  );
}
