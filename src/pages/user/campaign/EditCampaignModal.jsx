import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Toast from "../../../components/ui/toast/Toast";
import { Modal } from "../../../components/ui/modal/Modal";
import FormBuilder from "../../../components/form/FromBuilder";
import LoaderEmpt from "../../../components/loader/LoaderEmpt";
import { estimatePrice } from "../../../api/user/campaign-api/targetingOptionService";
import { updateCampaign, fetchCampaigns } from "../../../redux/slices/user/campaignSlice";
import { fetchDropdownData } from "../../../redux/slices/user/cityProductDeviceSlice";
import { fields } from "../../../util/Form-menu/campaign-fields";

const EditCampaignModal = ({ isOpen, onClose, campaignData, onSuccess ,btnLabel,isScond,seconLabel}) => {
  const dispatch = useDispatch();
  const { formLoading } = useSelector((state) => state.campaign);
  const { data: dropdownData, loading: dropdownLoading } = useSelector(
    (state) => state.cityProductDevice
  );

  const [dropdowns, setDropdowns] = useState({
    product: [],
    devices: [],
    regions: [],
    regionMap: {},
  });

  const methods = useForm({ defaultValues: {} });

  // Fetch dropdown data if not present
  useEffect(() => {
    if (!dropdownData) dispatch(fetchDropdownData());
  }, [dispatch, dropdownData]);

  // Prepare dropdown options
  useEffect(() => {
    if (!dropdownData) return;

    const productOptions = (dropdownData.products || []).map((p) => ({
      label: p.label || p.name,
      value: p.value ?? p.id,
      price: p.price,
    }));

    const deviceOptions = (dropdownData.devices || []).map((d) => ({
      label: d.label || d.name,
      value: d.value ?? d.id,
      price: d.price,
    }));

    const regionOptions = [];
    const regionMap = {};
    Object.values(dropdownData.cityRegionMap || {})
      .flat()
      .forEach((r) => {
        const option = {
          label: r.label || r.name,
          value: r.value ?? r.id,
          cityName: r.cityName,
          postcode: r.postcode,
        };
        regionOptions.push(option);
        if (!regionMap[option.value]) regionMap[option.value] = [];
        if (option.postcode) regionMap[option.value].push(option.postcode);
      });

    setDropdowns({
      product: productOptions,
      devices: deviceOptions,
      regions: regionOptions,
      regionMap,
    });
  }, [dropdownData]);

  // Reset form values when campaignData loads
  useEffect(() => {
    if (
      !campaignData ||
      !dropdowns.product.length ||
      !dropdowns.devices.length ||
      !dropdowns.regions.length
    )
      return;

    const selectedProduct =
      dropdowns.product.find((p) => p.label === campaignData.product)?.value || "";

    const selectedTargetDevices = (campaignData.devices || [])
      .map((d) => dropdowns.devices.find((opt) => opt.label === d.name)?.value)
      .filter(Boolean);

    const selectedRegions = Object.values(campaignData.cityRegions || {})
      .flat()
      .map((r) => dropdowns.regions.find((opt) => opt.label === r.name)?.value)
      .filter(Boolean);

    const selectedPincodes = Object.values(campaignData.cityRegions || {})
      .flat()
      .map((r) => r.postcode)
      .filter(Boolean);

    const objectiveField = fields.flat().find((f) => f.name === "objective");
    const objectiveValue =
      objectiveField?.options?.find(
        (opt) =>
          opt.label === (campaignData.campaingObjective || campaignData.objective)
      )?.value || "";

    const dateRange = {
      start:
        campaignData.dateRange?.start ||
        campaignData.startDate ||
        campaignData.start ||
        "",
      end:
        campaignData.dateRange?.end ||
        campaignData.endDate ||
        campaignData.end ||
        "",
    };

    methods.reset({
      ...campaignData,
      product: selectedProduct,
      targetDevices: selectedTargetDevices,
      regions: selectedRegions,
      pincode: selectedPincodes, // include pincodes
      productFiles: campaignData.productFiles || [],
      timings: campaignData.timings || "",
      dateRange,
      startTime: campaignData.startTime,
      endTime: campaignData.endTime,
      ageGroup: campaignData.ageGroup || "",
      objective: objectiveValue,
    });
  }, [campaignData, dropdowns, methods]);

  // 🔹 Sync Regions ↔ Pincode
  useEffect(() => {
    const subscription = methods.watch((value, { name }) => {
      if (name === "pincode") {
        const selectedPincodes = value.pincode || [];
        const matchedRegions = dropdowns.regions
          .filter((r) => selectedPincodes.includes(r.postcode))
          .map((r) => r.value);

        const uniqueRegions = [...new Set(matchedRegions)];

        if (JSON.stringify(uniqueRegions) !== JSON.stringify(value.regions || [])) {
          methods.setValue("regions", uniqueRegions, { shouldValidate: true });
        }
      }

      if (name === "regions") {
        const selectedRegions = value.regions || [];
        const matchedPincodes = dropdowns.regions
          .filter((r) => selectedRegions.includes(r.value))
          .map((r) => r.postcode);

        const uniquePincodes = [...new Set(matchedPincodes)];

        if (JSON.stringify(uniquePincodes) !== JSON.stringify(value.pincode || [])) {
          methods.setValue("pincode", uniquePincodes, { shouldValidate: true });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [methods, dropdowns.regions]);

  // Handle campaign update
  const handleUpdate = async (formData) => {
    console.log("Form Data on Submit:", formData);
    if (!formData.regions?.length) return Toast.error("Select at least one region");

    const oldFiles = (formData.productFiles || []).filter((f) => typeof f === "string");
    const newFiles = (formData.productFiles || []).filter((f) => f instanceof File);

    const cityregions = {};
    (formData.regions || []).forEach((regionId) => {
      const regionObj = dropdowns.regions.find((r) => r.value === regionId);
      if (!regionObj) return;
      const cityName = regionObj.cityName;
      if (!cityregions[cityName]) cityregions[cityName] = [];
      cityregions[cityName].push({ name: regionObj.label, postcode: regionObj.postcode });
    });

    const selectedDevices = (formData.targetDevices || [])
      .map((id) => {
        const dev = dropdowns.devices.find((d) => d.value === id);
        return dev ? { id: dev.value, name: dev.label } : null;
      })
      .filter(Boolean);

    const objectiveField = fields.flat().find((f) => f.name === "objective");
    const objectiveLabel =
      objectiveField?.options?.find((opt) => opt.value === formData.objective)?.label ||
      formData.objective ||
      "";

    const startStr = formData.dateRange?.start || null;
    const endStr = formData.dateRange?.end || null;

    const payload = {
      ...formData,
      cityregions,
      devices: selectedDevices,
      product: formData.product,
      productFiles: newFiles,
      existingFiles: JSON.stringify(oldFiles),
      objective: objectiveLabel,
      dateRange: JSON.stringify({ start: startStr, end: endStr }),
    };

    try {
      await dispatch(updateCampaign({ id: campaignData.id, data: payload })).unwrap();
      dispatch(fetchCampaigns());
      onSuccess?.();
      onClose?.();
      Toast.success("Campaign updated successfully!");
    } catch (err) {
      Toast.error(err?.message || "Failed to update campaign");
    }
  };

  if (dropdownLoading || !dropdownData) return <LoaderEmpt size="large" />;

  const updatedFields = fields.map((row) =>
    row.map((field) => {
      if (field.name === "product") return { ...field, options: dropdowns.product, multi: false };
      if (field.name === "targetDevices") return { ...field, options: dropdowns.devices, multi: true };
      if (field.name === "regions") return { ...field, options: dropdowns.regions, multi: true };
      if (field.name === "pincode")
        return {
          ...field,
          options: dropdowns.regions.map((r) => ({ label: r.postcode, value: r.postcode })),
          multi: true,
        };
      if (field.name === "objective") return { ...field, options: field.options, multi: false };
      return field;
    })
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <FormProvider {...methods}>
        <div className="max-h-[80vh] rounded-lg relative">
          <FormBuilder
            onSubmit={handleUpdate}
            fieldsConfig={updatedFields}
            methods={methods}
            isEdit={true}
            loading={formLoading}
            estimateApi={estimatePrice}
            estimateWatchFields={["product", "regions", "targetDevices"]}
            estimateSetField="baseBid"
            title="Update Campaign"
            submitLabel={btnLabel || "Update"}
            isSeconBtn={isScond}
            secondButtonLabel={seconLabel }
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
// import Toast from "../../../components/ui/toast/Toast";
// import { Modal } from "../../../components/ui/modal/Modal";
// import FormBuilder from "../../../components/form/FromBuilder";
// import LoaderEmpt from "../../../components/loader/LoaderEmpt";
// import { estimatePrice } from "../../../api/user/campaign-api/targetingOptionService";
// import { updateCampaign, fetchCampaigns } from "../../../redux/slices/user/campaignSlice";
// import { fetchDropdownData } from "../../../redux/slices/user/cityProductDeviceSlice";
// import { fields } from "../../../util/Form-menu/campaign-fields";

// const EditCampaignModal = ({ isOpen, onClose, campaignData, onSuccess }) => {
//   const dispatch = useDispatch();
//   const { formLoading } = useSelector((state) => state.campaign);
//   const { data: dropdownData, loading: dropdownLoading } = useSelector(
//     (state) => state.cityProductDevice
//   );

//   const [dropdowns, setDropdowns] = useState({
//     product: [],
//     devices: [],
//     regions: [],
//     regionMap: {},
//   });

//   const methods = useForm({ defaultValues: {} });

//   // Fetch dropdown data if not present
//   useEffect(() => {
//     if (!dropdownData) dispatch(fetchDropdownData());
//   }, [dispatch, dropdownData]);

//   // Prepare dropdown options
//   useEffect(() => {
//     if (!dropdownData) return;

//     const productOptions = (dropdownData.products || []).map((p) => ({
//       label: p.label || p.name,
//       value: p.value ?? p.id,
//       price: p.price,
//     }));

//     const deviceOptions = (dropdownData.devices || []).map((d) => ({
//       label: d.label || d.name,
//       value: d.value ?? d.id,
//       price: d.price,
//     }));

//     const regionOptions = [];
//     const regionMap = {};
//     Object.values(dropdownData.cityRegionMap || {})
//       .flat()
//       .forEach((r) => {
//         const option = {
//           label: r.label || r.name,
//           value: r.value ?? r.id,
//           cityName: r.cityName,
//           postcode: r.postcode,
//         };
//         regionOptions.push(option);
//         if (!regionMap[option.value]) regionMap[option.value] = [];
//         if (option.postcode) regionMap[option.value].push(option.postcode);
//       });

//     setDropdowns({
//       product: productOptions,
//       devices: deviceOptions,
//       regions: regionOptions,
//       regionMap,
//     });
//   }, [dropdownData]);

//   // Reset form values
//   useEffect(() => {
//     if (
//       !campaignData ||
//       !dropdowns.product.length ||
//       !dropdowns.devices.length ||
//       !dropdowns.regions.length
//     )
//       return;

//     const selectedProduct =
//       dropdowns.product.find((p) => p.label === campaignData.product)?.value || "";

//     const selectedTargetDevices = (campaignData.devices || [])
//       .map((d) => dropdowns.devices.find((opt) => opt.label === d.name)?.value)
//       .filter(Boolean);

//     const selectedRegions = Object.values(campaignData.cityRegions || {})
//       .flat()
//       .map((r) => dropdowns.regions.find((opt) => opt.label === r.name)?.value)
//       .filter(Boolean);

//     const objectiveField = fields.flat().find((f) => f.name === "objective");
//     const objectiveValue =
//       objectiveField?.options?.find(
//         (opt) => opt.label === (campaignData.campaingObjective || campaignData.objective)
//       )?.value || "";

//     const dateRange = {
//       start:
//         campaignData.dateRange?.start ||
//         campaignData.startDate ||
//         campaignData.start ||
//         "",
//       end:
//         campaignData.dateRange?.end ||
//         campaignData.endDate ||
//         campaignData.end ||
//         "",
//     };

//     methods.reset({
//       ...campaignData,
//       product: selectedProduct,
//       targetDevices: selectedTargetDevices,
//       regions: selectedRegions,
//       productFiles: campaignData.productFiles || [], // mix of File + string handled later
//       timings: campaignData.timings || "",
//       dateRange,
//       startTime: campaignData.startTime,
//       endTime: campaignData.endTime,
//       ageGroup: campaignData.ageGroup || "",
//       objective: objectiveValue,
//     });
//   }, [campaignData, dropdowns, methods]);

//   // Handle campaign update
// const handleUpdate = async (formData) => {
//   if (!formData.regions?.length) return Toast.error("Select at least one region");

//   // Separate old files vs new files
//   const oldFiles = (formData.productFiles || []).filter((f) => typeof f === "string"); // existing
//   const newFiles = (formData.productFiles || []).filter((f) => f instanceof File); // new uploads

//   // Build cityregions
//   const cityregions = {};
//   (formData.regions || []).forEach((regionId) => {
//     const regionObj = dropdowns.regions.find((r) => r.value === regionId);
//     if (!regionObj) return;
//     const cityName = regionObj.cityName;
//     if (!cityregions[cityName]) cityregions[cityName] = [];
//     cityregions[cityName].push({ name: regionObj.label, postcode: regionObj.postcode });
//   });

//   // Devices
//   const selectedDevices = (formData.targetDevices || [])
//     .map((id) => {
//       const dev = dropdowns.devices.find((d) => d.value === id);
//       return dev ? { id: dev.value, name: dev.label } : null;
//     })
//     .filter(Boolean);

//   // Objective label
//   const objectiveField = fields.flat().find((f) => f.name === "objective");
//   const objectiveLabel =
//     objectiveField?.options?.find((opt) => opt.value === formData.objective)?.label ||
//     formData.objective ||
//     "";

//   const startStr = formData.dateRange?.start || null;
//   const endStr = formData.dateRange?.end || null;

//   // --- FIXED: stringify existingFiles for backend ---
//   const payload = {
//     ...formData,
//     cityregions,
//     devices: selectedDevices,
//     product: formData.product,            // product ID
//     productFiles: newFiles,               // only new uploads
//     existingFiles: JSON.stringify(oldFiles), // send as JSON string
//     objective: objectiveLabel,
//     dateRange: JSON.stringify({ start: startStr, end: endStr }),
//   };


//   try {
//     await dispatch(updateCampaign({ id: campaignData.id, data: payload })).unwrap();
//     dispatch(fetchCampaigns());
//     onSuccess?.();
//     onClose?.();
//     Toast.success("Campaign updated successfully!");
//   } catch (err) {
//     Toast.error(err?.message || "Failed to update campaign");
//   }
// };



//   if (dropdownLoading || !dropdownData) return <LoaderEmpt size="large" />;

//   const updatedFields = fields.map((row) =>
//     row.map((field) => {
//       if (field.name === "product") return { ...field, options: dropdowns.product, multi: false };
//       if (field.name === "targetDevices") return { ...field, options: dropdowns.devices, multi: true };
//       if (field.name === "regions") return { ...field, options: dropdowns.regions, multi: true };
//       if (field.name === "objective") return { ...field, options: field.options, multi: false };
//       return field;
//     })
//   );

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} size="lg">
//       <FormProvider {...methods}>
//         <div className="max-h-[80vh] rounded-lg relative">
//           <FormBuilder
//             onSubmit={handleUpdate}
//             fieldsConfig={updatedFields}
//             methods={methods}
//             isEdit={true}
//             loading={formLoading}
//             estimateApi={estimatePrice}
//             estimateWatchFields={["product", "regions", "targetDevices"]}
//             estimateSetField="baseBid"
//             title="Update Campaign"
//             submitLabel="Update"
//           />
//         </div>
//       </FormProvider>
//     </Modal>
//   );
// };

// export default EditCampaignModal;