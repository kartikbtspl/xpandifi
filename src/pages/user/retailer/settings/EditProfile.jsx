import React, { useEffect, useState } from "react";
import { Modal } from "../../../../components/ui/modal/Modal";
import Input from "../../../../components/ui/input/Input";
import Button from "../../../../components/ui/button/Button";
import { useForm } from "react-hook-form";
import { FiUser } from "react-icons/fi";

const EditProfile = ({ isOpen, onClose, userData, onSave }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      avatar: "",
      fullName: "",
      email: "",
      phone: "",
      alternatePhone: "",
      businessReg: "",
      gstNumber: "",
      address: "",
    },
  });

  const [avatarPreview, setAvatarPreview] = useState(userData.avatar || "");

  useEffect(() => {
    if (userData) {
      reset({
        avatar: userData.avatar || "",
        fullName: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        alternatePhone: userData.alternatePhone || "",
        businessReg: userData.field1 || "#123456789",
        gstNumber: userData.field2 || "XXXXXXXX1234",
        address: userData.address || "N/A",
      });

      setAvatarPreview(userData.avatar || "");
    }
  }, [userData, reset]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
      setValue("avatar", file);
    }
  };

  const onSubmit = (data) => {
    const updatedData = {
      ...userData,
      avatar: avatarPreview,
      name: data.fullName,
      email: data.email,
      phone: data.phone,
      alternatePhone: data.alternatePhone,
      field1: data.businessReg,
      field2: data.gstNumber,
      address: data.address,
    };
    onSave(updatedData); 
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" showCloseButton>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
        <div className="flex items-center gap-4 mb-4">
          <div>
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Profile"
                className="rounded-full h-24 w-24 shadow-sm object-cover"
              />
            ) : (
              <FiUser className="bg-gray-300 h-24 w-24 rounded-full text-gray-900" />
            )}
          </div>
          <div className="flex flex-col">
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="text-sm border border-gray-300 hover:cursor-pointer p-1 rounded"
            />
            <p className="text-gray-500 text-sm mt-4 ">
              At least 800 X 800 pixels recommended
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <Input
              type="text"
              placeholder="Enter full name"
              {...register("fullName", { required: "Full Name is required" })}
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm">{errors.fullName.message}</p>
            )}
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Email Id</label>
            <Input
              type="email"
              placeholder="Enter email"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div className="flex gap-4 mt-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">
              Phone Number
            </label>
            <Input
              type="text"
              placeholder="Enter phone number"
              {...register("phone", { required: "Phone is required" })}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">
              Alternate Number
            </label>
            <Input
              type="text"
              placeholder="Enter alternate number"
              {...register("alternatePhone")}
            />
          </div>
        </div>

        <div className="flex gap-4 mt-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">
              Business Registration Number
            </label>
            <Input type="text" {...register("businessReg")} />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">GST Number</label>
            <Input type="text" {...register("gstNumber")} />
          </div>
        </div>

        <div className="mb-4 mt-4">
          <label className="block text-sm font-medium mb-1">
            Residential Address
          </label>
          <Input type="text" {...register("address")} />
        </div>

        <div className="flex justify-end">
          <Button type="submit" isIcon={false} variant="primary" label="Save" />
        </div>
      </form>
    </Modal>
  );
};

export default EditProfile;
