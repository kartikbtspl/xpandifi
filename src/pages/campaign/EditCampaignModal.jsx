import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import FormBuilder from "../../components/form/FromBuilder";
import { Modal } from "../../components/ui/modal/Modal";
import {
  productTypes,
  targetRegions,
  deviceTypes,
} from "../../api/campaign-api/targetingOptionService";
import { useDispatch, useSelector } from "react-redux";
import { updateCampaign } from "../../redux/slices/campaignDetailSlice";
import Loader from "../../components/loader/Loader";
import { toast } from "react-toastify";

const EditCampaignModal = ({ isOpen, onClose, campaignData, onSuccess }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.campaignDetail);

  const methods = useForm({
    defaultValues: {},
  });

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

  useEffect(() => {
    if (campaignData) {
      methods.reset({
        ...campaignData,
        productFiles: campaignData.productFiles || [],
        timings: campaignData?.timings,
      });
    }
  }, [campaignData, methods]);

  const handleUpdate = async (formData) => {
    await dispatch(updateCampaign({ id: campaignData.id, data: formData }));
    toast.success("Campaign updated successfully");
    onSuccess?.(); // Refresh campaigns list
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <FormProvider {...methods}>
        <div className="relative">
          {/* Show Loader inside modal content */}
          {loading && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 rounded-md">
              <div className="flex flex-col items-center gap-2">
                <h2 className="text-sm text-gray-700">Updating Campaign...</h2>
                <Loader />
              </div>
            </div>
          )}
          <FormBuilder
            onSubmit={handleUpdate}
            dropdowns={dropdowns}
            methods={methods}
            isEdit={true}
            loading={loading}
          />
        </div>
      </FormProvider>
    </Modal>
  );
};

export default EditCampaignModal;
