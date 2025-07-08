import React, { useState } from 'react';

const WithdrawEarnings = () => {
  const [withdrawMethod, setWithdrawMethod] = useState({
    upi: false,
    bankAccount: true
  });
  const [accountDetails, setAccountDetails] = useState({
    accountNumber: '',
    ifscCode: '',
    remarks: ''
  });

  const handleMethodChange = (method) => {
    setWithdrawMethod({
      upi: method === 'upi',
      bankAccount: method === 'bankAccount'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAccountDetails(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Withdraw Earnings</h1>
      
      <div className="mb-6 space-y-3">
        <div className="flex items-center">
          <input 
            type="checkbox"
            checked={withdrawMethod.upi}
            onChange={() => handleMethodChange('upi')}
            className="h-5 w-5 text-blue-600 rounded border-gray-300"
          />
          <label className="ml-2 text-gray-700">UPI</label>
        </div>
        
        <div className="flex items-center">
          <input 
            type="checkbox"
            checked={withdrawMethod.bankAccount}
            onChange={() => handleMethodChange('bankAccount')}
            className="h-5 w-5 text-blue-600 rounded border-gray-300"
          />
          <label className="ml-2 text-gray-700">Bank Account</label>
        </div>
      </div>

      {withdrawMethod.bankAccount && (
        <div className="mb-6 overflow-hidden border border-gray-200 rounded-lg">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="border border-gray-200 p-3 text-left text-sm font-medium text-gray-500">Amount</th>
                <th className="border border-gray-200 p-3 text-left text-sm font-medium text-gray-500">Account No.</th>
                <th className="border border-gray-200 p-3 text-left text-sm font-medium text-gray-500">IFSC Code</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 p-3 text-gray-700">€ 0:00</td>
                <td className="border border-gray-200 p-3">
                  <input
                    type="text"
                    name="accountNumber"
                    value={accountDetails.accountNumber}
                    onChange={handleInputChange}
                    placeholder="Enter Account No."
                    className="w-full p-1 text-gray-700 placeholder-gray-400 focus:outline-none"
                  />
                </td>
                <td className="border border-gray-200 p-3">
                  <input
                    type="text"
                    name="ifscCode"
                    value={accountDetails.ifscCode}
                    onChange={handleInputChange}
                    placeholder="Enter IFSC Code"
                    className="w-full p-1 text-gray-700 placeholder-gray-400 focus:outline-none"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      
      <div className="mb-4">
        <h2 className="font-semibold text-gray-700 mb-2">Remarks</h2>
        <textarea
          name="remarks"
          value={accountDetails.remarks}
          onChange={handleInputChange}
          placeholder="Add Remarks"
          className="w-full p-3 border border-gray-300 rounded-md text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows="3"
        ></textarea>
      </div>
    </div>
  );
};

export default WithdrawEarnings;