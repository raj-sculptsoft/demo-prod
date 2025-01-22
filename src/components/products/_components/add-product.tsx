import { getFormSelectOptions } from "@/store/common/api";
import { useEffect } from "react";
import CustomButton from "../../../components/core/custom-button";
import { useAppDispatch } from "../../../hooks/use-store";
import { SelectsEnum } from "../../../lib/common";
import { setShowProductForm } from "../../../store/products/slice";

export default function AddProduct() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      getFormSelectOptions({
        request: `Enum/${SelectsEnum["Target_Audience"]}`,
      }),
    );
  }, [dispatch]);

  return (
    <CustomButton
      color="primary"
      onClick={() => dispatch(setShowProductForm(true))}
    >
      Add New
    </CustomButton>
  );
}
