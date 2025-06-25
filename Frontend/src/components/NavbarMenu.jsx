import React from 'react'
import { FaUser, FaBiking, FaHome, FaSearchLocation } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'

const NavbarMenu = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <div className='w-screen h-screen bg-[#009688] text-white'>
        <div className="w-[50%] ml-2 shadow-2xl rounded-xl p-4 flex flex-col items-center justify-center mb-6">
          <div className='text-[44px] max-[422px]:text-[36px] font-semibold'>SwiftLogix</div>
          <div className='text-[8px] font-semibold'>Revolutionizing Logistics & Delivery</div>
        </div>

        <ul className="cursor-pointer p-2 rounded-lg">
          {[
            { icon: <FaHome size={20} />, label: 'Home', ref: '/' },
            { icon: <FaSearchLocation size={20} />, label: 'Live Track', ref: '/live-track' },
            { icon: <FaBiking size={20} />, label: 'Become a Rider', ref: '/rider-login' },
            { icon: <FaUser size={20} />, label: 'Become a Customer', ref: '/login' },
          ].map((item, index) => (
            <NavLink to={item.ref}>
              <li
                key={index}
                className="font-medium flex items-center gap-2 justify-start hover:bg-[#009688] p-2 rounded-lg hover:text-[#F7F7F7] text-[16px]"
              >
                <span className="text-[#FF7043] w-6 flex justify-center">{item.icon}</span>
                <span>{item.label}</span>
              </li>
            </NavLink>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

export default NavbarMenu
