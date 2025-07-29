import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";

import FormBuilder from "../../components/form/FromBuilder";
import Loader from "../../components/loader/Loader";

import { fields } from "../../util/Form-menu/campaign-fields";
import { campaignValidationSchema } from "../../util/validation/campaignValidationSchema";
import Swal from "sweetalert2";

import {
  productTypes,
  deviceTypes,
  targetRegions,
  estimatePrice,
} from "../../api/campaign-api/targetingOptionService";

import {
  createCampaign,
  fetchCampaigns,
} from "../../redux/slices/campaignSlice";
import LoaderEmpt from "../../components/loader/LoaderEmpt";

const CreateCampaign = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.campaign);

  const methods = useForm({
    resolver: yupResolver(campaignValidationSchema),
  });

  const { watch, setValue } = methods;

  const [dropdowns, setDropdowns] = useState({
    product: [],
    targetDevices: [],
    regions: [],
    pincodes: [],
    regionMap: {}, // city => pincode[]
    pincodeMap: {}, // pincode => city
  });

  useEffect(() => {
    Promise.all([productTypes(), deviceTypes(), targetRegions()]).then(
      ([products, devices, regions]) => {
        const regionOptions = [];
        const pincodeOptions = [];
        const regionMap = {};
        const pincodeMap = {};

        regions.forEach((r) => {
          regionOptions.push({ label: r.city, value: r.city });
          pincodeOptions.push({ label: r.pincode, value: r.pincode });

          if (regionMap[r.city]) {
            regionMap[r.city].push(r.pincode);
          } else {
            regionMap[r.city] = [r.pincode];
          }

          pincodeMap[r.pincode] = r.city;
        });

        setDropdowns({
          product: products.map((d) => ({ label: d.product_type, value: d.product_type })),
          targetDevices: devices.map((d) => ({ label: d.deviceName, value: d.deviceName })),
          regions: regionOptions,
          pincodes: pincodeOptions,
          regionMap,
          pincodeMap,
        });
      }
    );
  }, []);

  useEffect(() => {
    const subscription = watch((values, { name: changedField }) => {
      const selectedRegions = values.regions || [];
      const selectedPincodes = values.pincode || [];

      // Skip if dropdowns are not loaded yet
      if (!dropdowns.regionMap || Object.keys(dropdowns.regionMap).length === 0) {
        return;
      }

      // Only sync if a specific field changed to avoid infinite loops
      if (changedField === 'regions') {
        // Regions changed → Update Pincodes
        if (selectedRegions.length > 0) {
          let derivedPincodes = [];
          selectedRegions.forEach((region) => {
            if (dropdowns.regionMap[region]) {
              derivedPincodes.push(...dropdowns.regionMap[region]);
            }
          });
          
          // Remove duplicates
          derivedPincodes = [...new Set(derivedPincodes)];

          // Only update if the pincode selection is actually different
          const currentPincodeSorted = [...selectedPincodes].sort();
          const derivedPincodeSorted = [...derivedPincodes].sort();
          
          if (JSON.stringify(currentPincodeSorted) !== JSON.stringify(derivedPincodeSorted)) {
            setValue("pincode", derivedPincodes, { shouldValidate: false });
          }
        } else {
          // If no regions selected, clear pincodes
          if (selectedPincodes.length > 0) {
            setValue("pincode", [], { shouldValidate: false });
          }
        }
      } 
      else if (changedField === 'pincode') {
        // Pincodes changed → Update Regions
        if (selectedPincodes.length > 0) {
          let derivedRegions = selectedPincodes
            .map((pin) => dropdowns.pincodeMap[pin])
            .filter(Boolean); // remove undefined values
          
          // Remove duplicates
          derivedRegions = [...new Set(derivedRegions)];

          // Only update if the region selection is actually different
          const currentRegionsSorted = [...selectedRegions].sort();
          const derivedRegionsSorted = [...derivedRegions].sort();
          
          if (JSON.stringify(currentRegionsSorted) !== JSON.stringify(derivedRegionsSorted)) {
            setValue("regions", derivedRegions, { shouldValidate: false });
          }
        } else {
          // If no pincodes selected, clear regions
          if (selectedRegions.length > 0) {
            setValue("regions", [], { shouldValidate: false });
          }
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, dropdowns.regionMap, dropdowns.pincodeMap, setValue]);


const handleSubmit = async (formData) => {
  if (loading) return;

  const result = await dispatch(createCampaign(formData));

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
};

  

  return (
    <div className="w-full">
      {loading?(<LoaderEmpt size="large"/>):''}
      <h2 className="text-xl lg:2xl font-semibold text-gray-800 mb-4">Create Campaign</h2>
      <FormBuilder
        onSubmit={handleSubmit}
        fieldsConfig={fields}
        dropdowns={{
          ...dropdowns,
          regions: dropdowns.regions,
          pincode: dropdowns.pincodes, // hook for FormBuilder
        }}
        methods={methods}
        estimateApi={estimatePrice}
        estimateWatchFields={["product", "regions", "targetDevices"]}
        estimateSetField="baseBid"
        title=""
        submitLabel="Submit For Approval"
        isPlus={false}
      />
    </div>
  );
};

export default CreateCampaign;