import {useState , useEffect} from "react";
import FormBuilder from "../../components/form/FromBuilder";
import { productTypes , targetRegions , deviceTypes } from "../../api/campaign-api/targetingOptionService";
const CreateCampaign = () => {
  const [dropdowns, setDropdowns] = useState({
    product: [],
    targetDevices: [],
    regions: [],
    // Add more as needed
  });

 useEffect(() => {
  // Fetch all dropdowns in parallel
  Promise.all([productTypes(), deviceTypes(), targetRegions()]).then(
    ([products, devices, regions]) => {
      setDropdowns({
        product: (products || []).map((d) => ({
          label: d.product_type,
          value: d.product_type,
        })),
        targetDevices: (devices || []).map((d) => ({
          label: d.deviceName	,
          value: d.deviceName	,
        })),
        regions: (regions || []).map((d) => ({
          label: d.city,
          value: d.city,
        })),
      });
    }
  );
}, []);

  const handleSubmit = (data) => {
    console.log("Form Data:", data);
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      <FormBuilder onSubmit={handleSubmit} dropdowns={dropdowns} />
    </div>
  );
};

export default CreateCampaign;
