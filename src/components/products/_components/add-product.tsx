import {
  getFormSelectComplianceOptions,
  getFormSelectCustomerOptions,
  getFormSelectDependencyOptions,
  getFormSelectOptions,
  getFormSelectProductOptions,
  getFormSelectRevenueOptions,
} from "@/store/common/api";
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
    dispatch(
      getFormSelectProductOptions({
        request: `Enum/${SelectsEnum["Product_Live"]}`,
      }),
    );
    dispatch(
      getFormSelectRevenueOptions({
        request: `Enum/${SelectsEnum["Revenue_Impact"]}`,
      }),
    );
    dispatch(
      getFormSelectCustomerOptions({
        request: `Enum/${SelectsEnum["Customer_Data_Type"]}`,
      }),
    );
    dispatch(
      getFormSelectComplianceOptions({
        request: `Enum/${SelectsEnum["Compliance_Required"]}`,
      }),
    );
    dispatch(
      getFormSelectDependencyOptions({
        request: `Enum/${SelectsEnum["Dependency_Impact"]}`,
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
