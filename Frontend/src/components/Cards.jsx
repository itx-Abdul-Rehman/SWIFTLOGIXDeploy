import React, {useState, useEffect} from 'react';
import { NavLink } from 'react-router-dom';
import { FaCalculator, FaPlus, FaPrint } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Cards = ({ rateCalulatorAdrress, scheduleShipAdrress, reprintLabelAddress }) => {
    const [isMd, setIsMd] = useState(false);

       useEffect(() => {
        const checkScreen = () => setIsMd(window.innerWidth >= 768);
        checkScreen();
        window.addEventListener('resize', checkScreen);
        return () => window.removeEventListener('resize', checkScreen);
    }, []);

    return (
        <div>
            <div className='mb-6 mt-[-12px] relative z-50 flex justify-center flex-wrap text-[#F7F7F7] text-sm gap-4'>
                {/* 1st Card - Rate Calculator */}
                <motion.div
                    initial={{ y: 0, opacity: 0, zIndex: 1 }}
                    animate={{ y: 0, x: isMd? -170:0, opacity: 1 }}
                    transition={{ delay: 1, duration: 0.6, ease: 'easeOut' }}
                >
                    <NavLink to={rateCalulatorAdrress}>
                        <div className='md:relative md:left-44 w-[10rem] h-[7.5rem] bg-[#009688] flex flex-col justify-center items-center gap-2 rounded-lg shadow-[0px_4px_6px_0px_#F7F7F7] cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-[0px_6px_12px_0px_#009688]'>
                            <FaCalculator size={24} color="#FF7043" />
                            <span className='font-semibold text-center'>Rate Calculator</span>
                        </div>
                    </NavLink>
                </motion.div>

                {/* 2nd Card - Schedule a Ship */}
                <motion.div
                    initial={{ y: 100, opacity: 0, zIndex: 2 }}
                    animate={{ y: 0,x:0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
                >
                    <NavLink to={scheduleShipAdrress}>
                        <div className='w-[10rem] h-[7.5rem] bg-[#009688] flex flex-col justify-center items-center gap-2 rounded-lg shadow-[0px_4px_6px_0px_#F7F7F7] cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-[0px_6px_12px_0px_#009688]'>
                            <FaPlus size={24} color="#FF7043" />
                            <span className='font-semibold text-center'>Schedule a Ship</span>
                        </div>
                    </NavLink>
                </motion.div>

                {/* 3rd Card - Reprint Shipping Label */}
                <motion.div
                    initial={{ y: 0, opacity: 0, zIndex: 1 }}
                    animate={{ y: 0, x:isMd?170:0, opacity: 1 }}
                    transition={{ delay: 0.9, duration: 0.6, ease: 'easeOut' }}
                >
                    <NavLink to={reprintLabelAddress}>
                        <div className='md:relative md:right-44 w-[10rem] h-[7.5rem] bg-[#009688] flex flex-col justify-center items-center gap-2 rounded-lg shadow-[0px_4px_6px_0px_#F7F7F7] cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-[0px_6px_12px_0px_#009688]'>
                            <FaPrint size={24} color="#FF7043" />
                            <span className='font-semibold text-center'>Reprint Shipping Label</span>
                        </div>
                    </NavLink>
                </motion.div>
            </div>
        </div>
    );
};

export default Cards;
