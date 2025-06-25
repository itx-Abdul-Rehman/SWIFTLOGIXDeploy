import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarCustomer from './SidebarCustomer';
import SwiftBot from './SwiftBot';
import OfflineOnline from './OfflineOnline';

const CustomerWallet = () => {
    const navigate = useNavigate();
    const [walletPoints, setwalletPoints] = useState(null)
    const [walletTransactions, setwalletTransactions] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://13.234.75.47:3000/wallet',
                    { credentials: 'include' }
                );
                const result = await response.json();

                if (result.success) {
                    setwalletPoints(result.points);
                    setwalletTransactions(result.transactions);
                    return
                }

                navigate('/login')

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className='flex flex-col min-[1226px]:flex-row'>
            <SidebarCustomer />
            <SwiftBot />
            <OfflineOnline />

            <div className='min-[1226px]:ml-[18vw] w-full'>
                {/* Header */}
                <div className='w-full shadow-xl font-bold text-[#009688] bg-white flex justify-center items-center p-6 sm:p-8'>
                    <div className='text-3xl sm:text-4xl md:text-5xl font-semibold text-center'>My Wallet</div>
                </div>

                {/* Total Points Section */}
                <div className='p-4 sm:p-6 md:p-8'>
                    <h2 className='text-xl sm:text-2xl md:text-3xl font-semibold text-[#009688] mb-4'>
                        Total Points: {walletPoints}
                    </h2>
                </div>

                {/* Points History Section */}
                <div className='p-4 sm:p-6 md:p-8'>
                    <h2 className='text-xl sm:text-2xl md:text-3xl font-semibold text-[#009688] mb-4'>
                        Points History
                    </h2>

                    <div className='bg-white p-4 sm:p-6 rounded-lg shadow-md overflow-x-auto'>
                        <ul>
                            {walletTransactions.map((data, index) => (
                                <li key={index} className='flex flex-col sm:flex-row justify-between py-2 border-b'>
                                    <span className={`text-lg ${data.transactionType === 'Added' ? 'text-[#4BB543]' : 'text-[#FC100D]'}`}>
                                        {data.transactionType === 'Added' ? `+${data.transactionAmount}` : `- ${data.transactionAmount}`} points
                                    </span>
                                    <span className='text-sm text-gray-700 mt-1 sm:mt-0'>
                                        {data.datetime}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default CustomerWallet;
