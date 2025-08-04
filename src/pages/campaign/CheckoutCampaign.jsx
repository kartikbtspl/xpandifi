import React, { useEffect, useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/ui/bread-crumb/Breadcrumbs";
import MediaCarousel from "../../components/ui/carousel/MediaCarousel";
import Button from "../../components/ui/button/Button";
import { verifyPayment, createOrder } from "../../api/razor-api/razor-api";
import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { fetchCampaigns } from "../../redux/slices/campaignSlice";

// Utility to format dates
const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const cleanPhone = (phone) => {
  const digits = phone?.match(/\d{10}$/); // get last 10 digits
  return digits ? digits[0] : "";
};


const CheckoutCampaign = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const user = useSelector((state) => state.user.profile);
  const campaignData = location.state?.row;

  const {
    raw: campaign = {},
    campaignCode = "",
    name = "",
    image = [],
  } = campaignData || {};

  useEffect(() => {
    if (!campaignData) {
      navigate("/campaigns-list");
    }
  }, [campaignData, navigate]);


  const handlePayment = useCallback(async () => {
  if (!campaignData?.raw || !user) {
    Swal.fire(
      "Missing Information",
      "Campaign or user data is not available.",
      "warning"
    );
    return;
  }

  if (!window.Razorpay) {
    Swal.fire(
      "Payment SDK Error",
      "Razorpay SDK not loaded. Please refresh and try again.",
      "error"
    );
    return;
  }

  setIsLoading(true);

  try {
    const { raw: campaign } = campaignData;
    const orderPayload = {
      campaignId: campaign.id,
      campaignCode: campaignData.campaignCode,
      amount: campaign.baseBid,
      currency: "INR",
    };

    const { order } = await createOrder(orderPayload);

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      order_id: order.id,
      name: user.businessName || "Your Company",
      description: campaignData.name || "Campaign Payment",
      prefill: {
        name: user?.fullName || "",
        email: user?.email || "",
        contact: cleanPhone(user?.phone) || "",
      },
      theme: { color: "#3399cc" },
      modal: {
        ondismiss: () => {
          setIsLoading(false);
          Swal.fire("Payment Cancelled", "You closed the payment popup.", "info");
        },
      },
      handler: async (response) => {
        try {
          const verifyRes = await verifyPayment({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            campaignId: campaign.id,
          });

          if (verifyRes?.success) {
            Swal.fire({
              icon: "success",
              title: "Payment Successful",
              text: "Your campaign has been activated!",
              confirmButtonColor: "#3085d6",
            }).then(() => navigate("/campaigns-list"));

            dispatch(fetchCampaigns());
          } else {
            Swal.fire({
              icon: "error",
              title: "Verification Failed",
              text: "Payment could not be verified. Please contact support.",
            });
          }
        } catch (err) {
          console.error("Verification error:", err);
          Swal.fire({
            icon: "error",
            title: "Verification Error",
            text: err?.response?.data?.message || "Something went wrong verifying your payment.",
          });
        } finally {
          setIsLoading(false);
        }
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  } catch (error) {
    console.error("Payment Error:", error);
    Swal.fire({
      icon: "error",
      title: "Something went wrong",
      text: error?.message || "Unable to process payment. Please try again.",
    });
    setIsLoading(false);
  }
}, [campaignData, user, navigate, dispatch]);



  if (!campaignData) {
    return (
      <div className="text-center text-gray-500 mt-20">Redirecting...</div>
    );
  }

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
  } = campaign;

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
              <InfoRow label="Devices" value={targetDevices?.join(", ") || "N/A"} />
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
                loading={isLoading}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// InfoRow Component
const InfoRow = ({ label, value, highlight = false }) => (
  <div className="flex justify-between">
    <span className="font-medium">{label}:</span>
    <span className={highlight ? "text-blue-600 font-semibold" : ""}>
      {value}
    </span>
  </div>
);

export default CheckoutCampaign;