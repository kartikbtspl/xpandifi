import { useState } from "react";
import { useForm } from "react-hook-form";
import { Modal } from "../../../../../components/ui/modal/Modal";
import Input from "../../../../../components/ui/input/Input";
import Button from "../../../../../components/ui/button/Button";
import Switch from "@mui/material/Switch";
import { Controller } from "react-hook-form";
import Select from "react-select";

const AddUserModal = ({ isOpen, onClose }) => {
  // local states
  const [status, setStatus] = useState(true); // default ON

  const {
    register,
    handleSubmit,
    formState: { errors },
    control, 
  } = useForm();

  // handle switch toggle
  const handleSwitch = () => {
    setStatus((prev) => !prev);
  };
  const onSubmit = (data) => {
    const payload = {
      ...data,
      status,
    };
    console.log("User Submitted:", payload);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" showCloseButton>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2 className="text-xl font-bold">Add User</h2>

        <div className="pt-6 space-y-6">
          {/* Name + Role + Status Row */}
          <div className="flex items-center gap-4">
            {/* Full Name */}
            <div className="flex-1 mt-4">
              <label className="block text-sm font-medium">Full Name</label>
              <Input
                type="text"
                placeholder="Enter full name"
                className="w-full"
                {...register("fullName", { required: true })}
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm">Full Name is required</p>
              )}
            </div>

            {/* Role Dropdown using Controller + react-select */}
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Role</label>
              <Controller
                control={control}
                name="role"
                rules={{ required: "Role is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={[
                      { value: "Store Manager", label: "Store Manager" },
                      {
                        value: "Marketing & Sales",
                        label: "Marketing & Sales",
                      },
                      { value: "Finance Manager", label: "Finance Manager" },
                    ]}
                    placeholder="Select role"
                    value={
                      [
                        { value: "Store Manager", label: "Store Manager" },
                        {
                          value: "Marketing & Sales",
                          label: "Marketing & Sales",
                        },
                        { value: "Finance Manager", label: "Finance Manager" },
                      ].find((opt) => opt.value === field.value) || null
                    }
                    onChange={(selected) => field.onChange(selected?.value)}
                    className="react-select-container"
                  />
                )}
              />
              {errors.role && (
                <p className="text-red-500 text-sm">{errors.role.message}</p>
              )}
            </div>

            {/* Status */}
            <div className="flex items-center space-x-2 mb-10">
              <span className="text-sm text-gray-600">Status</span>
              <Switch
                checked={status}
                onChange={handleSwitch}
                size="small"
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": { color: "#445C91" },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: "#445C91",
                  },
                }}
              />
            </div>
          </div>

          {/* Email + Phone */}
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                type="email"
                placeholder="Enter email address"
                {...register("email", { required: true })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">Email is required</p>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium">Phone Number</label>
              <Input
                type="text"
                placeholder="+91"
                {...register("phone", { required: true })}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">Phone is required</p>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <Button
            isIcon={false}
              type="submit"
              variant="primary"
              label="Add User"
              className="px-6 py-2"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddUserModal;
