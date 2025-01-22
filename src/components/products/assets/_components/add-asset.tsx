"use client";

import CustomButton from "@/components/core/custom-button";
import { useAppDispatch } from "@/hooks/use-store";
import { SelectsEnum } from "@/lib/common";
import { setShowAssetForm } from "@/store/assets/slice";
import { getFormSelectOptions } from "@/store/common/api";
import { useEffect } from "react";

export default function AddAsset() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      getFormSelectOptions({
        request: `Enum/${SelectsEnum["Programming_Language"]}`,
      }),
    );
  }, [dispatch]);

  return (
    <CustomButton
      color="primary"
      onClick={() => dispatch(setShowAssetForm(true))}
    >
      Add New
    </CustomButton>
  );
}
