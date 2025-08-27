import React, { useEffect, useState } from "react";
import { getRevenue } from "../../../api/Admin_API/user-api/user-api";

const AdminMyEarnings  = () => {
  // Enhanced static data
  const [revenue, setRevenue] = useState(null);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const data = await getRevenue(); // ✅ await here
        console.log("Revenue data:", data);
        setRevenue(data);
      } catch (error) {
        console.error("Error fetching revenue:", error);
      }
    };

    fetchRevenue();
  }, []);

  // const earnings = {
  //   total: 12500,
  //   monthly: 3200,
  //   daily: 150,
  //   transactions: 150,
  //   monthlyTarget: 5000,
  //   pendingWithdrawal: 850,
  //   nextPayout: "2023-06-05"
  // }

  // Additional static data
  const recentTransactions = [
    {
      id: 1,
      date: "2023-05-28",
      service: "Premium Consultation",
      amount: 120,
      status: "Completed",
    },
    {
      id: 2,
      date: "2023-05-27",
      service: "Standard Package",
      amount: 85,
      status: "Completed",
    },
    {
      id: 3,
      date: "2023-05-26",
      service: "Extended Support",
      amount: 200,
      status: "Completed",
    },
    {
      id: 4,
      date: "2023-05-25",
      service: "Basic Package",
      amount: 50,
      status: "Refunded",
    },
    {
      id: 5,
      date: "2023-05-24",
      service: "Premium Consultation",
      amount: 120,
      status: "Completed",
    },
  ];

  const weeklyEarnings = [120, 180, 150, 210, 190, 230, 200];

  // Calculate max for chart scaling
  const maxEarning = Math.max(...weeklyEarnings);

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <header className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
          Revenue
        </h1>
        <p className="mt-2 text-gray-600">
          Overview of your earnings and transactions
        </p>
      </header>

      <section className="w-full gap-6">
        {/* Left Column: Summary Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Total Earnings */}
          <div className="flex items-center p-6 bg-white rounded-xl shadow">
            <div className="p-3 bg-green-100 rounded-full mr-4">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8c-1.657 0-3 1.567-3 3.5S10.343 15 12 15s3-1.567 3-3.5S13.657 8 12 8z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 19v2m0-12V5"
                />
              </svg>
            </div>
            <div>
              <p className="text-gray-600 font-medium">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{revenue?.totalRevenue}
              </p>
              <p className="text-sm text-gray-500 mt-1">All-time revenue</p>
            </div>
          </div>

          {/* Monthly Earnings */}
          <div className="flex items-center p-6 bg-white rounded-xl shadow">
            <div className="p-3 bg-blue-100 rounded-full mr-4">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4l3 3"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <div>
              <p className="text-gray-600 font-medium">Monthly Earnings</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{revenue?.monthlyRevenue[0]?.totalRevenue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Second Row: Charts and Tables */}
      <section className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Weekly Earnings Chart */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">
              Weekly Earnings Trend
            </h2>
            <div className="text-sm text-gray-500">Last 7 days</div>
          </div>
          <div className="h-64 flex items-end justify-between pt-4">
            {weeklyEarnings.map((earning, index) => (
              <div key={index} className="flex flex-col items-center w-10">
                <div
                  className="w-8 bg-blue-500 rounded-t hover:bg-blue-600 transition duration-200"
                  style={{ height: `${(earning / maxEarning) * 100}%` }}
                  title={`₹${earning}`}
                ></div>
                <div className="text-xs text-gray-500 mt-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][index]}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center text-sm text-gray-500">
            Hover over bars to see exact amounts
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">
              Recent Transactions
            </h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {transaction.date}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {transaction.service}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      ₹{transaction.amount}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          transaction.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AdminMyEarnings ;
