import React, { useEffect, useState } from "react";
import ReusableTable from "../../components/table/ReusableTable";
import { useSelector } from "react-redux";
import { Switch } from "@mui/material";
import {Modal} from "../../components/ui/modal/Modal"
import FormBuilder from "../../components/form/FromBuilder";
import { useForm } from "react-hook-form";
import Button from "../../components/ui/button/Button"

const PosDataUpload = () => {
  const { campaigns, loading } = useSelector((state) => state.approvedCampaigns);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [isEdit, setEdit] =useState(false)

  const methods = useForm();

  const handleRowClick = (row) => {
    setEdit(true)
    setSelected(row);
    setIsOpen(true);
  };

  const handleSubmit = (data) => {
    console.log("Submitted form:", data);
    setIsOpen(false);
  };

  useEffect(() => {
    if (selected) {
      // Pre-fill form when a row is selected
      Object.entries(selected).forEach(([key, value]) => {
        methods.setValue(key, value);
      });
    }
  }, [selected]);

  const fieldsConfig = [
    [
      { name: "productName", label: "Product Name", type: "input" },
   

      { name: "category", label: "Category", type: "input" },
    ],
    [
      
      { name: "shortName", label: "Short Name", type: "input"},
    

      { name: "gst", label: "GST", type: "input" },
    ],
    [
      
      
      {
        name: "productUOM",
        label: "Product UOM (Unit of Measurement)",
        type: "select",
        gridSpan:2
      
      },
      { name: "descriptions", label: "Descriptions", type: "input" },
    ],
    [
      { name: "productMeddia", label: "Product Media", type: "file" },
    ],
  ];

  const dropdowns = {
    productUOM: [
      { label: "Kg", value: "kg" },
      { label: "Litre", value: "litre" },
      { label: "Piece", value: "piece" },
    ],
    quantity: Array.from({ length: 10 }, (_, i) => ({
      label: `${i + 1}`,
      value: i + 1,
    })),
  };

  const rows = [
    {
      id: 1,
      productName: "Wireless Mouse",
      category: "Electronics",
      shortName: "Mouse",
      gst: "18%",
      descriptions: "A smooth wireless mouse",
      productUOM: "Piece",
      quantity: 2,
      image: "https://picsum.photos/seed/1/400",
      productMeddia: null,
      price: "₹699",
      is_available: true,
    },
    {
      id: 2,
      productName: "Bluetooth Speaker",
      category: "Audio",
      shortName: "Speaker",
      gst: "18%",
      descriptions: "Portable Bluetooth Speaker",
      productUOM: "Piece",
      quantity: 1,
      image: "https://picsum.photos/seed/2/400",
      productMeddia: null,
      price: "₹1,299",
      is_available: false,
    },
    // Add more rows...
  ];

  const columns = [
    {
      id: "productName",
      label: "Product",
      render: (row) => (
        <div className="flex items-center gap-3" onClick={() => handleRowClick(row)}>
          <img
            src={row.image}
            alt={row.productName}
            className="w-10 h-10 object-cover rounded"
          />
          <span className="font-medium text-gray-800">{row.productName}</span>
        </div>
      ),
    },
    { id: "category", label: "Category" },
    { id: "price", label: "Price" },
    {
      id: "availability",
      label: "Availability",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Switch
            checked={row.is_available}
            onChange={() => console.log("Toggled:", row.is_available)}
            color="primary"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">POS Data Uploads</h2>
      <Button
      label={"Add Product"}
      onClick={()=>setIsOpen(true)}
      />
      </div>
      <ReusableTable columns={columns} rows={rows} loading={loading} />

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} containerClassName="overflow-y-scroll p-0 rounded-xl" size="lg">
        <FormBuilder
          methods={methods}
          dropdowns={dropdowns}
          onSubmit={handleSubmit}
          fieldsConfig={fieldsConfig}
          title={isEdit?"Edit Product":"Add Product"}
          submitLabel={isEdit?"Update":"Add"}
          loading={false}
          isEdit={true}
          isIcon={false}
        />
      </Modal>
    </div>
  );
};

export default PosDataUpload;
