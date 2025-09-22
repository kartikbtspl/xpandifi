import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";

import FormBuilder from "../../../components/form/FromBuilder";
import LoaderEmpt from "../../../components/loader/LoaderEmpt";
import Toast from "../../../components/ui/toast/Toast";
import { fields } from "../../../util/Form-menu/campaign-fields";
import {
  campaignValidationSchema,
  customizePayload,
} from "../../../util/validation/campaignValidationSchema";
import {
  createCampaign,
  fetchCampaigns,
} from "../../../redux/slices/user/campaignSlice";
import { fetchDropdownData } from "../../../redux/slices/user/cityProductDeviceSlice";
import { estimatePrice } from "../../../api/user/campaign-api/targetingOptionService";

const CreateCampaign = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { formLoading } = useSelector((state) => state.campaign);
  const {
    data: dropdownData = {
      cityRegionMap: {},
      products: [],
      devices: [],
      cities: [],
    },
    loading: dropdownLoading,
  } = useSelector((state) => state.cityProductDevice);

  const methods = useForm({
    resolver: yupResolver(campaignValidationSchema),
    defaultValues: {
      regions: [],
    },
  });

  const [dropdowns, setDropdowns] = useState({
    product: [],
    targetDevices: [],
    cities: [],
    regions: [],
  });

  // Load dropdowns
  useEffect(() => {
    if (dropdownData && Object.keys(dropdownData).length) {
      const allRegions = Object.values(dropdownData.cityRegionMap || {}).flat();
      setDropdowns({
        product: dropdownData.products || [],
        targetDevices: dropdownData.devices || [],
        cities: dropdownData.cities || [],
        regions: allRegions,
      });
    } else {
      dispatch(fetchDropdownData());
    }
  }, [dropdownData, dispatch]);

  // Submit handler
// const handleSubmit = async (formData) => {
//   if (formLoading) return;

//   // Build cityregions directly
//   const cityregions = {};

//   // formData.regions contains selected region IDs
//   (formData.regions || []).forEach((regionId) => {
//     const regionObj = Object.values(dropdownData.cityRegionMap)
//       .flat()
//       .find((r) => r.value === regionId);

//     if (!regionObj) return;

//     const cityName = regionObj.cityName;
//     if (!cityregions[cityName]) cityregions[cityName] = [];

//     cityregions[cityName].push({
//       name: regionObj.label,
//       postcode: regionObj.postcode,
//     });
//   });

//   // Customize payload and remove the extra 'regions' field
//   const payload = {
//     ...customizePayload(formData, dropdownData.cityRegionMap),
//     cityregions, // ✅ only this is needed
//      dateRange: JSON.stringify({
//     start: formData.dateRange[0], // start date
//     end: formData.dateRange[1],   // end date
//   }),
//   };

//   const result = await dispatch(createCampaign(payload));

//   if (createCampaign.fulfilled.match(result)) {
//     dispatch(fetchCampaigns());
//     methods.reset();
//     Toast.success("Campaign created successfully!");
//     navigate("/");
//   } else if (createCampaign.rejected.match(result)) {
//     Toast.error(result.payload?.message || "Something went wrong.");
//   }
// };

const handleSubmit = async (formData) => {
  if (formLoading) return;

  // Map objective value → label
  const objectiveField = fields
    .flat()
    .find((f) => f.name === "objective");

  const objectiveLabel =
    objectiveField?.options.find(
      (opt) => opt.value === formData.objective
    )?.label || "";

  // Build cityregions directly
  const cityregions = {};
  (formData.regions || []).forEach((regionId) => {
    const regionObj = Object.values(dropdownData.cityRegionMap)
      .flat()
      .find((r) => r.value === regionId);

    if (!regionObj) return;

    const cityName = regionObj.cityName;
    if (!cityregions[cityName]) cityregions[cityName] = [];

    cityregions[cityName].push({
      name: regionObj.label,
      postcode: regionObj.postcode,
    });
  });

  // Customize payload and remove the extra 'regions' field
  const payload = {
    ...customizePayload(formData, dropdownData.cityRegionMap),
    cityregions,
    dateRange: JSON.stringify({
      start: formData.dateRange[0],
      end: formData.dateRange[1],
    }),
    objective: objectiveLabel,
  };


  const result = await dispatch(createCampaign(payload));

  if (createCampaign.fulfilled.match(result)) {
    dispatch(fetchCampaigns());
    methods.reset();
    Toast.success("Campaign created successfully!");
    navigate("/");
  } else if (createCampaign.rejected.match(result)) {
    Toast.error(result.payload?.message || "Something went wrong.");
  }
};


  if (dropdownLoading || !dropdownData) return <LoaderEmpt size="large" />;

  // Update fields with dropdowns
  const updatedFields = fields.map((group) =>
    group.map((field) => {
      if (field.name === "product")
        return { ...field, options: dropdowns.product };
      if (field.name === "targetDevices")
        return { ...field, options: dropdowns.targetDevices };
      if (field.name === "regions")
        return { ...field, options: dropdowns.regions, multi: true };
      return field;
    })
  );

  return (
    <div className="w-full">
      {formLoading && <LoaderEmpt size="large" />}
      <h2 className="text-xl lg:2xl font-semibold text-gray-800 mb-4">
        Create Campaign
      </h2>

      <FormBuilder
        onSubmit={handleSubmit}
        fieldsConfig={updatedFields}
        isEdit={false}
        methods={methods}
        estimateApi={estimatePrice}
        estimateWatchFields={["product", "regions", "targetDevices"]}
        estimateSetField="baseBid"
        title=""
        submitLabel="Submit For Approval"
      />
    </div>
  );
};

export default CreateCampaign;