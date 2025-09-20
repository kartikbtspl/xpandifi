// src/util/Form-menu/campaign-fields.js
import * as yup from "yup";

export const fields = [
  // Campaign Name
  [
    {
      type: "input",
      name: "name",
      label: "Campaign Name",
      placeholder: "Enter campaign name",
      gridSpan: 3,
      validation: yup.string().required("Campaign name is required"),
    },
  ],

  // Campaign Objective
  [
    {
      type: "select",
      name: "objective",
      label: "Objective of Campaigns",
      options: [
        {
          label: "Increase Brand Awareness Among Target Audience",
          value: "increaseBrandAwareness",
        },
        {
          label: "Drive Website Traffic to Key Landing Pages",
          value: "driveWebsiteTraffic",
        },
        {
          label: "Generate Leads for Sales or Marketing Teams",
          value: "generateLeads",
        },
        {
          label: "Boost Product or Service Sales Online",
          value: "boostProductSales",
        },
        {
          label: "Increase Engagement on Social Media Platforms",
          value: "increaseSocialEngagement",
        },
        {
          label: "Promote App Installs and User Retention",
          value: "promoteAppInstalls",
        },
        {
          label: "Encourage Newsletter Signups and Subscriptions",
          value: "newsletterSignups",
        },
        {
          label: "Collect Customer Feedback or Conduct Market Research",
          value: "customerFeedbackResearch",
        },
      ],
      validation: yup.string().required("Select a campaign objective"),
    },
  ],

  // Brand, Date & Duration
  [
    {
      type: "input",
      name: "brandName",
      label: "Brand Name",
      placeholder: "Enter brand name",
      validation: yup.string().required("Brand name is required"),
    },
    {
  type: "date-range",
  name: "dateRange",
  label: "Start - End Date",
  validation: yup
    .array()
    .of(yup.date().required())
    .min(2, "Select a valid date range")
    .required("Date range is required")
    .transform((value, originalValue) => {
      if (originalValue && originalValue.start && originalValue.end) {
        return [originalValue.start, originalValue.end];
      }
      return value;
    }),
},


    {
      type: "input",
      name: "duration",
      label: "Duration (in seconds)",
      placeholder: "Enter duration",
      validation: yup
        .number()
        .typeError("Duration must be a number")
        .positive("Must be positive")
        .required("Duration is required"),
    },
  ],

  // Product, Ad Type & Timings
  [
    {
      type: "select",
      name: "product",
      label: "Product",
      options: [],
      multi: false,
      validation: yup.string().required("Select at least one product"),
    },
    {
      type: "select",
      name: "adType",
      label: "Ad Type",
      options: [
        { label: "Informative", value: "informative" },
        { label: "Market Research", value: "marketResearch" },
        { label: "Market Survey", value: "marketSurvey" },
      ],
      validation: yup.string().required("Select an ad type"),
    },
    {
      type: "select",
      name: "timings",
      label: "Timings (1 hour)",
      options: Array.from({ length: 24 }).map((_, i) => {
        const start = i % 12 === 0 ? 12 : i % 12;
        const end = (i + 1) % 12 === 0 ? 12 : (i + 1) % 12;
        const startSuffix = i < 12 ? "AM" : "PM";
        const endSuffix = i + 1 < 12 || i + 1 === 24 ? "AM" : "PM";
        return {
          label: `${start} ${startSuffix} - ${end} ${endSuffix}`,
          value: `${start}${startSuffix}-${end}${endSuffix}`,
        };
      }),
      validation: yup.string().required("Please select timings"),
    },
  ],

  // Target Audience Details
  [
    {
      type: "select",
      name: "ageGroup",
      label: "Target Audience Age Group",
      options: [
        { label: "Under 18", value: "under18" },
        { label: "18-24", value: "18to24" },
        { label: "25-34", value: "25to34" },
        { label: "35-44", value: "35to44" },
        { label: "45-54", value: "45to54" },
        { label: "55-64", value: "55to64" },
        { label: "65 and above", value: "65plus" },
      ],
      validation: yup.string().required("Select a target age group"),
    },
    {
      type: "select",
      name: "storeTypes",
      label: "Store Type",
      options: [
        { label: "Kirana", value: "Kirana" },
        { label: "Pharmacy", value: "pharmacy" },
        { label: "Electronic", value: "Electronic" },
        { label: "Beauty", value: "Beauty" },
      ],
      validation: yup.string().required("Select a store type"),
    },
    {
      type: "select",
      name: "targetDevices",
      label: "Target Devices",
      options: [],
      multi: true,
      validation: yup.array().min(1, "Select at least one device").required(),
    },
    // {
    //   type: "select",
    //   name: "cities",
    //   label: "Cities",
    //   options: [], // passed dynamically from dropdownData.cities
    //   multi: true,
    // },
    {
      type: "select",
      name: "regions",
      label: "Regions",
      options: [], // dynamically filled based on selected cities
      multi: true,
    },

    // {
    //   type: "select",
    //   name: "pincode",
    //   label: "Pin Code",
    //   options: [],
    //   multi: true,
    //   validation: yup.array().min(1, "Select at least one pincode").required(),
    // },
  ],

  // Upload Creatives
  [
    {
      type: "file",
      name: "productFiles",
      label: "Upload Creatives",
      accept: ".jpg,.png,.mp4",
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

  // Budget & Bidding
  [
    {
      type: "input",
      name: "campaignBudget",
      label: "Campaign Budget",
      placeholder: "₹ Amount",
      validation: yup.string().required("Budget is required"),
    },
    {
      type: "input",
      name: "baseBid",
      label: "Campaign Base Value",
      placeholder: "Base Value",
      disabled: true,
      validation: yup
        .number()
        .typeError("Base Value must be a number")
        .required("Base Value is required"),
    },
    {
      type: "input",
      name: "maxBidCap",
      label: "Bid Value",
      placeholder: "₹ Amount",
      validation: yup.string().required("Max Bid Cap is required"),
    },
  ],
];

// // src/util/Form-menu/campaign-fields.js
// import * as yup from "yup";

// export const fields = [
//   [
//     {
//       type: "input",
//       name: "name",
//       label: "Campaign Name",
//       placeholder: "Enter campaign name",
//       gridSpan: 3,
//       validation: yup.string().required("Campaign name is required"),
//     },
//   ],
//   [
//     {
//       type: "select",
//       name: "objective",
//       label: "Objective of Campaigns",
//       options: [
//         {
//           label: "Increase Brand Awareness Among Target Audience",
//           value: "increaseBrandAwareness",
//         },
//         {
//           label: "Drive Website Traffic to Key Landing Pages",
//           value: "driveWebsiteTraffic",
//         },
//         {
//           label: "Generate Leads for Sales or Marketing Teams",
//           value: "generateLeads",
//         },
//         {
//           label: "Boost Product or Service Sales Online",
//           value: "boostProductSales",
//         },
//         {
//           label: "Increase Engagement on Social Media Platforms",
//           value: "increaseSocialEngagement",
//         },
//         {
//           label: "Promote App Installs and User Retention",
//           value: "promoteAppInstalls",
//         },
//         {
//           label: "Encourage Newsletter Signups and Subscriptions",
//           value: "newsletterSignups",
//         },
//         {
//           label: "Collect Customer Feedback or Conduct Market Research",
//           value: "customerFeedbackResearch",
//         },
//       ],
//       validation: yup.string().required("Select a store type"),
//     },
//   ],
//   [
//     {
//       type: "input",
//       name: "brandName",
//       label: "Brand Name",
//       placeholder: "Enter brand name",
//       validation: yup.string().required("Brand name is required"),
//     },
//     {
//       type: "date-range",
//       name: "dateRange",
//       label: "Start - End Date",
//       validation: yup
//         .array()
//         .of(yup.date().required())
//         .min(2, "Select a valid date range")
//         .required(),
//     },
//     {
//       type: "input",
//       name: "duration",
//       label: "Duration (in seconds)",
//       placeholder: "Enter duration",
//       validation: yup
//         .number()
//         .typeError("Duration must be a number")
//         .positive("Must be positive")
//         .required("Duration is required"),
//     },
//   ],
//   [
//     {
//       type: "select",
//       name: "product",
//       label: "Product",
//       options: [],
//       multi: false,
//       validation: yup.string().required("Select at least one product"),

//       // validation: yup.array().min(1, "Select at least one product").required(),
//     },
//     {
//       type: "select",
//       name: "adType",
//       label: "Ad Type",
//       options: [
//         { label: "Informative", value: "informative" },
//         { label: "Market Research", value: "marketResearch" },
//         { label: "Market Survey", value: "marketSurvey" },
//       ],
//       validation: yup.string().required("Select a store type"),
//     },

//     {
//       type: "select",
//       name: "timings",
//       label: "Timings (1 hour)",
//       options: [
//         { label: "12 AM - 1 AM", value: "12AM-1AM" },
//         { label: "1 AM - 2 AM", value: "1AM-2AM" },
//         { label: "2 AM - 3 AM", value: "2AM-3AM" },
//         { label: "3 AM - 4 AM", value: "3AM-4AM" },
//         { label: "4 AM - 5 AM", value: "4AM-5AM" },
//         { label: "5 AM - 6 AM", value: "5AM-6AM" },
//         { label: "6 AM - 7 AM", value: "6AM-7AM" },
//         { label: "7 AM - 8 AM", value: "7AM-8AM" },
//         { label: "8 AM - 9 AM", value: "8AM-9AM" },
//         { label: "9 AM - 10 AM", value: "9AM-10AM" },
//         { label: "10 AM - 11 AM", value: "10AM-11AM" },
//         { label: "11 AM - 12 PM", value: "11AM-12PM" },
//         { label: "12 PM - 1 PM", value: "12PM-1PM" },
//         { label: "1 PM - 2 PM", value: "1PM-2PM" },
//         { label: "2 PM - 3 PM", value: "2PM-3PM" },
//         { label: "3 PM - 4 PM", value: "3PM-4PM" },
//         { label: "4 PM - 5 PM", value: "4PM-5PM" },
//         { label: "5 PM - 6 PM", value: "5PM-6PM" },
//         { label: "6 PM - 7 PM", value: "6PM-7PM" },
//         { label: "7 PM - 8 PM", value: "7PM-8PM" },
//         { label: "8 PM - 9 PM", value: "8PM-9PM" },
//         { label: "9 PM - 10 PM", value: "9PM-10PM" },
//         { label: "10 PM - 11 PM", value: "10PM-11PM" },
//         { label: "11 PM - 12 AM", value: "11PM-12AM" },
//       ],
//       validation: yup.string().required("Please select timings"),
//     },
//   ],
//   [{
//   type: "select",
//   name: "ageGroup",
//   label: "Target Audience",
//   options: [
//     { label: "Under 18", value: "under18" },
//     { label: "18-24", value: "18to24" },
//     { label: "25-34", value: "25to34" },
//     { label: "35-44", value: "35to44" },
//     { label: "45-54", value: "45to54" },
//     { label: "55-64", value: "55to64" },
//     { label: "65 and above", value: "65plus" }
//   ],
//   validation: yup.string().required("Select a target age group"),
// }
// ,
//     {
//       type: "select",
//       name: "storeTypes",
//       label: "Store Type",
//       options: [
//         { label: "Kirana", value: "Kirana" },
//         { label: "Pharmacy", value: "pharmacy" },
//         { label: "Electronic", value: "Electronic" },
//         { label: "Beauty", value: "Beauty" },
//       ],
//       validation: yup.string().required("Select a store type"),
//     },
//     {
//       type: "select",
//       name: "targetDevices",
//       label: "Target Devices",
//       options: [],
//       multi: true,
//       validation: yup.array().min(1, "Select at least one device").required(),
//     },
//     {
//       type: "select",
//       name: "regions",
//       label: "Regions",
//       options: [],
//       multi: true,
//       validation: yup.array().min(1, "Select at least one region").required(),
//     },
//     {
//       type: "select",
//       name: "pincode",
//       label: "Pin Code",
//       options: [],
//       multi: true,
//       validation: yup.array().min(1, "Select at least one region").required(),
//     },
//   ],

//   [
//     {
//       type: "file",
//       name: "productFiles",
//       label: "Upload Creatives",
//       accept: ".jpg,.png,.mp4",
//       maxSizeMB: 25,
//       gridSpan: 3,
//       validation: yup
//         .mixed()
//         .test(
//           "file-required",
//           "At least one file is required",
//           (value) => value && value.length > 0
//         ),
//     },
//   ],
//   [
//     {
//       type: "input",
//       name: "campaignBudget",
//       label: "Campaign Budget",
//       placeholder: "₹ Amount",
//       validation: yup.string().required("Budget is required"),
//     },
//     {
//       type: "input",
//       name: "baseBid",
//       label: "Campaign Base Value",
//       placeholder: "Base Value",
//       disabled: true,
//       validation: yup
//         .number()
//         .typeError("Base Value must be a number")
//         .required("Base Value is required"),
//     },
//     {
//       type: "input",
//       name: "maxBidCap",
//       label: "Bid Value",
//       placeholder: "₹ Amount",
//       validation: yup.string().required("Max Bid Cap is required"),
//     },
//   ],
// ];
