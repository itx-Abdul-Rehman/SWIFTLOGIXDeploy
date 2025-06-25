import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaComments } from 'react-icons/fa';
import SidebarCustomer from './SidebarCustomer';
import coins from './icons/coins.png';
import CustomerDashboardCard from './CustomerDashboardCard';
import SwiftBot from './SwiftBot';
import OfflineOnline from './OfflineOnline';


const CustomerDashboard = () => {
    const navigate = useNavigate();
    const [userData, setuserData] = useState(null);
    const [customerSelected, setcustomerSelected] = useState('');
    const [trackingId, setTrackingId] = useState('');
    const [error, setError] = useState(null);
    const [walletPoints, setwalletPoints] = useState(null);
    const [socketId, setSocketId] = useState(null)
    const [placeholder, setPlaceholder] = useState('');
    const indexRef = useRef(0);
    const charIndexRef = useRef(0);
    const isDeletingRef = useRef(false);
    const delayRef = useRef(null);
    const placeholderStrings = ['Live-Track your Shipment', 'Enter Tracking ID'];

     useEffect(() => {
        const type = () => {
            const currentString = placeholderStrings[indexRef.current];
            const isDeleting = isDeletingRef.current;

            if (isDeleting) {
                charIndexRef.current--;
                setPlaceholder(currentString.substring(0, charIndexRef.current));
            } else {
                charIndexRef.current++;
                setPlaceholder(currentString.substring(0, charIndexRef.current));
            }

            if (!isDeleting && charIndexRef.current === currentString.length) {
                isDeletingRef.current = true;
                delayRef.current = setTimeout(type, 1000); 
                return;
            } else if (isDeleting && charIndexRef.current === 0) {
                isDeletingRef.current = false;
                indexRef.current = (indexRef.current + 1) % placeholderStrings.length;
            }

            delayRef.current = setTimeout(type, isDeleting ? 60 : 100);
        };

        type(); 

        return () => clearTimeout(delayRef.current); 
    }, []);

    const handleInput = (e) => {
        setError('');
        setTrackingId(e.target.value);
    };


    const hanldeSubmit = async () => {
        if (!trackingId) {
            setError('Tracking Id is required*');
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/track-shipment", {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ trackingId })
            });

            if (!response.ok) {
                console.log("Error in response");
            }

            const result = await response.json();

            if (result.success) {

                navigate('/customer-trackingshipment', {
                    state: {
                        shipmentDetail: result.shipmentDetail,
                        originCityCoords: result.originCityCoords,
                        destinationCityCoords: result.destinationCityCoords,
                        trackingId: trackingId
                    }
                });
                return;
            }

            setError(result.message);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3000/customer-dashboard', {
                    credentials: 'include'
                });

                const result = await response.json();

                if (result.success) {
                    setuserData(result.userData);
                    setwalletPoints(result.points);
                    return;
                }

                navigate('/login');
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="flex flex-col min-[1226px]:flex-row min-h-screen">
            <OfflineOnline />
            {/* Sidebar */}
            <div className="w-full min-[1226px]:w-[18vw]">
                <SidebarCustomer userData={userData} />
            </div>

            {/* Main Content */}
            <div className={`flex-1 bg-white overflow-y-auto px-4 sm:px-6 lg:px-10`}>
                {customerSelected === '' && (
                    <div className="flex flex-col min-h-screen">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-center py-6">
                            <div className="flex items-center gap-3 shadow-xl rounded-xl px-4 py-2">
                                <h2 className="text-3xl sm:text-4xl text-[#009688] font-bold">Hello,</h2>
                                <p className="text-3xl sm:text-4xl text-gray-700 font-bold">{userData?.name}</p>
                            </div>

                            <div className="mt-4 sm:mt-0">
                                <div className="px-4 py-2 shadow-sm flex gap-2 justify-center items-center border rounded-xl">
                                    <img src={coins} alt="coins" className="w-6 sm:w-8" />
                                    <p className="text-gray-700 font-semibold text-md sm:text-lg">{walletPoints}</p>
                                </div>
                            </div>
                        </div>

                        {/* Track Shipment */}
                        <div className="w-full flex items-center justify-center mb-8">
                            <div className="w-full sm:w-[80%] md:w-[60%] flex flex-col items-center">
                                <div className="w-full flex flex-col sm:flex-row items-stretch">
                                    <input
                                        type="text"
                                        required
                                        onChange={handleInput}
                                        value={trackingId}
                                        placeholder={placeholder}
                                        className="placeholder:text-[#009688] w-full p-4 border-2 border-[#009688] bg-[#F7F7F7] focus:outline-none rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none focus:ring-[#009688] focus:border-[#009688]"
                                    />
                                    <input
                                        type="submit"
                                        value="Track Now"
                                        onClick={hanldeSubmit}
                                        className="bg-[#009688] hover:bg-[#FF7043] text-white font-semibold p-4 cursor-pointer rounded-b-lg sm:rounded-r-lg sm:rounded-bl-none transition-all duration-300 hover:text-[18px]"
                                    />
                                </div>
                                {error && <p className="text-red-500 font-semibold text-md mt-2">{error}</p>}
                            </div>
                        </div>

                        {/* Dashboard Cards */}
                        <CustomerDashboardCard />
                    </div>
                )}

                {/* Chatbot Button */}
                <SwiftBot />

            </div>
        </div>
    );
};

export default CustomerDashboard;
