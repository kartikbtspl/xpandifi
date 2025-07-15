// src/util/Form-menu/campaign-fields.js
import * as yup from "yup";

export const fields = [
  [
    {
      type: 'input',
      name: 'campaignName',
      label: 'Campaign Name',
      placeholder: 'Enter campaign name',
      gridSpan: 3,
      validation: yup.string().required("Campaign name is required"),
    },
  ],
  [
    {
      type: 'select',
      name: 'product',
      label: 'Product',
      options: [],
      multi: true,
      validation: yup.array().min(1, "Select at least one product").required(),
    },
    {
      type: 'input',
      name: 'adType',
      label: 'Ad Type',
      placeholder: 'Enter ad type',
      validation: yup.string().required("Ad type is required"),
    },
    {
      type: 'input',
      name: 'brandName',
      label: 'Brand Name',
      placeholder: 'Enter brand name',
      validation: yup.string().required("Brand name is required"),
    },
  ],
  [
    {
      type: 'input',
      name: 'duration',
      label: 'Duration',
      placeholder: 'Enter duration',
      validation: yup
        .number()
        .typeError("Duration must be a number")
        .positive("Must be positive")
        .required("Duration is required"),
    },
    {
      type: 'date-range',
      name: 'dateRange',
      label: 'Start - End Date',
      validation: yup
        .array()
        .of(yup.date().required())
        .min(2, "Select a valid date range")
        .required(),
    },
    {
      type: 'select',
      name: 'timings',
      label: 'Timings',
      options: [
        { label: '9 AM - 11 AM', value: '9AM-11PM' },
        { label: '11 AM - 1 PM', value: '11 AM-1AM' },
        { label: '1 PM - 3 PM', value: '1AM-3AM' },
        { label: '3 PM - 5 PM', value: '3PM-5PM' },
        { label: '5 PM - 7 PM', value: '5PM-7PM' },
      ],
      validation: yup.string().required("Please select timings"),
    },
  ],
  [
    {
      type: 'select',
      name: 'regions',
      label: 'Regions',
      options: [],
      multi: true,
      validation: yup.array().min(1, "Select at least one region").required(),
    },
    {
      type: 'select',
      name: 'storeTypes',
      label: 'Store Type',
      options: [
        { label: 'Kirana', value: 'Kirana' },
        { label: 'Pharmacy', value: 'pharmacy' },
        { label: 'Electronic', value: 'Electronic' },
        { label: 'Beauty', value: 'Beauty' },
      ],
      validation: yup.string().required("Select a store type"),
    },
    {
      type: 'select',
      name: 'targetDevices',
      label: 'Target Devices',
      options: [],
      multi: true,
      validation: yup.array().min(1, "Select at least one device").required(),
    },
  ],
  [
    {
      type: 'file',
      name: 'productFiles',
      label: 'Product Files',
      accept: '.jpg,.png,.mp4',
      maxSizeMB: 25,
      gridSpan: 3,
      validation: yup
        .mixed()
        .test(
          "file-required",
          "At least one file is required",
          (value) => value && value.length > 0
        ),
    },
  ],
  [
    {
      type: 'select',
      name: 'campaignBudget',
      label: 'Campaign Budget',
      options: [
        { label: '100k-200k', value: '100k-200k' },
        { label: '200k-300k', value: '200k-300k' },
        { label: '300k-400k', value: '300k-400k' },
      ],
      validation: yup.string().required("Budget is required"),
    },
    {
      type: 'input',
      name: 'baseBid',
      label: 'Base Bid',
      placeholder: 'Enter base bid',
      validation: yup
        .number()
        .typeError("Base Bid must be a number")
        .required("Base Bid is required"),
    },
    {
      type: 'select',
      name: 'maxBidCap',
      label: 'Max Bid Cap',
      options: [
        { label: '200k-400k', value: '200k-400k' },
        { label: '400k-600k', value: '400k-600k' },
        { label: '600k-800k', value: '600k-800k' },
      ],
      validation: yup.string().required("Max Bid Cap is required"),
    },
  ],
];


// export const fields = [
//   [
//     {
//       type: 'input',
//       name: 'campaignName',
//       label: 'Campaign Name',
//       placeholder: 'Enter campaign name',
//       gridSpan: 3
//     }
//   ],
//   [
//     { type: 'select', name: 'product', label: 'Product', options: [], multi: true },
//     { type: 'input', name: 'adType', label: 'Ad Type', placeholder: 'Enter ad type' },
//     { type: 'input', name: 'brandName', label: 'Brand Name', placeholder: 'Enter Brand Name' }
//   ],
//   [
//     { type: 'input', name: 'duration', label: 'Duration', placeholder: 'Enter duration' },
//     { type: 'date-range', name: 'dateRange', label: 'Start - End Date' },
//     { type: 'select', name: 'timings', label: 'Timings', options: [{label: '9 AM - 11 AM', value: '9AM-11PM'}, {label: '11 AM - 1 PM', value: '11 AM-1AM'}, {label: '1 PM - 3 PM', value: '1AM-3AM'}, {label: '3 PM - 5 PM', value: '3PM-5PM'}, {label: '5 PM - 7 PM', value: '5PM-7PM'}]}
//   ],
//   [
//     { type: 'select', name: 'regions', label: 'Regions', options: [], multi: true },
//     { type: 'select', name: 'storeTypes', label: 'Store Type', options: [{ label: 'Kirana', value: 'Kirana' } , {label : 'pharmacy' , value : 'pharmacy'} , {label : 'Electronic', value : 'Electronic'} , {label : 'Beauty' , value :'Beauty'}] },
//     { type: 'select', name: 'targetDevices', label: 'Target Devices', options: [], multi: true }
//   ],
//   [
//     {
//       type: 'file',
//       name: 'productFiles', 
//       label: 'Product Files',
//       accept: '.jpg,.png,.mp4',
//       maxSizeMB: 25,
//       gridSpan: 3
//     }
//   ],
//   [
//     {
//       type: 'select',
//       name: 'campaignBudget',
//       label: 'Campaign Budget',
//       options: [
//         { label: '100k-200k', value: '100k-200k' },
//         { label: '200k-300k', value: '200k-300k' },
//         { label: '300k-400k', value: '300k-400k' }
//       ]
//     },
//     { type: 'input', name: 'baseBid', label: 'Base Bid', placeholder: 'Enter Base Bid' },
//     {
//       type: 'select',
//       name: 'maxBidCap',
//       label: 'Max Bid Cap',
//       options: [
//         { label: '200k-400k', value: '200k-400k' },
//         { label: '400k-600k', value: '400k-600k' },
//         { label: '600k-800k', value: '600k-800k' }
//       ]
//     }
//   ]
// ];
