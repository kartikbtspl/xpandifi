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
