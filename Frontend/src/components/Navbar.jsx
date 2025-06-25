import { useState } from 'react';
import { FaTimes, FaBars, FaBiking, FaHome, FaSearchLocation } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logo from './logo/SWIFTLOGIX Logo 2.png';
import NavbarMenu from './NavbarMenu';

function Navbar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div>
            {/* Mobile Hamburger */}
            <div className="min-[550px]:hidden fixed top-4 right-4 z-50">
                <button onClick={toggleSidebar} className="text-white bg-teal-600 p-2 rounded-lg shadow-lg">
                    {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                </button>
            </div>

            {/* Desktop Nav */}
            <AnimatePresence>
                {!isSidebarOpen && (
                    <motion.nav
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -50, opacity: 0 }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                        className="bg-white w-full text-[#263238]"
                    >
                        <div className="flex sm:justify-around items-center flex-wrap w-full px-4 py-2">
                            {/* Logo */}
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.5, ease: 'easeInOut' }}
                                className="flex flex-col items-center"
                            >
                                <img src={logo} alt="SwiftLogix Logo" className="w-[63px] object-contain" />
                            </motion.div>

                            {/* Desktop Nav Links */}
                            <motion.ul
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    visible: {
                                        transition: {
                                            staggerChildren: 0.15,
                                        },
                                    },
                                }}
                                className="hidden md:flex  gap-6 bg-[#F7F7F7] p-2 rounded-lg"
                            >
                                {[{
                                    to: "/", icon: <FaHome size={20} color="#FF7043" />, label: "Home"
                                }, {
                                    to: "/live-track", icon: <FaSearchLocation size={20} color="#FF7043" />, label: "Live Track"
                                }, {
                                    to: "/rider-login", icon: <FaBiking size={20} color="#FF7043" />, label: "Become a Rider"
                                }].map((item, i) => (
                                    <motion.li
                                        key={i}
                                        variants={{
                                            hidden: { opacity: 0, y: -10 },
                                            visible: { opacity: 1, y: 0 },
                                        }}
                                        whileHover={{ scale: 1.1 }}
                                    >
                                        <NavLink to={item.to} className={({ isActive }) =>
                                            `flex items-center gap-1 p-2 rounded-lg hover:bg-[#009688] hover:text-[#F7F7F7] transition-colors duration-300 ${isActive ? "bg-[#009688] text-white" : ""
                                            }`
                                        }>
                                            {item.icon}<span>{item.label}</span>
                                        </NavLink>
                                    </motion.li>
                                ))}
                            </motion.ul>

                            {/* Become a Customer Button */}
                            <motion.div
                                className="hidden sm:flex"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                <NavLink to="/login">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="bg-[#009688] px-4 py-2 rounded-lg text-white font-semibold hover:bg-[#FF7043] transition-all duration-300"
                                    >
                                        Become a Customer
                                    </motion.button>
                                </NavLink>
                            </motion.div>
                        </div>
                    </motion.nav>
                )}
            </AnimatePresence>

            {/* Sidebar Nav */}
            {isSidebarOpen && (
                <NavbarMenu />
            )}
        </div>
    );
}

export default Navbar;
