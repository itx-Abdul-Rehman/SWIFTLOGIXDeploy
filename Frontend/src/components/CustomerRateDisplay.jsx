import React from 'react';
import { FaComments } from 'react-icons/fa';
import { useLocation, NavLink } from 'react-router-dom';
import SidebarCustomer from './SidebarCustomer';
import SwiftBot from './SwiftBot';
import OfflineOnline from './OfflineOnline';

const CustomerRateDisplay = () => {
    const location = useLocation();
    const { service, basePrice, weightCharges, distanceCharges, totalPrice, insuranceType } = location.state;

    return (
        <div className="flex flex-col min-[1226px]:flex-row min-h-screen overflow-hidden">
            <SidebarCustomer />
            <SwiftBot />
            <OfflineOnline />

            {/* Main content */}
            <div className="flex-1 min-[1226px]:ml-[18vw] flex flex-col justify-start items-center overflow-y-auto">
                {/* Header */}
                <div className="w-full bg-[#009688] text-white flex justify-center items-center p-6 sm:p-8">
                    <div className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center">Rate Calculator</div>
                </div>

                {/* Price Information */}
                <div className="w-full sm:w-[90%] md:w-[85%] lg:w-[70%] flex flex-col items-center my-8 px-2">
                    <div className="w-full m-4 ">
                        <div className="font-semibold text-2xl sm:text-3xl md:text-4xl">Price Details:</div>
                    </div>

                    {/* Responsive Table */}
                    <div className="w-full overflow-x-auto border-[2px]">
                        {/* Table Header */}
                        <div className="min-w-[600px] font-semibold bg-[#009688] flex text-sm sm:text-base">
                            <div className="w-[16.66%] border-[1px] p-2 text-center">Service</div>
                            <div className="w-[16.66%] border-[1px] p-2 text-center">Base Price</div>
                            <div className="w-[16.66%] border-[1px] p-2 text-center">Weight Charges</div>
                            <div className="w-[16.66%] border-[1px] p-2 text-center">Distance Charges</div>
                            <div className="w-[16.66%] border-[1px] p-2 text-center">Insurance</div>
                            <div className="w-[16.66%] border-[1px] p-2 text-center">Total Price</div>
                        </div>

                        {/* Table Body */}
                        <div className="min-w-[600px] font-semibold flex text-sm sm:text-base">
                            <div className="w-[16.66%] border-[1px] p-2 text-center">{service}</div>
                            <div className="w-[16.66%] border-[1px] p-2 text-center">{basePrice}</div>
                            <div className="w-[16.66%] border-[1px] p-2 text-center">{weightCharges}</div>
                            <div className="w-[16.66%] border-[1px] p-2 text-center">{distanceCharges}</div>
                            <div className="w-[16.66%] border-[1px] p-2 text-center">{insuranceType}</div>
                            <div className="w-[16.66%] border-[1px] p-2 text-center">{totalPrice}</div>
                        </div>
                    </div>

                    {/* Recalculate Button */}
                    <div className="mt-8">
                        <NavLink to="/customer-ratecalculator">
                            <button className="bg-[#009688] text-white font-medium px-6 py-2 rounded-lg hover:bg-[#FF7043] transition duration-300 hover:scale-105">
                                Recalculate Price
                            </button>
                        </NavLink>
                    </div>
                </div>

            </div>
        </div>
    );

};

export default CustomerRateDisplay;
