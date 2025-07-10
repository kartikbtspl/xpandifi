export const withdrawFields = [
  [
    {
      name: "paymentMethod",
      label: "Withdraw Method",
      type: "Checkbox",
      options: [
        { label: "UPI", value: "UPI" },
        { label: "Bank Account", value: "Bank" },
      ],
      gridSpan: 3,
    },
  ],
  [
    {
      name: "amount",
      label: "Amount",
      type: "input",
      placeholder: "₹ 0.00",
      gridSpan: 1,
    },
    {
      name: "accountNo",
      label: "Account No.",
      type: "input",
      placeholder: "Enter Account No.",
      gridSpan: 1,
    },
  ],
];
