import { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import Button from "../../components/ui/button/Button";
import ReusableTable from '../../components/table/ReusableTable';
import { ClosedEyeIcon } from '../../icon';
import { Modal } from '../../components/ui/modal/Modal';
import WithdrawEarnings from './WithdrawEarning';

const Wallets = () => {
    const [balanceVisible, setBalanceVisible] = useState(false);
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

    const toggleBalanceVisibility = (e) => {
        e?.stopPropagation();
        setBalanceVisible(!balanceVisible);
    };

    const openWithdrawModal = () => {
        setIsWithdrawModalOpen(true);
    };

    const closeWithdrawModal = () => {
        setIsWithdrawModalOpen(false);
    };

    const columns = [
        {
            id: "campaignName",
            label: "Campaign Name",
        },
        { id: "date", label: "Date" },
        { id: "schedule", label: "Schedule" },
        { id: "amount", label: "Amount" },
    ];

    const rows = [];

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Wallets</h2>
            </div>

            
            <div className="flex rounded- justify-between mb-5 items-center bg-gradient-to-l from-blue-100 via-white to-white border-blue-100/50 p-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-lg font-semibold">Current Balance</h2>
                        <button
                            onClick={toggleBalanceVisibility}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            {balanceVisible ? (
                                <ClosedEyeIcon className="h-7 w-7" />
                            ) : (
                                <EyeIcon className="h-7 w-7" />
                            )}
                        </button>
                    </div>
                    <p className="text-2xl font-bold text-blue-900">
                        {balanceVisible ? '₹ 12,345.67' : '₹ XXXXXX'}
                    </p>
                </div>
                <Button
                    label="Withdraw Earnings"
                    onClick={openWithdrawModal}
                    type="button"
                    loading={false}
                    disabled={false}
                    isIcon={false}
                />
            </div>

            
            <ReusableTable
                columns={columns}
                rows={rows}
            />

            
            <Modal
                isOpen={isWithdrawModalOpen}
                onClose={closeWithdrawModal}
                size="lg"
                containerClassName="bg-white rounded-xl"
            >
               
                    <WithdrawEarnings />
            </Modal>
        </div>
    )
};

export default Wallets;








// import { useState } from 'react';
// import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
// import Button from "../../components/ui/button/Button";
// import { useNavigate } from "react-router-dom";
// import ReusableTable from '../../components/table/ReusableTable';
// import { ClosedEyeIcon } from '../../icon';

// const Wallets = () => {

//     const [balanceVisible, setBalanceVisible] = useState(false);
//     const navigate = useNavigate();

//     const handleWithdraw = () => {
//         navigate('/withdraw-earning');
//     };

//     const toggleBalanceVisibility = () => {
//         setBalanceVisible(!balanceVisible);
//     };

//     const columns = [
//         {
//             id: "campaignName",
//             label: "Campaign Name",

//         },
//         { id: "date", label: "Date" },
//         { id: "schedule", label: "Schedule" },
//         { id: "amount", label: "Amount" },
//     ];

//     const rows = "";
//     return (
//         <div>
//             <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-semibold">Wallets</h2>
//             </div>

//             <div className="flex justify-between mb-5 items-center bg-gradient-to-l from-blue-100 via-white to-white rounded border-blue-100/50 p-4">
//                 <div>
//                     <div className="flex items-center gap-2 mb-1">
//                         <h2 className="text-lg font-semibold">Current Balance</h2>

//                         <button
//                             onClick={toggleBalanceVisibility}
//                             className="text-gray-500 hover:text-gray-700"
//                         >
//                             {balanceVisible ? (
//                                 <ClosedEyeIcon className="h-7 w-7" />
//                             ) : (
//                                 <EyeIcon className="h-7 w-7" />
//                             )}
//                         </button>
//                     </div>
//                     <p className="text-2xl font-bold text-gray-600">
//                         {balanceVisible ? '₹ 12,345.67' : '₹ XXXXXX'}
//                     </p>
//                 </div>
//                 <Button
//                     label="Withdraw Earnings"
//                     onClick={handleWithdraw}
//                     type="button"
//                     loading={false}
//                     disabled={false}
//                     isIcon={false}
//                 />
//             </div>
//             <ReusableTable
//                 columns={columns}
//                 rows={rows}
//             />

//         </div>
//     )
// };

// export default Wallets;
