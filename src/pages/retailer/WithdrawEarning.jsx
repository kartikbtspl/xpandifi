import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import Button from "../../components/ui/button/Button";
import { useDispatch, useSelector } from "react-redux";
import { createWithdrawalRequest,fetchWithdrawalRequests } from "../../redux/slices/walletSlice";

const WithdrawEarnings = ({ onClose, balance }) => {

  const {formLoading} = useSelector((state)=>state.wallet)

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid }
  } = useForm({
    mode: "onChange",
    defaultValues: {
      amount: "",
      upi: ""
    }
  });

  const amountValue = parseFloat(watch("amount") || 0);

  const onSubmit = async (data) => {
    if (parseFloat(data.amount) > balance) {
      Swal.fire({
        icon: "error",
        title: "Invalid Amount",
        text: "Withdrawal amount cannot exceed your current balance.",
      });
      return;
    }

    try {
      await dispatch(createWithdrawalRequest(data)).unwrap();

      onClose();

      setTimeout(() => {
        Swal.fire({
          icon: "success",
          title: "Request Sent!",
          text: "Please keep checking your status updates and email for further updates.",
          confirmButtonColor: "#445C91",
        });
      }, 150);
      dispatch(fetchWithdrawalRequests());

      console.log("Withdrawal request form data ", data);  // ❌ commented out
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Request Failed",
        text: error || "Something went wrong. Please try again later.",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      autoComplete="off"
      className=" bg-white rounded-xl  space-y-6"
    >
      <h2 className="text-xl font-semibold text-gray-800">UPI Withdrawal</h2>

      {/* Amount Field */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Amount (₹)
        </label>
        <input
          type="number"
          step="0.01"
          {...register("amount", {
            required: "Amount is required",
            min: { value: 0.01, message: "Amount must be greater than 0" },
            validate: (val) =>
              parseFloat(val) < balance ||
              `Withdrawal amount must be less than your current balance (you cannot empty the wallet)`
          })}
          className={`block w-full rounded-lg border border-gray-300 p-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 ${errors.amount ? "border-red-500 focus:border-red-500 focus:ring-red-200" : ""
            }`}
        />
        {errors.amount && (
          <p className="text-sm text-red-500">{errors.amount.message}</p>
        )}
      </div>

      {/* UPI ID Field */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          UPI ID
        </label>
        <input
          type="text"
          {...register("upi", {
            required: "UPI ID is required",
            pattern: {
              value: /^[\w.\-]{2,256}@[a-zA-Z]{2,64}$/,
              message: "Enter a valid UPI ID (e.g., name@bank)"
            }
          })}
          className={`block w-full rounded-lg border border-gray-300 p-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 ${errors.upi ? "border-red-500 focus:border-red-500 focus:ring-red-200" : ""
            }`}
        />
        {errors.upi && (
          <p className="text-sm text-red-500">{errors.upi.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          label="Submit Withdrawal Request"
          type="submit"
          loading={formLoading}
          disabled={!isValid}
          isIcon={false}
          className="hover:cursor-pointer"
        />
      </div>
    </form>
  );
};

export default WithdrawEarnings;


// import React, { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import FormBuilder from "../../components/form/FromBuilder";

// const WithdrawEarnings = () => {
//   const methods = useForm();
//   const [withdrawMethod, setWithdrawMethod] = useState("upi");

//   const upiFields = [
//     [{ name: "amount", label: "Amount", type: "input" },
//      { name: "upi", label: "UPI ID", type: "input" }],
//   ];

//   const bankFields = [
//     [
//       { name: "amount", label: "Amount", type: "input" },
//       { name: "accountNo", label: "Account No", type: "input" },
//       { name: "ifsc", label: "IFSC Code", type: "input" },
//       { name: "remark", label: "Remarks", type: "input" ,gridSpan:2},
//     ],
//   ];

//   const handleMethodChange = (method) => {
//     setWithdrawMethod(method);
//     methods.reset();
//   };

//   const handleSubmit = (data) => {
//     console.log(`Submitted via ${withdrawMethod}:`, data);
//   };

//   // const currentFields = withdrawMethod === "upi" ? upiFields : bankFields;

//   return (
//     <>
//     <FormBuilder
//           methods={methods}
//           onSubmit={handleSubmit}
//           fieldsConfig={upiFields}
//           title={"UPI Info"}
//           submitLabel="Submit Request"
//           isIcon={false}
//           isPlus={false}
//           /></>
//     // <div className="w-full h-screen overflow-y-auto p-4">
//     //   <h1 className="text-xl font-bold mb-6 text-gray-800">Withdraw Earnings</h1>

//     //   <div className="flex items-center space-x-6 mb-8">
//     //     <label className="flex items-center">
//     //       <input
//     //         type="radio"
//     //         name="withdrawMethod"
//     //         value="upi"
//     //         checked={withdrawMethod === "upi"}
//     //         onChange={() => handleMethodChange("upi")}
//     //         className="h-4 w-4 text-blue-600"
//     //       />
//     //       <span className="ml-2 text-gray-700 text-lg">UPI</span>
//     //     </label>

//     //     <label className="flex items-center">
//     //       <input
//     //         type="radio"
//     //         name="withdrawMethod"
//     //         value="bank"
//     //         checked={withdrawMethod === "bank"}
//     //         onChange={() => handleMethodChange("bank")}
//     //         className="h-4 w-4 text-blue-600"
//     //       />
//     //       <span className="ml-2 text-gray-700 text-lg">Bank Account</span>
//     //     </label>
//     //   </div>

//     //   <div className="bg-white w-full max-w-4xl">
//     //     <FormBuilder
//     //       methods={methods}
//     //       onSubmit={handleSubmit}
//     //       fieldsConfig={currentFields}
//     //       title={`Withdraw via ${withdrawMethod === 'upi' ? 'UPI' : 'Bank Account'}`}
//     //       submitLabel="Withdraw"
//     //       isIcon={false}
//     //       className
//     //     />
//     //   </div>
//     // </div>
//   );
// };

// export default WithdrawEarnings;
