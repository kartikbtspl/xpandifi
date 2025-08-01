import { useEffect, useCallback } from "react";
import { data, useLocation, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/ui/bread-crumb/Breadcrumbs";
import MediaCarousel from "../../components/ui/carousel/MediaCarousel";
import Button from "../../components/ui/button/Button";
import { verifyPayment, createOrder } from "../../api/razor-api/razor-api";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const CheckoutCampaign = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.profile);
  const campaignData = location.state?.row;
  console.log(campaignData)


  useEffect(() => {
    if (!campaignData) {
      navigate("/campaigns-list");
    }
  }, [campaignData, navigate]);

  const handlePayment = useCallback(async () => {
    if (!campaignData || !user) return;

    try {
      const orderPayload = {
        campaignId: campaignData.raw.id,
        campaignCode: campaignData.campaignCode,
        amount: campaignData.raw?.baseBid,
        currency: "INR",
      };

      const { order } = await createOrder(orderPayload); // Ensure you destructure `order` from response

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id, // Razorpay order ID
        name: user.businessName || "",
        description: campaignData.name,
        handler: async (response) => {
          try {
            const verifyRes = await verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              campaignId: campaignData.raw.id,
            });

            if (verifyRes?.success) {
              Swal.fire({
                icon: "success",
                title: "Payment Successful",
                text: "Your campaign has been activated!",
                confirmButtonColor: "#3085d6",
              }).then(() => {
                navigate("/campaigns-list");
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "Verification Failed",
                text: "Payment could not be verified. Please contact support.",
              });
            }
          } catch (verifyError) {
            console.error("❌ Verification failed:", verifyError);
            Swal.fire({
              icon: "error",
              title: "Verification Error",
              text:
                verifyError?.response?.data?.message ||
                "Something went wrong verifying your payment.",
            });
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.phone || "",
        },
        theme: {
          color: "#3399cc",
        },
        modal: {
          ondismiss: () => {
            console.log("Payment popup closed");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("❌ Payment Error:", error);
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: error?.message || "Unable to process payment. Please try again.",
      });
    }
  }, [campaignData, user, navigate]);

  if (!campaignData) {
    return (
      <div className="text-center text-gray-500 mt-20">Redirecting...</div>
    );
  }

  const {
    campaignCode,
    name,
    image,
    raw = {}, // Prevent destructure errors
  } = campaignData;

  const {
    brandName,
    adType,
    duration,
    storeTypes,
    targetDevices,
    regions,
    startDate,
    startTime,
    endDate,
    endTime,
    baseBid,
  } = raw;

  return (
    <div className="min-h-screen bg-gray-100 px-4 md:px-10 pb-8 pt-4">
      <header className="mb-8">
        <Breadcrumbs />
        <h1 className="text-3xl font-bold text-gray-800 mt-2">{name}</h1>
      </header>

      <div className="bg-white rounded-xl shadow-xl p-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Media */}
          <div>
            <MediaCarousel mediaFiles={image || []} size="md" />
          </div>

          {/* Right: Info + Payment */}
          <div className="flex flex-col justify-between">
            <div className="space-y-4 text-sm text-gray-700">
              <InfoRow label="Campaign Code" value={campaignCode} highlight />
              <InfoRow label="Brand" value={brandName} />
              <InfoRow label="Ad Type" value={adType} />
              <InfoRow label="Duration" value={`${duration} days`} />
              <InfoRow label="Store Type" value={storeTypes} />
              <InfoRow
                label="Devices"
                value={targetDevices?.join(", ") || "N/A"}
              />
              <InfoRow label="Regions" value={regions?.join(", ") || "N/A"} />
              <InfoRow
                label="Schedule"
                value={`${formatDate(startDate)} (${startTime}) → ${formatDate(
                  endDate
                )} (${endTime})`}
              />
              <hr className="my-2 border-gray-300" />
            </div>

            <div className="mt-4 flex justify-end">
              <Button
                type="button"
                label={`To Pay ₹${baseBid}`}
                isIcon={false}
                className="cursor-pointer"
                onClick={handlePayment}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value, highlight = false }) => (
  <div className="flex justify-between">
    <span className="font-medium">{label}:</span>
    <span className={highlight ? "text-blue-600 font-semibold" : ""}>
      {value}
    </span>
  </div>
);

export default CheckoutCampaign;

// import { useEffect, useCallback } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import Breadcrumbs from "../../components/ui/bread-crumb/Breadcrumbs";
// import MediaCarousel from "../../components/ui/carousel/MediaCarousel";
// import Button from "../../components/ui/button/Button";
// import { verifyPayment, createOrder } from "../../api/razor-api/razor-api";
// import { useDispatch, useSelector } from "react-redux";
// import Swal from "sweetalert2";

