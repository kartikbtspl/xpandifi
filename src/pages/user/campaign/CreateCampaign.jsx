import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  estimatePrice,
} from "../../../api/user/campaign-api/targetingOptionService";

import FormBuilder from "../../../components/form/FromBuilder";
import LoaderEmpt from "../../../components/loader/LoaderEmpt";

import { fields } from "../../../util/Form-menu/campaign-fields";
import { campaignValidationSchema,customizePayload } from "../../../util/validation/campaignValidationSchema";
import Swal from "sweetalert2";

import { createCampaign, fetchCampaigns } from "../../../redux/slices/user/campaignSlice";
import { fetchDropdownData } from "../../../redux/slices/user/cityProductDeviceSlice";
import { text } from "@fortawesome/fontawesome-svg-core";
import { icons } from "antd/es/image/PreviewGroup";



const CreateCampaign = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.campaign);
  const { data: dropdownData, loading: dropdownLoading } = useSelector(
    (state) => state.cityProductDevice
  );

  const methods = useForm({
    resolver: yupResolver(campaignValidationSchema),
  });

  const { watch, setValue } = methods;

  const [dropdowns, setDropdowns] = useState({
    product: [],
    targetDevices: [],
    regions: [],
    pincodes: [],
    regionMap: {},
    pincodeMap: {},
  });

  // Fetch dropdown data from Redux on mount if not present
  useEffect(() => {
    if (!dropdownData) {
      dispatch(fetchDropdownData());
    }
  }, [dispatch, dropdownData]);

  // When dropdownData updates, build options and maps
  useEffect(() => {
    if (!dropdownData) return;

    const regionOptions = [];
    const pincodeOptions = [];
    const regionMap = {};
    const pincodeMap = {};

    dropdownData.locations.forEach((loc) => {
  if (loc.name) {
    regionOptions.push({ label: loc.name, value: loc.name });
  }
  if (loc.postcode) {
    pincodeOptions.push({ label: loc.postcode, value: loc.postcode });
  }

  if (regionMap[loc.name]) {
    if (loc.postcode) regionMap[loc.name].push(loc.postcode);
  } else {
    regionMap[loc.name] = loc.postcode ? [loc.postcode] : [];
  }

  if (loc.postcode) {
    pincodeMap[loc.postcode] = loc.name;
  }
});


    const productOptions = dropdownData.products.map((p) => ({
      label: p.name,
      value: p.name,
    }));

    const deviceOptions = dropdownData.devices.map((d) => ({
      label: d.name,
      value: d.name,
    }));

    setDropdowns({
      product: productOptions,
      targetDevices: deviceOptions,
      regions: regionOptions,
      pincodes: pincodeOptions,
      regionMap,
      pincodeMap,
    });
  }, [dropdownData]);

  // Sync pincodes ↔ regions selections
  useEffect(() => {
    const subscription = watch((values, { name: changedField }) => {
      const selectedRegions = values.regions || [];
      const selectedPincodes = values.pincode || [];

      if (!dropdowns.regionMap || Object.keys(dropdowns.regionMap).length === 0) {
        return;
      }

      if (changedField === "regions") {
        if (selectedRegions.length > 0) {
          let derivedPincodes = [];
          selectedRegions.forEach((region) => {
            if (dropdowns.regionMap[region]) {
              derivedPincodes.push(...dropdowns.regionMap[region]);
            }
          });

          derivedPincodes = [...new Set(derivedPincodes)];

          const currentPincodeSorted = [...selectedPincodes].sort();
          const derivedPincodeSorted = [...derivedPincodes].sort();

          if (JSON.stringify(currentPincodeSorted) !== JSON.stringify(derivedPincodeSorted)) {
            setValue("pincode", derivedPincodes, { shouldValidate: false });
          }
        } else if (selectedPincodes.length > 0) {
          setValue("pincode", [], { shouldValidate: false });
        }
      } else if (changedField === "pincode") {
        if (selectedPincodes.length > 0) {
          let derivedRegions = selectedPincodes
            .map((pin) => dropdowns.pincodeMap[pin])
            .filter(Boolean);

          derivedRegions = [...new Set(derivedRegions)];

          const currentRegionsSorted = [...selectedRegions].sort();
          const derivedRegionsSorted = [...derivedRegions].sort();

          if (JSON.stringify(currentRegionsSorted) !== JSON.stringify(derivedRegionsSorted)) {
            setValue("regions", derivedRegions, { shouldValidate: false });
          }
        } else if (selectedRegions.length > 0) {
          setValue("regions", [], { shouldValidate: false });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, dropdowns.regionMap, dropdowns.pincodeMap, setValue]);

  // Submit handler
  const handleSubmit = async (formData) => {
    if (loading) return;

    const payload = customizePayload(formData);

    const result = await dispatch(createCampaign(payload));

    if (createCampaign.fulfilled.match(result)) {
      await dispatch(fetchCampaigns());
      methods.reset();

      await Swal.fire({
        title: "Success!",
        text: "Campaign created successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });

      navigate("/");
    }
    if (createCampaign.rejected.match(result)) {
    await Swal.fire({
      title: 'Error', //  Title should be in quotes
      text: "Something went wrong.", //  Proper error access
      icon: 'warning',
      confirmButtonText: "OK"
    });
  }
  };




  // Show loader while dropdowns loading
  if (dropdownLoading || !dropdownData) {
    return <LoaderEmpt size="large" />;
  }

  return (
    <div className="w-full">
      {loading && <LoaderEmpt size="large" />}
      <h2 className="text-xl lg:2xl font-semibold text-gray-800 mb-4">Create Campaign</h2>
      <FormBuilder
        
        onSubmit={handleSubmit}
        fieldsConfig={fields}
        isEdit={false}
        dropdowns={{
          ...dropdowns,
          regions: dropdowns.regions,
          pincode: dropdowns.pincodes, // prop name matches expected by FormBuilder
        }}
        methods={methods}
        estimateApi={estimatePrice}
        estimateWatchFields={["product", "regions", "targetDevices"]}
        estimateSetField="baseBid"
        title=""
        submitLabel="Submit For Approval"
        loading={loading}
      />
    </div>
  );
};

export default CreateCampaign;