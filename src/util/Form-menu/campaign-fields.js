import { generateTimeSlots } from "../helper/generateTimeSlots";

export const fields = [
  [
    {
      type: 'input',
      name: 'campaignName',
      label: 'Campaign Name',
      placeholder: 'Enter campaign name',
      gridSpan: 3
    }
  ],
  [
    { type: 'select', name: 'product', label: 'Product', options: [], multi: true },
    { type: 'input', name: 'adType', label: 'Ad Type', placeholder: 'Enter ad type' },
    { type: 'input', name: 'brandName', label: 'Brand Name', placeholder: 'Enter Brand Name' }
  ],
  [
    { type: 'input', name: 'duration', label: 'Duration', placeholder: 'Enter duration' },
    { type: 'date-range', name: 'dateRange', label: 'Start - End Date' },
    { type: 'select', name: 'timings', label: 'Timings', options: [{label: '9 AM - 11 AM', value: '9AM-11PM'}, {label: '11 AM - 1 PM', value: '11 AM-1AM'}, {label: '1 PM - 3 PM', value: '1AM-3AM'}, {label: '3 PM - 5 PM', value: '3PM-5PM'}, {label: '5 PM - 7 PM', value: '5PM-7PM'}]}
  ],
  [
    { type: 'select', name: 'regions', label: 'Regions', options: [], multi: true },
    { type: 'select', name: 'storeTypes', label: 'Store Type', options: [{ label: 'Kirana', value: 'Kirana' } , {label : 'Parma' , value : 'Parma'} , {label : 'Electronic', value : 'Electronic'} , {label : 'Beauty' , value :'Beauty'}] },
    { type: 'select', name: 'targetDevices', label: 'Target Devices', options: [], multi: true }
  ],
  [
    {
      type: 'file',
      name: 'productFiles', // fixed
      label: 'Product Files',
      accept: '.jpg,.png,.mp4',
      maxSizeMB: 25,
      gridSpan: 3
    }
  ],
  [
    {
      type: 'select',
      name: 'campaignBudget',
      label: 'Campaign Budget',
      options: [
        { label: '100k-200k', value: '100k-200k' },
        { label: '200k-300k', value: '200k-300k' },
        { label: '300k-400k', value: '300k-400k' }
      ]
    },
    { type: 'input', name: 'baseBid', label: 'Base Bid', placeholder: 'Enter Base Bid' },
    {
      type: 'select',
      name: 'maxBidCap',
      label: 'Max Bid Cap',
      options: [
        { label: '200k-400k', value: '200k-400k' },
        { label: '400k-600k', value: '400k-600k' },
        { label: '600k-800k', value: '600k-800k' }
      ]
    }
  ]
];
