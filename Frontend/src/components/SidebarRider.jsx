import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {FaBars, FaTimes, FaHome, FaUser, FaWallet, FaBox, FaBell, FaCog, FaQuestionCircle, FaSignOutAlt } from 'react-icons/fa';
import RiderSetting from './RiderSettings.jsx';
import RiderNotification from './RiderNotifications.jsx';

const SidebarRider = () => {
    const iconsWidth = '24px';
    const [showSettings, setShowSettings] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
     const [isSidebarOpen, setSidebarOpen] = useState(false);

    const activeRoute = (e) => {
        return e.isActive ? "border rounded-lg" : "";
    }

    const handleSettings = () => {
        setShowSettings(true);
    }

    const handleSettingsClose = () => {
        setShowSettings(false);
    }

    const handleNotifications = () => {
        setShowNotifications(true);
    }

    const handleNotificationsClose = () => {
        setShowNotifications(false);
    }

    const handleLogout = async () => {
        try {

            const response = await fetch(`${import.meta.env.VITE_API_URL}/rider-logout`,
                { credentials: 'include' }
            );

            const res = await response.json();
            if (res.success) {
                window.location.replace(res.redirect);
            }
        } catch (error) {

        }
    }

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setSidebarOpen(false);

    return (
        <>
            {/* Hamburger icon for small screens */}
            <div className="min-[1226px]:hidden fixed top-4 left-4 z-50">
                <button onClick={toggleSidebar} className="text-white bg-teal-600 p-2 rounded-lg shadow-lg">
                    {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                </button>
            </div>

             <div className={`fixed  top-0 left-0 h-full z-40 bg-teal-600 text-white p-4 w-[70vw] sm:w-[50vw] min-[1226px]:w-[18vw] transition-transform duration-300 ease-in-out 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} min-[1226px]:translate-x-0 flex flex-col`}>

                {/* Top Section */}
                <div className="w-full max-w-screen-md mx-auto shadow-2xl rounded-xl p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center mb-6">
                    <h1 className="text-2xl sm:text-2xl md:text-2xl  min-[1226px]:text-3xl min-[1486px]:text-[38px] font-bold text-center">
                        SWIFTLOGIX
                    </h1>
                    <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-center mt-2">
                        Rider Portal
                    </h1>
                </div>

                {/* Main Menu */}
                <div className="flex-grow">
                    <ul className='font-semibold shadow-sm flex flex-col gap-4 pl-6 cursor-pointer bg-[#009688] p-2 mt-1 rounded-xl'>
                        <NavLink className={activeRoute} to="/rider-dashboard">
                            <li className='flex gap-2 hover:border transition-all duration-100 p-2 rounded-lg hover:text-[#F7F7F7]'>
                                <FaHome size={iconsWidth} color="#FF7043" />
                                <span>Dashboard</span>
                            </li>
                        </NavLink>
                        <NavLink className={activeRoute} to="/rider-profile">
                            <li className='flex gap-2 hover:border transition-all duration-100 p-2 rounded-lg hover:text-[#F7F7F7]'>
                                <FaUser size={iconsWidth} color="#FF7043" />
                                <span>Profile</span>
                            </li>
                        </NavLink>
                        <NavLink className={activeRoute} to="/rider-wallet">
                            <li className='flex gap-2 hover:border transition-all duration-100 p-2 rounded-lg hover:text-[#F7F7F7]'>
                                <FaWallet size={iconsWidth} color="#FF7043" />
                                <span>Wallet</span>
                            </li>
                        </NavLink>
                        <NavLink className={activeRoute} to="/rider-shipments">
                            <li className='flex gap-2 hover:border transition-all duration-100 p-2 rounded-lg hover:text-[#F7F7F7]'>
                                <FaBox size={iconsWidth} color="#FF7043" />
                                <span>Shipments</span>
                            </li>
                        </NavLink>
                    </ul>
                </div>

                {/* Bottom Section */}
                <div className="mt-auto">
                    <ul className='font-semibold flex flex-col gap-4 pl-6 cursor-pointer bg-[#009688] p-2 mt-1 rounded-lg'>
                        <li onClick={handleSettings} className='flex gap-2 hover:border transition-all duration-100 p-2 rounded-lg hover:text-[#F7F7F7]'>
                            <FaCog size={iconsWidth} color="#FF7043" />
                            <span>Settings</span>
                        </li>

                        {/* <NavLink to="/help">
                        <li className='flex gap-2 hover:border transition-all duration-100 p-2 rounded-lg hover:text-[#F7F7F7]'>
                            <FaQuestionCircle size={iconsWidth} color="#FF7043" />
                            <span>Help</span>
                        </li>
                    </NavLink> */}
                    </ul>

                    <ul onClick={handleLogout} className='font-semibold flex flex-col gap-4 pl-6 cursor-pointer bg-[#009688] p-2 mt-1 rounded-lg'>
                        <li className='flex gap-2 hover:border transition-all duration-100 p-2 rounded-lg hover:text-[#F7F7F7]'>
                            <FaSignOutAlt size={iconsWidth} color="#FF7043" />
                            <span>Log out</span>
                        </li>
                    </ul>
                </div>

                {/* Notification Card */}
                {showNotifications && (
                    <RiderNotification onClose={handleNotificationsClose} />
                )}

                {/* Setting card */}
                {showSettings && (
                    <RiderSetting onClose={handleSettingsClose} />
                )}


            </div>
        </>
    );
}

export default SidebarRider;
