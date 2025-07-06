import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import FieldRenderer from "./FieldRenderer";
import Button from "../ui/button/Button";
import { fields } from "../../util/Form-menu/campaign-fields";
import { estimatePrice } from "../../api/campaign-api/targetingOptionService";
import Loader from "../loader/Loader";
import { useSelector } from "react-redux";

const getGridClass = (field, row) => {
  if (field.gridSpan === 3 || row.length === 1)
    return "col-span-1 md:col-span-3";
  if (field.gridSpan === 2) return "col-span-1 md:col-span-2";
  return "col-span-1";
};

const FormBuilder = ({ onSubmit, dropdowns = {}, methods, isEdit = false ,loading = false  }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
  } = methods || useFormContext();

  const selectedProduct = watch("product");
  const selectedRegions = watch("regions");
  const selectedDevices = watch("targetDevices");

  useEffect(() => {
    const shouldFetch =
      selectedProduct?.length > 0 &&
      selectedRegions?.length > 0 &&
      selectedDevices?.length > 0;

    if (shouldFetch) {
      estimatePrice({
        productTypes: selectedProduct,
        regions: selectedRegions,
        devices: selectedDevices,
      }).then((estimatedPrice) => {
        setValue("baseBid", estimatedPrice);
      });
    }
  }, [selectedProduct, selectedRegions, selectedDevices, setValue]);

  const handleFormSubmit = (data) => {
    if (onSubmit) onSubmit(data);
  };

  // Inject dropdown options dynamically
  const injectedFields = fields.map((row) =>
    row.map((field) =>
      dropdowns[field.name]
        ? { ...field, options: dropdowns[field.name] }
        : field
    )
  );

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="p-6 bg-white rounded-xl shadow space-y-6"
    >
      <h2 className="text-xl font-semibold text-gray-800">
        {isEdit ? "Update Campaign" : "Create Campaign"}
      </h2>

      {injectedFields.map((row, rowIdx) => (
        <div key={rowIdx} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {row.map((field) => (
            <div key={field.name} className={getGridClass(field, row)}>
              <FieldRenderer field={field} control={control} errors={errors} />
            </div>
          ))}
        </div>
      ))}

      <div className="flex justify-end">
        <Button type="submit" label={isEdit ? "Update Campaign" : "Create Campaign"} loading={loading} />

      </div>
    </form>
  );
};

export default FormBuilder;
