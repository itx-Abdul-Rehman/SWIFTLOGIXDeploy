import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaShip, FaCalculator, FaPlus, FaPrint } from 'react-icons/fa';
import { motion } from 'framer-motion';

const CustomerDashboardCard = () => {
    const [isMd, setIsMd] = useState(false);

    useEffect(() => {
        const checkScreen = () => setIsMd(window.innerWidth >= 768);
        checkScreen();
        window.addEventListener('resize', checkScreen);
        return () => window.removeEventListener('resize', checkScreen);
    }, []);



    return (
        <div className='my-6 px-4 w-full'>
            <div className='flex flex-wrap justify-center gap-6 text-[#F7F7F7] relative'>

                <motion.div
                     initial={{ y: 0, opacity: 0, zIndex: 1 }}
                    animate={{ y: 0, x: isMd? -170:0, opacity: 1 }}
                    transition={{ delay: 1, duration: 0.6, ease: 'easeOut' }}
                >
                    <NavLink to='/customer-ratecalculator'>
                        <div className='md:relative md:left-44 w-[9rem] sm:w-[10rem] h-[7rem] sm:h-[7.5rem] bg-[#009688] flex flex-col justify-center items-center gap-2 rounded-lg shadow-md cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg'>
                            <FaCalculator size={24} color="#FF7043" />
                            <span className='font-semibold text-center text-sm'>Rate Calculator</span>
                        </div>
                    </NavLink>
                </motion.div>

                <motion.div
                    initial={{ y: 100, opacity: 0, zIndex: 2 }}
                    animate={{ y: 0,x:0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
                >
                    <NavLink to='/customer-scheduleship'>
                        <div className='w-[9rem] sm:w-[10rem] h-[7rem] sm:h-[7.5rem] bg-[#009688] flex flex-col justify-center items-center gap-2 rounded-lg shadow-md cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg'>
                            <FaPlus size={24} color="#FF7043" />
                            <span className='font-semibold text-center text-sm'>Schedule a Ship</span>
                        </div>
                    </NavLink>
                </motion.div>

                <motion.div
                   initial={{ y: 0, opacity: 0, zIndex: 1 }}
                    animate={{ y: 0, x:isMd?170:0, opacity: 1 }}
                    transition={{ delay: 0.9, duration: 0.6, ease: 'easeOut' }}
                >
                    <NavLink to='/customer-reprintlabel'>
                        <div className='md:relative md:right-44 w-[9rem] sm:w-[10rem] h-[7rem] sm:h-[7.5rem] bg-[#009688] flex flex-col justify-center items-center gap-2 rounded-lg shadow-md cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg'>
                            <FaPrint size={24} color="#FF7043" />
                            <span className='font-semibold text-center text-sm'>Reprint Shipping Label</span>
                        </div>
                    </NavLink>
                </motion.div>

            </div>
        </div>
    );
};

export default CustomerDashboardCard;
