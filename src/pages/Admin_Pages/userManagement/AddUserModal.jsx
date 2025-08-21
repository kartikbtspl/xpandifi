
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

import { Modal } from "../../components/ui/modal/Modal";
import Input from "../../components/ui/input/Input";
import Button from "../../components/ui/button/Button";
import Loader from "../../components/ui/loader/Loader";
import { createUser, fetchUsers } from "../../redux/slices/userManagementSlice";
import { Switch } from "@mui/material";
import { toast } from "react-toastify";

const AddUserModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { formLoading } = useSelector((state) => state.usersManagement);
  const [selectedRole, setSelectedRole] = useState("Retailer");
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (formData) => {
    const payload = {
      ...formData,
      role: selectedRole,
      status: "ACTIVE",
    };
    dispatch(createUser(payload)).then((res) => {
      if (!res.error) {
        // dispatch(fetchUsers());
        toast.success("User added successfully!");
        reset();
        setSelectedRole("Retailer");
        onClose();
      }
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" showCloseButton>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-4 space-y-6">
          <div className="flex items-center justify-between mt-2">
            <h2 className="text-xl font-bold">Add User</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Status</span>
              <Switch checked disabled size="small" sx={{
                "& .MuiSwitch-switchBase.Mui-checked": { color: "#445C91" },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#445C91" },
              }} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex">
              <div className="flex-1 mr-4 gap-2">
                <label className="block text-sm font-medium">Full Name</label>
                <Input type="text" placeholder="Enter full name" className="w-full" {...register("fullName", { required: true })} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <div className="flex gap-2">
                  {["Retailer", "Ad-Agency"].map((role) => (
                    <Button
                      key={role}
                      isIcon={false}
                      variant="custom"
                      type="button"
                      className={`w-[110px] h-[30px] rounded-full text-sm font-semibold border transition-all duration-150 ${
                        selectedRole === role ? "bg-[#445C91] text-white border-[#445C91]" : "bg-white text-[#445C91] border-[#445C91]"
                      }`}
                      onClick={() => setSelectedRole(role)}
                      label={role}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input type="email" placeholder="Enter email address" {...register("email", { required: true })} />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium">Phone Number</label>
                <Input type="text" placeholder="Enter phone number" {...register("phone", { required: true })} />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" variant="primary" label={formLoading ? <Loader size="vs" /> : "Add User"} className="px-6 py-2" />
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddUserModal;