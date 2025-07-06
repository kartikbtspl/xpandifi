import React, { useState, useEffect } from "react";
import ReusableTable from "../../components/table/ReusableTable";

const productCategories = ["Electronics", "Clothing", "Groceries", "Beauty", "Home", "Sports"];
const productNames = [
  "Wireless Mouse",
  "T-Shirt",
  "Organic Apples",
  "Lipstick",
  "Vacuum Cleaner",
  "Football",
  "Bluetooth Headphones",
  "Jeans",
  "Almonds",
  "Face Cream",
  "Air Fryer",
  "Tennis Racket",
];

// Utility to generate random POS data
const generateRandomData = (count = 20) => {
  return Array.from({ length: count }).map((_, index) => ({
    id: index + 1,
    productName: productNames[Math.floor(Math.random() * productNames.length)],
    category: productCategories[Math.floor(Math.random() * productCategories.length)],
    price: (Math.random() * 1000 + 100).toFixed(2), // ₹100 - ₹1100
  }));
};

const PosDataUpload = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const data = generateRandomData(20);
    setRows(data);
  }, []);

  const columns = [
    { id: "productName", label: "Product Name" },
    { id: "category", label: "Category" },
    { id: "price", label: "Price (₹)", numeric: true },
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">POS Data Upload</h2>
      <ReusableTable columns={columns} rows={rows} />
    </div>
  );
};

export default PosDataUpload;
