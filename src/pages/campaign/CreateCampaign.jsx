import * as yup from "yup";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import FormBuilder from "../../components/form/FromBuilder";
import {
  productTypes,
  deviceTypes,
  targetRegions,
} from "../../api/campaign-api/targetingOptionService";
import {
  createCampaign,
  fetchCampaigns,
} from "../../redux/slices/campaignSlice";
import Loader from "../../components/loader/Loader";
import { yupResolver } from "@hookform/resolvers/yup";
import { campaignValidationSchema } from "../../util/validation/campaignValidationSchema";
import { fields } from "../../util/Form-menu/campaign-fields";

const CreateCampaign = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.campaign);
  const methods = useForm({
    resolver: yupResolver(campaignValidationSchema),
  });

  const buildValidationSchema = () => {
    const shape = {};
    fields.flat().forEach((field) => {
      if (field.validation) shape[field.name] = field.validation;
    });
    return yup.object().shape(shape);
  };

  const [dropdowns, setDropdowns] = useState({
    product: [],
    targetDevices: [],
    regions: [],
  });

  useEffect(() => {
    Promise.all([productTypes(), deviceTypes(), targetRegions()]).then(
      ([products, devices, regions]) => {
        setDropdowns({
          product: (products || []).map((d) => ({
            label: d.product_type,
            value: d.product_type,
          })),
          targetDevices: (devices || []).map((d) => ({
            label: d.deviceName,
            value: d.deviceName,
          })),
          regions: (regions || []).map((d) => ({
            label: d.city,
            value: d.city,
          })),
        });
      }
    );
  }, []);

  const handleSubmit = async (formData) => {
    if (loading) return;
    const result = await dispatch(createCampaign(formData));
    if (createCampaign.fulfilled.match(result)) {
      await dispatch(fetchCampaigns()); // <-- refresh campaigns list after create
      methods.reset();
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div className="text-lg font-semibold text-[#445E94]">
          Creating Campaign...
        </div>
        <Loader />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 relative">
      <FormBuilder
        onSubmit={handleSubmit}
        dropdowns={dropdowns}
        methods={methods}
      />
    </div>
  );
};

export default CreateCampaign;
