import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaShip, FaCalculator, FaPlus, FaPrint } from 'react-icons/fa';

const CustomerDashboardCard = () => {

    return (
        <div className='my-6 px-4 w-full'>
            <div className='flex flex-wrap justify-center gap-6 text-[#F7F7F7]'>
                
                {/* Rate Calculator */}
                <NavLink to='/admin-ratecalculator'>
                    <div className='w-[9rem] sm:w-[10rem] h-[7rem] sm:h-[7.5rem] bg-[#009688] flex flex-col justify-center items-center gap-2 rounded-lg shadow-md cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg'>
                        <FaCalculator size={24} color="#FF7043" />
                        <span className='font-semibold text-center text-sm'>Rate Calculator</span>
                    </div>
                </NavLink>

                {/* Schedule a Ship */}
                <NavLink to='/admin-scheduleship'>
                    <div className='w-[9rem] sm:w-[10rem] h-[7rem] sm:h-[7.5rem] bg-[#009688] flex flex-col justify-center items-center gap-2 rounded-lg shadow-md cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg'>
                        <FaPlus size={24} color="#FF7043" />
                        <span className='font-semibold text-center text-sm'>Schedule a Ship</span>
                    </div>
                </NavLink>

                {/* Reprint Shipping Label */}
                <NavLink to='/admin-reprintlabel'>
                    <div className='w-[9rem] sm:w-[10rem] h-[7rem] sm:h-[7.5rem] bg-[#009688] flex flex-col justify-center items-center gap-2 rounded-lg shadow-md cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg'>
                        <FaPrint size={24} color="#FF7043" />
                        <span className='font-semibold text-center text-sm'>Reprint Shipping Label</span>
                    </div>
                </NavLink>
            </div>
        </div>
    );
};

export default CustomerDashboardCard;
