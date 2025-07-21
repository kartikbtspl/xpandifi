// import { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { yupResolver } from "@hookform/resolvers/yup";

// import FormBuilder from "../../components/form/FromBuilder";
// import Loader from "../../components/loader/Loader";

// import { fields } from "../../util/Form-menu/campaign-fields";
// import { campaignValidationSchema } from "../../util/validation/campaignValidationSchema";

// import {
//   productTypes,
//   deviceTypes,
//   targetRegions,
//   estimatePrice,
// } from "../../api/campaign-api/targetingOptionService";

// import {
//   createCampaign,
//   fetchCampaigns,
// } from "../../redux/slices/campaignSlice";

// const CreateCampaign = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { loading } = useSelector((state) => state.campaign);

//   const methods = useForm({
//     resolver: yupResolver(campaignValidationSchema),
//   });

//   const { watch, setValue } = methods;

//   const [dropdowns, setDropdowns] = useState({
//     product: [],
//     targetDevices: [],
//     regions: [],
//     regionMap: {}, // for pincode <-> region mapping
//   });

//   // Fetch dropdown values on mount
//   useEffect(() => {
//     Promise.all([productTypes(), deviceTypes(), targetRegions()]).then(
//       ([products, devices, regions]) => {
//         const regionOptions = regions.map((r) => ({
//           label: r.city,
//           value: r.city,
//         }));

//         const regionMap = {};
//         regions.forEach((r) => {
//           regionMap[r.city] = r.pincode;
//           regionMap[r.pincode] = r.city;
//         });

//         setDropdowns({
//           product: products.map((d) => ({ label: d.product_type, value: d.product_type })),
//           targetDevices: devices.map((d) => ({ label: d.deviceName, value: d.deviceName })),
//           regions: regionOptions,
//           regionMap,
//         });
//       }
//     );
//   }, []);

//   // Sync region <-> pincode
//   useEffect(() => {
//     const subscription = watch((values) => {
//       const selectedRegions = values.regions;
//       const enteredPincode = values.pincode;

//       // Region -> Pincode
//       if (
//         selectedRegions?.length === 1 &&
//         dropdowns.regionMap[selectedRegions[0]] &&
//         values.pincode !== dropdowns.regionMap[selectedRegions[0]]
//       ) {
//         setValue("pincode", dropdowns.regionMap[selectedRegions[0]]);
//       }

//       // Pincode -> Region
//       if (
//         enteredPincode &&
//         dropdowns.regionMap[enteredPincode] &&
//         (!selectedRegions || selectedRegions[0] !== dropdowns.regionMap[enteredPincode])
//       ) {
//         setValue("regions", [dropdowns.regionMap[enteredPincode]]);
//       }
//     });

//     return () => subscription.unsubscribe();
//   }, [watch, dropdowns.regionMap, setValue]);

//   const handleSubmit = async (formData) => {
//     if (loading) return;
//     const result = await dispatch(createCampaign(formData));
//     if (createCampaign.fulfilled.match(result)) {
//       await dispatch(fetchCampaigns());
//       methods.reset();
//       navigate("/");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen gap-4">
//         <div className="text-lg font-semibold text-[#445E94]">Creating Campaign...</div>
//         <Loader />
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-5xl mx-auto">
//       <h2 className="text-xl lg:2xl font-semibold text-gray-800 mb-4">Create Campaign</h2>
//       <FormBuilder
//         onSubmit={handleSubmit}
//         fieldsConfig={fields}
//         dropdowns={dropdowns}
//         methods={methods}
//         estimateApi={estimatePrice}
//         estimateWatchFields={["product", "regions", "targetDevices"]}
//         estimateSetField="baseBid"
//         title=""
//         submitLabel="Submit For Approval"
//         isPlus={false}
//       />
//     </div>
//   );
// };

// export default CreateCampaign;





import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";

import FormBuilder from "../../components/form/FromBuilder";
import Loader from "../../components/loader/Loader";

import { fields } from "../../util/Form-menu/campaign-fields";
import { campaignValidationSchema } from "../../util/validation/campaignValidationSchema";

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

const CreateCampaign = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.campaign);

  const methods = useForm({
    resolver: yupResolver(campaignValidationSchema),
  });

  const [dropdowns, setDropdowns] = useState({
    product: [],
    targetDevices: [],
    regions: [],
      regionMap: {}, // new

  });

  useEffect(() => {
    Promise.all([productTypes(), deviceTypes(), targetRegions()]).then(
      ([products, devices, regions]) => {
        setDropdowns({
          product: products.map((d) => ({ label: d.product_type, value: d.product_type })),
          targetDevices: devices.map((d) => ({ label: d.deviceName, value: d.deviceName })),
          regions: regions.map((d) => ({ label: d.city, value: d.city })),
        });
      }
    );
  }, []);

  const handleSubmit = async (formData) => {
    if (loading) return;
    const result = await dispatch(createCampaign(formData));
    if (createCampaign.fulfilled.match(result)) {
      await dispatch(fetchCampaigns());
      methods.reset();
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div className="text-lg font-semibold text-[#445E94]">Creating Campaign...</div>
        <Loader />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-xl lg:2xl font-semibold text-gray-800 mb-4">Create Campaign</h2>
      <FormBuilder
        onSubmit={handleSubmit}
        fieldsConfig={fields}
        dropdowns={dropdowns}
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
