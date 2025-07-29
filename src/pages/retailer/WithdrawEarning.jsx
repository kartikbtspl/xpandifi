import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import FormBuilder from "../../components/form/FromBuilder";

const WithdrawEarnings = () => {
  const methods = useForm();
  const [withdrawMethod, setWithdrawMethod] = useState("upi");

  const upiFields = [
    [{ name: "amount", label: "Amount", type: "input" },
     { name: "upi", label: "UPI ID", type: "input" }],
  ];

  const bankFields = [
    [
      { name: "amount", label: "Amount", type: "input" },
      { name: "accountNo", label: "Account No", type: "input" },
      { name: "ifsc", label: "IFSC Code", type: "input" },
      { name: "remark", label: "Remarks", type: "input" ,gridSpan:2},
    ],
  ];

  const handleMethodChange = (method) => {
    setWithdrawMethod(method);
    methods.reset();
  };

  const handleSubmit = (data) => {
    console.log(`Submitted via ${withdrawMethod}:`, data);
  };

  const currentFields = withdrawMethod === "upi" ? upiFields : bankFields;

  return (
    <div className="w-full h-screen overflow-y-auto">
      <h1 className="text-xl font-bold mb-6 text-gray-800">Withdraw Earnings</h1>

      <div className="flex items-center space-x-6 mb-8">
        <label className="flex items-center">
          <input
            type="radio"
            name="withdrawMethod"
            value="upi"
            checked={withdrawMethod === "upi"}
            onChange={() => handleMethodChange("upi")}
            className="h-4 w-4 text-blue-600"
          />
          <span className="ml-2 text-gray-700 text-lg">UPI</span>
        </label>

        <label className="flex items-center">
          <input
            type="radio"
            name="withdrawMethod"
            value="bank"
            checked={withdrawMethod === "bank"}
            onChange={() => handleMethodChange("bank")}
            className="h-4 w-4 text-blue-600"
          />
          <span className="ml-2 text-gray-700 text-lg">Bank Account</span>
        </label>
      </div>

      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl">
        <FormBuilder
          methods={methods}
          onSubmit={handleSubmit}
          fieldsConfig={currentFields}
          title={`Withdraw via ${withdrawMethod === 'upi' ? 'UPI' : 'Bank Account'}`}
          submitLabel="Withdraw"
          isIcon={false}
        />
      </div>
    </div>
  );
};

export default WithdrawEarnings;
