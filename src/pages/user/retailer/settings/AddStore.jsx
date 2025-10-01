import { useForm, Controller } from "react-hook-form";
import { Modal } from "../../../../components/ui/modal/Modal";
import Input from "../../../../components/ui/input/Input";
import Button from "../../../../components/ui/button/Button";
import Select from "react-select";

const AddStore = ({ isOpen, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm();

  const onSubmit = (data) => {
    console.log("Store Submitted:", data);
    handleClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg" showCloseButton>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2 className="text-xl font-bold">Add Store</h2>

        <div className="pt-6">
          {/* Store Address */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Store Address
            </label>
            <Input
              type="text"
              placeholder="Enter Address"
              {...register("storeAddress", { required: true })}
              className="w-full"
            />
            {errors.storeAddress && (
              <p className="text-red-500 text-sm">Store Address is required</p>
            )}
          </div>

          {/* Store Name + Regions */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Store Name
              </label>
              <Input
                type="text"
                placeholder="Enter Store name"
                {...register("storeName", { required: true })}
              />
              {errors.storeName && (
                <p className="text-red-500 text-sm">Store Name is required</p>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Regions</label>
              <Input
                type="text"
                placeholder="Add Regions"
                {...register("regions")}
              />
            </div>
          </div>

          {/* Business Registration Number + GST Number */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Business Registration Number
              </label>
              <Input
                type="text"
                placeholder="123XYZ123"
                {...register("businessRegNo", { required: true })}
              />
              {errors.businessRegNo && (
                <p className="text-red-500 text-sm">
                  Business Registration Number is required
                </p>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                GST Number
              </label>
              <Input
                type="text"
                placeholder="XXXXXXXX234"
                {...register("gstNo", { required: true })}
              />
              {errors.gstNo && (
                <p className="text-red-500 text-sm">GST Number is required</p>
              )}
            </div>
          </div>

          {/* Phone Number + Alternate Number */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Phone Number
              </label>
              <Input
                type="text"
                placeholder="+91"
                {...register("phone", { required: true })}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">Phone is required</p>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Alternate Number
              </label>
              <Input type="text" placeholder="+91" {...register("altPhone")} />
            </div>
          </div>

          {/* Contact's Role + Store Type (using react-select) */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Contact's Role
              </label>
              <Controller
                control={control}
                name="contactRole"
                rules={{ required: "Role is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={[
                      { value: "Manager", label: "Manager" },
                      { value: "Sales", label: "Sales" },
                      { value: "Analyst", label: "Analyst" },
                    ]}
                    placeholder="Select Roles"
                    value={
                      [
                        { value: "Manager", label: "Manager" },
                        { value: "Sales", label: "Sales" },
                        { value: "Analyst", label: "Analyst" },
                      ].find((opt) => opt.value === field.value) || null
                    }
                    onChange={(selected) => field.onChange(selected?.value)}
                  />
                )}
              />
              {errors.contactRole && (
                <p className="text-red-500 text-sm">
                  {errors.contactRole.message}
                </p>
              )}
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Store Type
              </label>
              <Controller
                control={control}
                name="storeType"
                rules={{ required: "Store Type is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={[
                      { value: "Retail", label: "Retail" },
                      { value: "Wholesale", label: "Wholesale" },
                      { value: "Franchise", label: "Franchise" },
                    ]}
                    placeholder="Select Type"
                    value={
                      [
                        { value: "Retail", label: "Retail" },
                        { value: "Wholesale", label: "Wholesale" },
                        { value: "Franchise", label: "Franchise" },
                      ].find((opt) => opt.value === field.value) || null
                    }
                    onChange={(selected) => field.onChange(selected?.value)}
                  />
                )}
              />
              {errors.storeType && (
                <p className="text-red-500 text-sm">
                  {errors.storeType.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-6">
            <Button
              isIcon={false}
              type="submit"
              variant="primary"
              label="Register"
              className="px-6 py-2"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddStore;
