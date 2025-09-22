import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import LocationFields from "../../components/LocationsDropdown/LocationFields";
import { registerUserApi } from "../../api/user/user/user-api";
import Toast from "../../components/ui/toast/Toast";
import Checkbox from "../../components/ui/checkbox/Checkbox";
import { Modal } from "../../components/ui/modal/Modal"; 
import{ termsData,adPolicyData} from "../../policy/policy";
import Button from "../../components/ui/button/Button"

const Spinner = ({ size = "sm", className = "" }) => (
  <svg
    className={`animate-spin ${size === "sm" ? "w-4 h-4" : "w-6 h-6"} text-white ${className}`}
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
  </svg>
);

const LoadingButton = ({ loading, children, ...props }) => (
  <button
    {...props}
    disabled={loading}
    className={`bg-[#5F7C95] text-white py-2 px-6 w-full rounded-xl mt-2 flex items-center justify-center gap-2 ${
      loading ? "cursor-not-allowed opacity-75" : "hover:bg-[#445E94]"
    }`}
  >
    {loading && <Spinner size="sm" />}
    {loading ? "Submitting..." : children}
  </button>
);

const inputWrapper = "p-[1px] rounded-md bg-gradient-to-r from-[#6F83B1] via-[#E06371] to-[#F0AF47]";
const inputInner = "bg-white rounded-md w-full px-4 py-2 focus:outline-none";

const ContactUsForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { policies: [] },
  });

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isAdPolicyModalOpen, setIsAdPolicyModalOpen] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [adPolicyAccepted, setAdPolicyAccepted] = useState(false);

  const selectedPolicies = watch("policies");

  // Show modals one at a time
  useEffect(() => {
    if (selectedPolicies?.includes("terms&Condition") && !termsAccepted) {
      setIsTermsModalOpen(true);
    } else if (selectedPolicies?.includes("adPolicy") && !adPolicyAccepted) {
      setIsAdPolicyModalOpen(true);
    }
  }, [selectedPolicies, termsAccepted, adPolicyAccepted]);

  const onSubmit = async (data) => {
    // Ensure both checkboxes accepted
    if (!termsAccepted || !adPolicyAccepted) {
      Toast.error("Please accept Terms & Conditions and Ad Policy.");
      return;
    }

    setLoading(true);

    // Remove checkbox values from submission object
    const submitData = { ...data };
    delete submitData.policies;

    try {
      const response = await registerUserApi(submitData);
      if (response.status === 201 || response.status === 200) {
        Toast.success("Request Submitted!", "Your request has been submitted successfully.");
        reset();
        setTermsAccepted(false);
        setAdPolicyAccepted(false);
        navigate("/signin");
      }
    } catch (err) {
      console.error("Submission failed:", err);
      Toast.error("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderAdditionalInput = () => {
    const selectedRole = watch("role");
    if (!selectedRole) return null;
    return (
      <div className="space-y-1">
        <label className="block">Business Name</label>
        <div className={inputWrapper}>
          <input
            type="text"
            className={inputInner}
            placeholder="Legal Name as per your Tax Certificate"
            {...register("businessName", { required: "Business Name is required" })}
          />
        </div>
        {errors.businessName && <p className="text-red-500 text-sm">{errors.businessName.message}</p>}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Section */}
      <div className="bg-gradient-to-br from-[#5b5f8f] to-[#5F7C95] text-white w-[35%] p-10 flex flex-col justify-center">
        <h1 className="text-4xl font-bold mb-6">Expand Fast<br />Sell Globally</h1>
        <div className="space-y-12">
          {[
            { emoji: "📦", title: "Seamless Selling", desc: "Effortlessly expand to European & UK marketplaces." },
            { emoji: "🎯", title: "Smart Logistics & Analytics", desc: "Optimize inventory, track orders & gain powerful insights." },
            { emoji: "💰", title: "Cross-Border Made Easy", desc: "Simplified compliance, invoicing & fulfillment." },
          ].map(({ emoji, title, desc }) => (
            <div key={title} className="flex items-start space-x-3">
              <div className="text-2xl">{emoji}</div>
              <div>
                <p className="font-semibold">{title}</p>
                <p className="text-sm">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex flex-col w-[65%] justify-center items-center px-8 py-12">
        <img src="/images/logo/bx-logo.svg" alt="Branch-X Logo" className="h-12 mb-3" />
        <h2 className="text-2xl font-semibold text-gray-800 mb-5">Welcome to Ads Monetization</h2>

        <form className="lg:w-3/4 space-y-4" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          {/* Input Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { label: "Full Name", name: "fullName", type: "text", placeholder: "John Doe" },
              { label: "Phone", name: "phone", type: "tel", placeholder: "+91 9876543210" },
              { label: "Email", name: "email", type: "email", placeholder: "john@example.com" },
            ].map(({ label, name, type, placeholder }) => (
              <div key={name} className="space-y-1">
                <label className="block text-sm">{label}<span className="text-red-500 pl-1 font-semibold">*</span></label>
                <div className={inputWrapper}>
                  <input type={type} className={inputInner} placeholder={placeholder} {...register(name, { required: `${label} is required` })} />
                </div>
                {errors[name] && <p className="text-red-500 text-sm">{errors[name].message}</p>}
              </div>
            ))}

            {/* Location */}
            <LocationFields control={control} setValue={setValue} watch={watch} errors={errors} isPincode={false} customStyles={inputWrapper} isRequired={true} />

            {/* Role */}
            <div className="space-y-1">
              <label className="block text-sm">Role<span className="text-red-500 pl-1 font-semibold">*</span></label>
              <div className={inputWrapper}>
                <select className={inputInner} {...register("role", { required: "Role is required" })}>
                  <option value="">Select Role</option>
                  <option value="Ad-Agency">Ad-Agency</option>
                  <option value="Retailer">Retailer</option>
                </select>
              </div>
              {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
            </div>

            <div className="col-span-1 md:col-span-2">{renderAdditionalInput()}</div>
          </div>

          {/* Message Field */}
          <label className="text-sm">Message<span className="text-red-500 pl-1 font-semibold">*</span></label>
          <div className={inputWrapper}>
            <textarea rows={4} placeholder="Enter your message..." className={`${inputInner} resize-none`} {...register("message", { required: "Message is required" })} />
          </div>
          {errors.message && <p className="text-red-500 text-sm">{errors.message.message}</p>}

          {/* Agreements */}
          <Controller
            name="policies"
            control={control}
            rules={{
              validate: (value) => {
                if (!termsAccepted) return "You must accept Terms & Conditions";
                if (!adPolicyAccepted) return "You must accept Ad Policy";
                return true;
              },
            }}
            render={({ field }) => (
              <Checkbox
                label="Agreements"
                control={control}
                options={[
                  { label: "Terms & Conditions", value: "terms&Condition" },
                  { label: "Ad Policy", value: "adPolicy" },
                ]}
                {...field}
              />
            )}
          />

          <LoadingButton loading={loading || isSubmitting}>Submit</LoadingButton>
          <div className="text-right">
            <Link to="/signin" className="text-sm text-blue-600 hover:underline">Back to login</Link>
          </div>
        </form>
      </div>

      {/* Terms Modal */}
      <Modal isOpen={isTermsModalOpen} onClose={() => setIsTermsModalOpen(false)} size="md">
        <h2 className="text-xl font-semibold mb-4">{termsData.title}</h2>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {termsData.sections.map((section, idx) => (
            <div key={idx}>
              <h3 className="font-semibold">{section.heading}</h3>
              <ul className="list-disc list-inside ml-4">
                {section.content.map((item, i) => <li key={i} className="text-sm">{item}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <br />
        <Button label="Accept" onClick={() => { setTermsAccepted(true); setIsTermsModalOpen(false); }} isIcon={false} />
      </Modal>

      {/* Ad Policy Modal */}
      <Modal isOpen={isAdPolicyModalOpen} onClose={() => setIsAdPolicyModalOpen(false)} size="md">
        <h2 className="text-xl font-semibold mb-4">{adPolicyData.title}</h2>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {adPolicyData.sections.map((section, idx) => (
            <div key={idx}>
              <h3 className="font-semibold">{section.heading}</h3>
              <ul className="list-disc list-inside ml-4">
                {section.content.map((item, i) => <li key={i} className="text-sm">{item}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <br />
        <Button label="Accept" onClick={()=>{ setAdPolicyAccepted(true); setIsAdPolicyModalOpen(false); }} isIcon={false} />
      </Modal>
    </div>
  );
};

export default ContactUsForm;