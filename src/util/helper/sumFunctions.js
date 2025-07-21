export const getBaseBidSums = (campaigns) => {
  let approvedSum = 0;
  let unapprovedSum = 0;

  campaigns.forEach((campaign) => {
    const bid = Number(campaign.baseBid) || 0;
    if (campaign.isApproved === "APPROVED") {
      approvedSum += bid;
    } else {
      unapprovedSum += bid;
    }
  });

  return { approvedSum, unapprovedSum };
};


// export const getTotalMaxBidCap = (campaigns) => {
//   return campaigns.reduce((total, campaign) => {
//     const cap = Number(campaign.maxBidCap);
//     return total + (isNaN(cap) ? 0 : cap);
//   }, 0);
// };

export const getTotalMaxBidCap = (campaigns) => {
  return campaigns.reduce((total, campaign) => {
    if (campaign.isApproved === "APPROVED") {
      const cap = Number(campaign.maxBidCap);
      return total + (isNaN(cap) ? 0 : cap);
    }
    return total;
  }, 0);
};
