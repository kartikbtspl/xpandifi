// src/pages/campaign/CreateCampaign.jsx
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
      pincode: [],
    },
  });

  const [dropdowns, setDropdowns] = useState({
    product: [],
    targetDevices: [],
    cities: [],
    regions: [],
  });

  // 🔹 Load dropdowns
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

  // 🔹 Sync Regions ↔ Pincode directly from regions
  useEffect(() => {
    const subscription = methods.watch((value, { name }) => {
      if (name === "pincode") {
        const selectedPincodes = value.pincode || [];

        // Regions whose postcode matches the selected pincodes
        const matchedRegions = dropdowns.regions
          .filter((r) => selectedPincodes.includes(r.postcode))
          .map((r) => r.value);

        const uniqueRegions = [...new Set(matchedRegions)];

        if (
          JSON.stringify(uniqueRegions) !== JSON.stringify(value.regions || [])
        ) {
          methods.setValue("regions", uniqueRegions, { shouldValidate: true });
        }
      }

      if (name === "regions") {
        const selectedRegions = value.regions || [];

        // Pincodes for the selected regions
        const matchedPincodes = dropdowns.regions
          .filter((r) => selectedRegions.includes(r.value))
          .map((r) => r.postcode);

        const uniquePincodes = [...new Set(matchedPincodes)];

        // ✅ only update if different to prevent infinite loop
        if (
          JSON.stringify(uniquePincodes) !== JSON.stringify(value.pincode || [])
        ) {
          methods.setValue("pincode", uniquePincodes, { shouldValidate: true });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [methods, dropdowns.regions]);

  // 🔹 Submit handler
  const handleSubmit = async (formData) => {
    if (formLoading) return;


    // Map objective value → label
    const objectiveField = fields.flat().find((f) => f.name === "objective");
    const objectiveLabel =
      objectiveField?.options.find((opt) => opt.value === formData.objective)
        ?.label || "";

    // Build cityregions directly
    const cityregions = {};
    (formData.regions || []).forEach((regionId) => {
      const regionObj = dropdowns.regions.find((r) => r.value === regionId);
      if (!regionObj) return;

      const cityName = regionObj.cityName;
      if (!cityregions[cityName]) cityregions[cityName] = [];

      cityregions[cityName].push({
        name: regionObj.label,
        postcode: regionObj.postcode,
      });
    });

    const payload = {
      ...customizePayload(formData, dropdownData.cityRegionMap),
      cityregions,
      dateRange: JSON.stringify({
        start: formData.dateRange[0],
        end: formData.dateRange[1],
      }),
      objective: objectiveLabel,
    };

    // ❌ ensure pincode not sent
    delete payload.pincode;

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

  // 🔹 Update fields with dropdowns
  const updatedFields = fields.map((group) =>
    group.map((field) => {
      if (field.name === "product")
        return { ...field, options: dropdowns.product };
      if (field.name === "targetDevices")
        return { ...field, options: dropdowns.targetDevices };
      if (field.name === "regions")
        return { ...field, options: dropdowns.regions, multi: true };
      if (field.name === "pincode")
        return {
          ...field,
          options: dropdowns.regions.map((r) => ({
            label: r.postcode,
            value: r.postcode,
          })),
          multi: true,
        };
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
        isSeconBtn={true}
        secondButtonLabel="Save as Draft" 
      />
    </div>
  );
};

export default CreateCampaign;