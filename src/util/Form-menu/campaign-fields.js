export const fields = [
  // Row 1: Campaign Name full width
  [
    {
      type: 'input',
      name: 'campaignName',
      label: 'Campaign Name',
      placeholder: 'Enter campaign name',
      gridSpan: 3
    }
  ],
  // Row 2
  [
    { type: 'select', name: 'product', label: 'Product', options: [{ label: 'Product 1', value: 'p1' }] },
    { type: 'input', name: 'adType', label: 'Ad Type', placeholder: 'Enter ad type' },
    { type: 'select', name: 'storeType', label: 'Store Type', options: [{ label: 'Type 1', value: 't1' }] }
  ],
  // Row 3
  [
    { type: 'select', name: 'duration', label: 'Duration', options: [{ label: '1 Week', value: '1w' }] },
    { type: 'date-range', name: 'dateRange', label: 'Start - End Date' },
    { type: 'select', name: 'timings', label: 'Timings', options: [{ label: 'Morning', value: 'morning' }] }
  ],
  // Row 4
  [
    { type: 'select', name: 'regions', label: 'Regions', options: [{ label: 'Region 1', value: 'r1' }] },
    { type: 'select', name: 'storeTypes', label: 'Store Type', options: [{ label: 'Type A', value: 'a' }] },
    { type: 'select', name: 'targetDevices', label: 'Target Devices', options: [{ label: 'Mobile', value: 'mobile' }] }
  ],
  // Row 5 (file upload full width)
  [
    {
      type: 'file',
      name: 'productImages',
      label: 'Product Images',
      accept: '.jpg,.png,.mp4',
      maxSizeMB: 25,
      gridSpan: 3
    }
  ],
  // Row 6
  [
    { type: 'select', name: 'campaignBudget', label: 'Campaign Budget', options: [{ label: '$100', value: '100' }] },
    { type: 'input', name: 'baseBid', label: 'Base Bid', placeholder: 'Enter Base Bid' },
    { type: 'select', name: 'maxBidCap', label: 'Max Bid Cap', options: [{ label: '$200', value: '200' }] }
  ]
];