// // Format date helper
// const formatDate = (date) =>
//   new Date(date).toLocaleDateString("en-IN", {
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//   });

// const CheckoutCampaign = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const user = useSelector((state) => state.user.profile);

//   const campaignData = location.state?.row;

//   useEffect(() => {
//     if (!campaignData) {
//       navigate("/campaigns-list");
//     }
//   }, [campaignData, navigate]);

//   const handlePayment = useCallback(async () => {
//     if (!campaignData || !user) return;

//     try {
//       const orderPayload = {
//         campaignId: campaignData.id,
//         campaignCode: campaignData.campaignCode,
//         amount: campaignData.raw?.baseBid,
//         currency: "INR",
//       };

//       const order = await createOrder(orderPayload);

//       const options = {
//         key: import.meta.env.VITE_RAZORPAY_KEY_ID,
//         amount: order.amount,
//         currency: order.currency,
//         order_id: order.razorpayOrderId,
//         name: user.businessName || "",
//         description: campaignData.name,
//         handler: async (response) => {
//           const verifyRes = await verifyPayment({
//             ...response,
//             userId: user.id,
//             campaignId: campaignData.id,
//           });

//           if (verifyRes?.success) {
//             Swal.fire({
//               icon: "success",
//               title: "Payment Successful",
//               text: "Your campaign has been activated!",
//               confirmButtonColor: "#3085d6",
//             }).then(() => {
//               navigate("/campaigns-list")
//             });
//           } else {
//             Swal.fire({
//               icon: "error",
//               title: "Verification Failed",
//               text: "Payment could not be verified. Please contact support.",
//             });
//           }
//         },
//         prefill: {
//           name: user?.name || "",
//           email: user?.email || "",
//           contact: user?.phone || "",
//         },
//         theme: {
//           color: "#3399cc",
//         },
//         modal: {
//           ondismiss: () => {
//             console.log("Payment popup closed");
//           },
//         },
//       };

//       const razorpay = new window.Razorpay(options);
//       razorpay.open();
//     } catch (error) {
//       console.error("❌ Payment Error:", error);
//       Swal.fire({
//         icon: "error",
//         title: "Something went wrong",
//         text: error?.message || "Unable to process payment. Please try again.",
//       });
//     }
//   }, [campaignData, user, navigate]);

//   if (!campaignData) {
//     return (
//       <div className="text-center text-gray-500 mt-20">Redirecting...</div>
//     );
//   }

//   const {
//     campaignCode,
//     name,
//     image,
//     raw: {
//       brandName,
//       adType,
//       duration,
//       storeTypes,
//       targetDevices,
//       regions,
//       startDate,
//       startTime,
//       endDate,
//       endTime,
//       baseBid,
//     } = {},
//   } = campaignData;

//   return (
//     <div className="min-h-screen bg-gray-100 px-4 md:px-10 pb-8 pt-4">
//       <header className="mb-8">
//         <Breadcrumbs />
//         <h1 className="text-3xl font-bold text-gray-800 mt-2">{name}</h1>
//       </header>

//       <div className="bg-white rounded-xl shadow-xl p-6 max-w-6xl mx-auto">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {/* Left: Media */}
//           <div>
//             <MediaCarousel mediaFiles={image || []} size="md" />
//           </div>

//           {/* Right: Info + Payment */}
//           <div className="flex flex-col justify-between">
//             <div className="space-y-4 text-sm text-gray-700">
//               <InfoRow label="Campaign Code" value={campaignCode} highlight />
//               <InfoRow label="Brand" value={brandName} />
//               <InfoRow label="Ad Type" value={adType} />
//               <InfoRow label="Duration" value={`${duration} days`} />
//               <InfoRow label="Store Type" value={storeTypes} />
//               <InfoRow
//                 label="Devices"
//                 value={targetDevices?.join(", ") || "N/A"}
//               />
//               <InfoRow
//                 label="Regions"
//                 value={regions?.join(", ") || "N/A"}
//               />
//               <InfoRow
//                 label="Schedule"
//                 value={`${formatDate(startDate)} (${startTime}) → ${formatDate(
//                   endDate
//                 )} (${endTime})`}
//               />
//               <hr className="my-2 border-gray-300" />
//             </div>

//             <div className="mt-4 flex justify-end">
//               <Button
//                 type="button"
//                 label={`To Pay ₹${baseBid}`}
//                 isIcon={false}
//                 className="cursor-pointer"
//                 onClick={handlePayment}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Reusable Info row
// const InfoRow = ({ label, value, highlight = false }) => (
//   <div className="flex justify-between">
//     <span className="font-medium">{label}:</span>
//     <span className={highlight ? "text-blue-600 font-semibold" : ""}>
//       {value}
//     </span>
//   </div>
// );

