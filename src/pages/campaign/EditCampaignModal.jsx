import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { Modal } from "../../components/ui/modal/Modal";
import FormBuilder from "../../components/form/FromBuilder";
import Loader from "../../components/loader/Loader";
import Swal from "sweetalert2";

import {
  // productTypes,
  // targetRegions,
  // deviceTypes,
  estimatePrice,
} from "../../api/campaign-api/targetingOptionService";

import { updateCampaign } from "../../redux/slices/campaignDetailSlice";
import { fields } from "../../util/Form-menu/campaign-fields";

const EditCampaignModal = ({ isOpen, onClose, campaignData, onSuccess }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.campaignDetail);
  const [oldImages, setOldImage] = useState([]);
  console.log("campaignData: ", campaignData);

  const methods = useForm({ defaultValues: {} });

  const [dropdowns, setDropdowns] = useState({
    product: [],
    targetDevices: [],
    regions: [],
    pincodes: [],
    regionMap: {},
    pincodeMap: {},
  });

  // Fetch and prepare dropdowns
  // useEffect(() => {
  //   const fetchDropdowns = async () => {
  //     try {
  //       const [products, devices, regions] = await Promise.all([
  //         productTypes(),
  //         deviceTypes(),
  //         targetRegions(),
  //       ]);

  //       const regionMap = {};
  //       const pincodeMap = {};
  //       const regionOptions = [];
  //       const pincodeOptions = [];

  //       regions.forEach(({ city, pincode }) => {
  //         regionOptions.push({ label: city, value: city });
  //         pincodeOptions.push({ label: pincode, value: pincode });

  //         if (!regionMap[city]) regionMap[city] = [];
  //         regionMap[city].push(pincode);

  //         pincodeMap[pincode] = city;
  //       });

  //       setDropdowns({
  //         product: products.map((d) => ({
  //           label: d.product_type,
  //           value: d.product_type,
  //         })),
  //         targetDevices: devices.map((d) => ({
  //           label: d.deviceName,
  //           value: d.deviceName,
  //         })),
  //         regions: regionOptions,
  //         pincodes: pincodeOptions,
  //         regionMap,
  //         pincodeMap,
  //       });
  //     } catch (error) {
  //       console.error("Error loading dropdowns:", error);
  //     }
  //   };

  //   fetchDropdowns();
  // }, []);

  useEffect(() => {
    const images = [...campaignData.productFiles];
    setOldImage(images);
  }, [campaignData]);

  // Set default values for edit form
  useEffect(() => {
    if (campaignData && Object.keys(dropdowns.regionMap).length > 0) {
      const selectedRegions = campaignData.regions || [];

      // Derive pincodes from selected regions
      const derivedPincodes = [
        ...new Set(
          selectedRegions.flatMap((region) => dropdowns.regionMap[region] || [])
        ),
      ];

      methods.reset({
        ...campaignData,
        product: campaignData.product || [],
        targetDevices: campaignData.targetDevices || [],
        regions: selectedRegions,
        pincode: derivedPincodes,
        productFiles: campaignData.productFiles || [],
        timings: campaignData.timings || "",
      });
      // updating the array
      // setOldImage([]);
    }
  }, [campaignData, dropdowns.regionMap, methods]);

  // Bidirectional sync: regions ↔ pincodes
  useEffect(() => {
    const subscription = methods.watch((values, { name }) => {
      const selectedRegions = values.regions || [];
      const selectedPincodes = values.pincode || [];

      if (!dropdowns.regionMap || !dropdowns.pincodeMap) return;

      if (name === "regions") {
        const derivedPincodes = [
          ...new Set(
            selectedRegions.flatMap(
              (region) => dropdowns.regionMap[region] || []
            )
          ),
        ];

        const currentSorted = [...selectedPincodes].sort();
        const derivedSorted = [...derivedPincodes].sort();

        if (JSON.stringify(currentSorted) !== JSON.stringify(derivedSorted)) {
          methods.setValue("pincode", derivedPincodes, {
            shouldValidate: false,
          });
        }
      }

      if (name === "pincode") {
        const derivedRegions = [
          ...new Set(
            selectedPincodes
              .map((pin) => dropdowns.pincodeMap[pin])
              .filter(Boolean)
          ),
        ];

        const currentSorted = [...selectedRegions].sort();
        const derivedSorted = [...derivedRegions].sort();

        if (JSON.stringify(currentSorted) !== JSON.stringify(derivedSorted)) {
          methods.setValue("regions", derivedRegions, {
            shouldValidate: false,
          });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [methods, dropdowns.regionMap, dropdowns.pincodeMap]);

  // const handleUpdate = async (formData) => {
  //   const allFiles = formData.productFiles || [];

  //   // ✅ Split into existing (previewed) and new files
  //   const oldImages = allFiles.filter((item) => typeof item === 'string');
  //   const newFiles = allFiles.filter((item) => item instanceof File);

  //   // ✅ Keep newFiles in formData so backend can attach them
  //   const preparedData = {
  //     ...formData,
  //     productFiles: newFiles, // only send actual File objects here
  //   };

  //   try {
  //     await dispatch(updateCampaign({
  //       id: campaignData.id,
  //       data: preparedData,
  //       oldImages, // only visible (not removed) existing image URLs
  //     }));

  //     toast.success("Campaign updated successfully");
  //     onSuccess?.();
  //     onClose();
  //   } catch (err) {
  //     toast.error("Failed to update campaign");
  //   }
  // };

  const handleUpdate = async (formData) => {
    const allFiles = formData.productFiles || [];

    // ✅ Split into existing (previewed) and new files
    const oldImages = allFiles.filter((item) => typeof item === "string");
    const newFiles = allFiles.filter((item) => item instanceof File);

    // ✅ Keep newFiles in formData so backend can attach them
    const preparedData = {
      ...formData,
      productFiles: newFiles, // only send actual File objects here
    };

    try {
      await dispatch(
        updateCampaign({
          id: campaignData.id,
          data: preparedData,
          oldImages, // only visible (not removed) existing image URLs
        })
      );

      // ✅ Trigger success callback and close modal first
      onSuccess?.();
      onClose?.();

      // ✅ Then show success message after a short delay (to allow modal to close)
      setTimeout(() => {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Campaign updated successfully",
        });
      }, 300); // Adjust delay based on your modal's close animation time
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update campaign",
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <FormProvider {...methods}>
        <div className="max-h-[80vh] rounded-lg relative">
          {loading && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 rounded-md">
              <div className="flex flex-col items-center gap-2">
                <h2 className="text-sm text-gray-700">Updating Campaign...</h2>
                <Loader />
              </div>
            </div>
          )}
          {/* <div className="w-full flex text-left pl-4 py-2">
            <p className="text-red-500 text-center">
              {campaignData.remark}
            </p>
          </div> */}

          <FormBuilder
            onSubmit={handleUpdate}
            fieldsConfig={fields}
            dropdowns={{
              ...dropdowns,
              pincode: dropdowns.pincodes, // rename for FormBuilder compatibility
            }}
            methods={methods}
            isEdit={true}
            loading={loading}
            estimateApi={estimatePrice}
            estimateWatchFields={[
              "product",
              "regions",
              "targetDevices",
              "pincode",
            ]}
            estimateSetField="baseBid"
            isPlus={false}
            title={
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full pr-12">
                <span className="text-xl font-bold text-gray-800">
                  Update Campaign
                </span>

                {campaignData.remark && (
                  <div className="flex items-center mt-1 sm:mt-0 text-sm sm:max-w-xs truncate text-right">
                    <span class="relative flex size-2 mx-2">
                      <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                      <span class="relative inline-flex size-2 rounded-full bg-red-500"></span>
                    </span>{" "}
                    <span
                      className="text-red-500 text-md truncate"
                      title={campaignData.remark}
                    >
                      {campaignData.remark}
                    </span>
                  </div>
                )}
              </div>
            }
            submitLabel="Update"
          />
        </div>
      </FormProvider>
    </Modal>
  );
};

export default EditCampaignModal;
