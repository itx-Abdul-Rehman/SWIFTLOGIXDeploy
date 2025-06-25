import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar'
import AdminDashboardCard from './AdminDashboardCard';
import OfflineOnline from './OfflineOnline';

const CustomerDashboard = () => {
    const navigate = useNavigate();
    const [userData, setuserData] = useState(null);
    const [customerSelected, setcustomerSelected] = useState('');
    const [trackingId, setTrackingId] = useState('');
    const [error, setError] = useState(null);


    const handleInput = (e) => {
        setError('');
        setTrackingId(e.target.value);
    };
  
    useEffect(() => {
        const fetchData = async () => {
            try {

                const token = localStorage.getItem('token');

                const response = await fetch('http://13.203.194.4:3000/admin', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if(!response.ok){
                  console.log('Response error')
                }
                const result = await response.json();
                if(!result.success){
                   navigate('/admin-login')
                }
               
                setuserData(result.userData);
            } catch (err) {
                
            }
        }

        fetchData()
    }, [])


    const hanldeSubmit = async () => {
        if (!trackingId) {
            setError('Tracking Id is required*');
            return;
        }

        try {
            const response = await fetch("http://13.203.194.4:3000/track-shipment", {
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
                navigate('/admin-trackingshipment', {
                    state: {
                        shipmentDetail: result.shipmentDetail,
                        originCityCoords: result.originCityCoords,
                        destinationCityCoords: result.destinationCityCoords,
                        trackingId:trackingId
                    }
                });
                return;
            }

            setError(result.message);
        } catch (error) {
            console.error("Error:", error);
        }
    };


    return (
        <div className="flex flex-col min-[1226px]:flex-row min-h-screen">
             <OfflineOnline />
            {/* Sidebar */}
            <div className="w-full min-[1226px]:w-[18vw]">
                <AdminSidebar userData={userData} />
            </div>

            {/* Main Content */}
            <div className={`flex-1 bg-white overflow-y-auto px-4 sm:px-6 lg:px-10`}>
                {customerSelected === '' && (
                    <div className="flex flex-col min-h-screen">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-center py-6">
                            <div className="flex items-center gap-3 shadow-xl rounded-xl px-4 py-2">
                                <h2 className="text-3xl sm:text-4xl text-[#009688] font-bold">Hello,</h2>
                                <p className="text-3xl sm:text-4xl text-gray-700 font-bold">{userData?.city}</p>
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
                                        placeholder="Live-Track your Shipment"
                                        className="placeholder:text-[#2632386d] w-full p-4 border-2 border-[#009688] bg-[#F7F7F7] focus:outline-none rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none focus:ring-[#009688] focus:border-[#009688]"
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
                        <AdminDashboardCard />
                    </div>
                )}
             
            

            </div>
        </div>
    );
};

export default CustomerDashboard;
