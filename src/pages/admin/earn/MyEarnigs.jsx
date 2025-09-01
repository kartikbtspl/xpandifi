import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRevenue } from "../../../api/admin/admin-api/admin-api";
import { getAllRevenueHistory } from "../../../redux/slices/admin/adminRevenueSlice";
import ReusableTable from "../../../components/table/ReusableTable"; // adjust path

const AdminMyEarnings = () => {
  const dispatch = useDispatch();
  const { revenueHistory, loading, error, fetched } = useSelector(
    (state) => state.adminRevenue
  );

  const [revenue, setRevenue] = useState(null);

  // Fetch total and monthly revenue
  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const data = await getRevenue();
        setRevenue(data);
      } catch (error) {
        console.error("Error fetching revenue:", error);
      }
    };
    fetchRevenue();
  }, []);

  // Fetch transaction history from Redux
  useEffect(() => {
    if (!fetched) {
      dispatch(getAllRevenueHistory());
    }
  }, [dispatch, fetched]);

  // Define table columns
  const columns = [
    { id: "createdAt", label: "Date" },
    { id: "campaignName", label: "Campaign", render: (row) => `${row.campaignName} (${row.campaignCode})` },
    { id: "amount", label: "Amount", numeric: true, render: (row) => `₹${row.amount}` },
    { id: "businessName", label: "Business" },
  ];

  return (
    <main className="min-h-screen font-sans">
      <header className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
          Revenue
        </h1>
        <p className="mt-2 text-gray-600">
          Overview of your earnings and transactions
        </p>
      </header>

      {/* Summary Cards */}
      <section className="w-full gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Total Earnings */}
          <div className="flex items-center p-6 bg-white rounded-xl shadow">
            <div className="p-3 bg-green-100 rounded-full mr-4">
              💰
            </div>
            <div>
              <p className="text-gray-600 font-medium">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{revenue?.totalRevenue ?? 0}
              </p>
              <p className="text-sm text-gray-500 mt-1">All-time revenue</p>
            </div>
          </div>

          {/* Monthly Earnings */}
          <div className="flex items-center p-6 bg-white rounded-xl shadow">
            <div className="p-3 bg-blue-100 rounded-full mr-4">📅</div>
            <div>
              <p className="text-gray-600 font-medium">Monthly Earnings</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{revenue?.monthlyRevenue?.[0]?.totalRevenue?.toLocaleString() ?? 0}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Transactions Table */}
      <section className="max-w-7xl mx-auto mt-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Recent Transactions
          </h2>
          <ReusableTable
            columns={columns}
            rows={revenueHistory}
            loading={loading}
            onRefresh={() => dispatch(getAllRevenueHistory())}
            searchableColumns={["campaignName", "campaignCode", "businessName","amount"]}
            defaultOrder="desc"
            defaultOrderBy="createdAt"
            isFilter={false} // not using filter in this case
          />
          {error && (
            <p className="text-red-500 mt-4">Error: {error}</p>
          )}
        </div>
      </section>
    </main>
  );
};

export default AdminMyEarnings;