// export default CheckoutCampaign;

// import { useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import Breadcrumbs from "../../components/ui/bread-crumb/Breadcrumbs";
// import MediaCarousel from "../../components/ui/carousel/MediaCarousel";
// import Button from "../../components/ui/button/Button"
// import {verifyPayment,createOrder} from "../../api/razor-api/razor-api"
// import { useSelector } from "react-redux";

// // Format date helper
// const formatDate = (date) =>
//   new Date(date).toLocaleDateString("en-IN", {
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//   });

// const CheckoutCampaign = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const data = { ...location.state?.row };

//   const user = useSelector((state) => state.user.profile);
//   console.log(user)
//   console.log(data)

//   useEffect(() => {
//     if (!location.state?.row) {
//       navigate("/campaigns-list");
//     }
//   }, [location.state, navigate]);

//   if (!location.state?.row)
//     return (
//       <div className="text-center text-gray-500 mt-20">Redirecting...</div>
//     );

//   const payNow = async () => {
//     try {
//       const orderData ={
//         campaignId:data?.id,
//         campaignCode:data.campaignCode,
//         amount:data?.raw?.baseBid,
//         currency:"INR",

//       }
//       // 1. Create order from backend
//       const { data: order } = await createOrder(orderData);

//       // 2. Configure Razorpay
//       const options = {
//         key:  import.meta.env.VITE_RAZORPAY_KEY_ID,
//         amount: order.amount,
//         currency: order.currency,
//         order_id: order.id,
//         name: user.businessName,
//         description: data.name,
//         handler: async (response) => {
//           // 3. Verify payment
//           const verifyRes = await verifyPayment(response);
//           if (verifyRes.data.success) {
//             alert("✅ Payment Successful");
//           } else {
//             alert("❌ Payment Verification Failed");
//           }
//         },
//         prefill: {
//           name: "John Doe",
//           email: "john@example.com",
//           contact: "9999999999",
//         },
//         theme: {
//           color: "#3399cc",
//         },
//       };

//       // 4. Open Razorpay popup
//       const rzp = new window.Razorpay(options);
//       rzp.open();
//     } catch (error) {
//       console.error("Payment error:", error);
//       alert("Something went wrong");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 px-4 md:px-10 pb-8 pt-4">
//       {/* === Breadcrumb + Title === */}
//       <header className="mb-8">
//         <Breadcrumbs />
//         <h1 className="text-3xl font-bold text-gray-800 mt-2">{data?.name}</h1>
//       </header>

//       {/* === Side-by-Side Layout === */}
//       <div className="bg-white rounded-xl shadow-xl p-6 max-w-6xl mx-auto">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {/* === Left: Media Preview === */}
//           <div>
//             <MediaCarousel mediaFiles={data?.image || []} size="md" />
//           </div>

//           {/* === Right: Campaign Info + Payment === */}
//           <div className="flex flex-col">
//             {/* === Campaign Info === */}
//             <div className="space-y-4 text-sm text-gray-700">
//               <div className="space-y-3 text-sm text-gray-700">
//                 <div className="flex justify-between">
//                   <span className="font-medium">Campaign Code:</span>
//                   <span className="text-blue-600 font-semibold">{data?.campaignCode}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="font-medium">Brand:</span>
//                   <span>{data?.raw?.brandName}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="font-medium">Ad Type:</span>
//                   <span>{data?.raw?.adType}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="font-medium">Duration:</span>
//                   <span>{data?.raw?.duration} days</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="font-medium">Store Type:</span>
//                   <span>{data?.raw?.storeTypes}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="font-medium">Devices:</span>
//                   <span>{data?.raw?.targetDevices?.join(", ")}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="font-medium">Regions:</span>
//                   <span>{data?.raw?.regions?.join(", ")}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="font-medium">Schedule:</span>
//                   <span>
//                     {formatDate(data?.raw?.startDate)} ({data?.raw?.startTime})
//                     → {formatDate(data?.raw?.endDate)} ({data?.raw?.endTime})
//                   </span>
//                 </div>
//               </div>

//               <hr className="my-2 border-gray-300" />
//             </div>

//             {/* === Total + CTA === */}
//             <div className="mt-2 flex justify-end">
//               <Button type={"button"} label={`To Pay ₹${data?.raw?.baseBid}`} isIcon={false} className="cursor-pointer" onClick={()=>payNow()}/>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CheckoutCampaign;
