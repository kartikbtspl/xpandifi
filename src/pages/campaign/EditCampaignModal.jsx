import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { Modal } from "../../components/ui/modal/Modal";
import FormBuilder from "../../components/form/FromBuilder";
import Loader from "../../components/loader/Loader";

import {
  productTypes,
  targetRegions,
  deviceTypes,
  estimatePrice,
} from "../../api/campaign-api/targetingOptionService";

import { updateCampaign } from "../../redux/slices/campaignDetailSlice";
import { fields } from "../../util/Form-menu/campaign-fields";

const EditCampaignModal = ({ isOpen, onClose, campaignData, onSuccess }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.campaignDetail);

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
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [products, devices, regions] = await Promise.all([
          productTypes(),
          deviceTypes(),
          targetRegions(),
        ]);

        const regionMap = {};
        const pincodeMap = {};
        const regionOptions = [];
        const pincodeOptions = [];

        regions.forEach(({ city, pincode }) => {
          regionOptions.push({ label: city, value: city });
          pincodeOptions.push({ label: pincode, value: pincode });

          if (!regionMap[city]) regionMap[city] = [];
          regionMap[city].push(pincode);

          pincodeMap[pincode] = city;
        });

        setDropdowns({
          product: products.map((d) => ({ label: d.product_type, value: d.product_type })),
          targetDevices: devices.map((d) => ({ label: d.deviceName, value: d.deviceName })),
          regions: regionOptions,
          pincodes: pincodeOptions,
          regionMap,
          pincodeMap,
        });
      } catch (error) {
        console.error("Error loading dropdowns:", error);
      }
    };

    fetchDropdowns();
  }, []);

  // Set default values for edit form
  useEffect(() => {
    if (
      campaignData &&
      Object.keys(dropdowns.regionMap).length > 0
    ) {
      const selectedRegions = campaignData.regions || [];

      // Derive pincodes from selected regions
      const derivedPincodes = [...new Set(
        selectedRegions.flatMap((region) => dropdowns.regionMap[region] || [])
      )];

      methods.reset({
        ...campaignData,
        product: campaignData.product || [],
        targetDevices: campaignData.targetDevices || [],
        regions: selectedRegions,
        pincode: derivedPincodes,
        productFiles: campaignData.productFiles || [],
        timings: campaignData.timings || "",
      });
    }
  }, [campaignData, dropdowns.regionMap, methods]);

  // Bidirectional sync: regions ↔ pincodes
  useEffect(() => {
    const subscription = methods.watch((values, { name }) => {
      const selectedRegions = values.regions || [];
      const selectedPincodes = values.pincode || [];

      if (!dropdowns.regionMap || !dropdowns.pincodeMap) return;

      if (name === "regions") {
        const derivedPincodes = [...new Set(
          selectedRegions.flatMap((region) => dropdowns.regionMap[region] || [])
        )];

        const currentSorted = [...selectedPincodes].sort();
        const derivedSorted = [...derivedPincodes].sort();

        if (JSON.stringify(currentSorted) !== JSON.stringify(derivedSorted)) {
          methods.setValue("pincode", derivedPincodes, { shouldValidate: false });
        }
      }

      if (name === "pincode") {
        const derivedRegions = [...new Set(
          selectedPincodes.map((pin) => dropdowns.pincodeMap[pin]).filter(Boolean)
        )];

        const currentSorted = [...selectedRegions].sort();
        const derivedSorted = [...derivedRegions].sort();

        if (JSON.stringify(currentSorted) !== JSON.stringify(derivedSorted)) {
          methods.setValue("regions", derivedRegions, { shouldValidate: false });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [methods, dropdowns.regionMap, dropdowns.pincodeMap]);

  // Submit handler
  const handleUpdate = async (formData) => {
    try {
      await dispatch(updateCampaign({ id: campaignData.id, data: formData }));
      toast.success("Campaign updated successfully");
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error("Failed to update campaign");
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
            estimateWatchFields={["product", "regions", "targetDevices", "pincode"]}
            estimateSetField="baseBid"
            isPlus={false}
            title="Update Campaign"
            submitLabel="Update"
          />
        </div>
      </FormProvider>
    </Modal>
  );
};

export default EditCampaignModal;



// import React, { useEffect, useState } from "react";
// import { useForm, FormProvider } from "react-hook-form";
// import { useDispatch, useSelector } from "react-redux";
// import { toast } from "react-toastify";

// import { Modal } from "../../components/ui/modal/Modal";
// import FormBuilder from "../../components/form/FromBuilder";
// import Loader from "../../components/loader/Loader";

// import {
//   productTypes,
//   targetRegions,
//   deviceTypes,
//   estimatePrice,
// } from "../../api/campaign-api/targetingOptionService";

// import { updateCampaign } from "../../redux/slices/campaignDetailSlice";
// import { fields } from "../../util/Form-menu/campaign-fields";

// const EditCampaignModal = ({ isOpen, onClose, campaignData, onSuccess }) => {
//   const dispatch = useDispatch();
//   const { loading } = useSelector((state) => state.campaignDetail);

//   const methods = useForm({ defaultValues: {} });

//   const [dropdowns, setDropdowns] = useState({
//     product: [],
//     targetDevices: [],
//     regions: [],
//     pincodes: [],
//     regionMap: {}, // new
//   });

//   useEffect(() => {
//     const fetchDropdowns = async () => {
//       try {
//         const [products, devices, regions] = await Promise.all([
//           productTypes(),
//           deviceTypes(),
//           targetRegions(),
//         ]);

//         const regionMap = {};
//         const regionOptions = [];
//         const pincodeOptions = [];

//         regions.forEach(({ city, pincode }) => {
//           regionOptions.push({ label: city, value: city });
//           pincodeOptions.push({ label: pincode, value: pincode });

//           if (regionMap[city]) {
//             regionMap[city].push(pincode);
//           } else {
//             regionMap[city] = [pincode];
//           }
//         });

//         setDropdowns({
//           product: products.map((d) => ({
//             label: d.product_type,
//             value: d.product_type,
//           })),
//           targetDevices: devices.map((d) => ({
//             label: d.deviceName,
//             value: d.deviceName,
//           })),
//           regions: regionOptions,
//           pincodes: pincodeOptions,
//           regionMap,
//         });
//       } catch (error) {
//         console.error("Error loading dropdowns:", error);
//       }
//     };

//     fetchDropdowns();
//   }, []);

//   useEffect(() => {
//     if (
//       campaignData &&
//       dropdowns.regionMap &&
//       Object.keys(dropdowns.regionMap).length > 0
//     ) {
//       const selectedRegions = campaignData.regions || [];

//       // Derive pincodes from region map
//       let derivedPincodes = [];
//       selectedRegions.forEach((region) => {
//         if (dropdowns.regionMap[region]) {
//           derivedPincodes.push(...dropdowns.regionMap[region]);
//         }
//       });
//       derivedPincodes = [...new Set(derivedPincodes)];

//       methods.reset({
//         ...campaignData,
//         product: campaignData.product || [],
//         targetDevices: campaignData.targetDevices || [],
//         regions: selectedRegions,
//         pincode: derivedPincodes,
//         productFiles: campaignData.productFiles || [],
//         timings: campaignData.timings || "",
//       });
//     }
//   }, [campaignData, dropdowns.regionMap, methods]);

//   const handleUpdate = async (formData) => {
//     try {
//       await dispatch(updateCampaign({ id: campaignData.id, data: formData }));
//       toast.success("Campaign updated successfully");
//       onSuccess?.();
//       onClose();
//     } catch (err) {
//       toast.error("Failed to update campaign");
//     }
//   };

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} size="lg">
//       <FormProvider {...methods}>
//         <div className="max-h-[80vh] overflow-y-auto rounded-lg relative">
//           {/* loader overlay */}
//           {loading && (
//             <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 rounded-md">
//               <div className="flex flex-col items-center gap-2">
//                 <h2 className="text-sm text-gray-700">Updating Campaign...</h2>
//                 <Loader />
//               </div>
//             </div>
//           )}

//           <FormBuilder
//             onSubmit={handleUpdate}
//             fieldsConfig={fields}
//             dropdowns={{
//               ...dropdowns,
//               pincode: dropdowns.pincodes, // rename to match FormBuilder expectation
//             }}
//             methods={methods}
//             isEdit={true}
//             loading={loading}
//             estimateApi={estimatePrice}
//             estimateWatchFields={["product", "regions", "targetDevices", "pincode"]}
//             estimateSetField="baseBid"
//             isPlus={false}
//             title="Update Campaign"
//             submitLabel="Update"
//           />
//         </div>
//       </FormProvider>
//     </Modal>
//   );
// };

// export default EditCampaignModal;




// import React, { useEffect, useState } from "react";
// import { useForm, FormProvider } from "react-hook-form";
// import { useDispatch, useSelector } from "react-redux";
// import { toast } from "react-toastify";

// import { Modal } from "../../components/ui/modal/Modal";
// import FormBuilder from "../../components/form/FromBuilder";
// import Loader from "../../components/loader/Loader";

// import {
//   productTypes,
//   targetRegions,
//   deviceTypes,
//   estimatePrice,
// } from "../../api/campaign-api/targetingOptionService";

// import { updateCampaign } from "../../redux/slices/campaignDetailSlice";
// import { fields } from "../../util/Form-menu/campaign-fields";

// const EditCampaignModal = ({ isOpen, onClose, campaignData, onSuccess }) => {
//   const dispatch = useDispatch();
//   const { loading } = useSelector((state) => state.campaignDetail);

//   const methods = useForm({ defaultValues: {} });

//   const [dropdowns, setDropdowns] = useState({
//     product: [],
//     targetDevices: [],
//     regions: [],
//     pincode: [],
//   });

//   useEffect(() => {
//     Promise.all([productTypes(), deviceTypes(), targetRegions()]).then(
//       ([products, devices, regions]) => {
//         console.log(regions);
//         setDropdowns({
//           product: products.map((d) => ({ label: d.product_type, value: d.product_type })),
//           targetDevices: devices.map((d) => ({ label: d.deviceName, value: d.deviceName })),
//           regions: regions.map((d) => ({ label: d.city, value: d.city })),
//           pincode: regions.map((d) => ({ label: d.pincode, value: d.pincode })),
//         });

//       },
//       console.log("dropdowns",dropdowns)
//     );
//   }, []);

//   useEffect(() => {
//     if (campaignData) {
//       methods.reset({
//         ...campaignData,
//         productFiles: campaignData.productFiles || [],
//         timings: campaignData.timings || {},
//       });
//     }
//   }, [campaignData, methods]);

//   const handleUpdate = async (formData) => {
//     await dispatch(updateCampaign({ id: campaignData.id, data: formData }));
//     toast.success("Campaign updated successfully");
//     onSuccess?.();
//     onClose();
//   };

//   return (

//   <Modal isOpen={isOpen} onClose={onClose} size="lg">
//   <FormProvider {...methods}>
//     <div className="max-h-[80vh] overflow-y-auto rounded-lg">
//       {/* loader overlay */}
//       {loading && (
//         <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 rounded-md">
//           <div className="flex flex-col items-center gap-2">
//             <h2 className="text-sm text-gray-700">Updating Campaign...</h2>
//             <Loader />
//           </div>
//         </div>
//       )}

//       <FormBuilder
//         onSubmit={handleUpdate}
//         fieldsConfig={fields}
//         dropdowns={dropdowns}
//         methods={methods}
//         isEdit={true}
//         loading={loading}
//         estimateApi={estimatePrice}
//         estimateWatchFields={["product", "regions", "targetDevices","pincode"]}
//         estimateSetField="baseBid"
//         isPlus={false}
//         title="Update Campaign"
//         submitLabel="Update"
//       />
//     </div>
//   </FormProvider>
// </Modal>

//   );
// };

// export default EditCampaignModal;
