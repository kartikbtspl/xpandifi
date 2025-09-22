import * as yup from "yup";

// Validation schema
export const campaignValidationSchema = yup.object().shape({
  name: yup.string().required("Campaign name is required"),
  objective: yup.string().required("Select a campaign objective"),
  product: yup.string().required("Select at least one product"),
  adType: yup.string().required("Ad Type is required"),
  brandName: yup.string().required("Brand name is required"),
  duration: yup
    .number()
    .typeError("Duration must be a number")
    .positive("Duration must be positive")
    .required("Duration is required"),
dateRange: yup
  .array()
  .of(yup.date().required())
  .min(2, "Select a valid date range")
  .required("Date range is required")
  .transform((value, originalValue) => {
    if (originalValue?.start && originalValue?.end) {
      return [originalValue.start, originalValue.end]; // always array
    }
    return value;
  }),


  timings: yup.string().required("Please select a time slot"),
  ageGroup: yup.string().required("Select a target age group"),
  storeTypes: yup.string().required("Store type is required"),
  targetDevices: yup.array().min(1, "Select at least one device").required(),
  regions: yup.array().min(1, "Select at least one device").required(),

  productFiles: yup
    .mixed()
    .test("required", "At least one product file is required", (value) => value?.length > 0),
  campaignBudget: yup.string().required("Budget is required"),
  baseBid: yup
    .number()
    .typeError("Base Bid must be a number")
    .required("Base Bid is required"),
  maxBidCap: yup.string().required("Max bid cap is required"),
});

export const customizePayload = (formData, cityRegionMap) => {
  const cityregions = {};

  const selectedCities = formData.cities || [];
  const selectedRegions = formData.regions || {}; // { cityId: [{label,value,postcode}] }

  selectedCities.forEach((city) => {
    const cityId = String(city.value);
    const cityName = cityRegionMap[cityId]?.[0]?.cityName; // get city name
    const regions = selectedRegions[cityId] || [];
    if (regions.length) {
      cityregions[cityName] = regions.map((r) => ({
        name: r.label,
        postcode: r.postcode,
      }));
    }
  });

  return {
    ...formData,
    cityregions, // final format
  };
};
