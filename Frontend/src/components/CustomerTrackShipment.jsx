import React, { useState, useEffect } from 'react';
import { FaComments, FaSadCry } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import SidebarCustomer from './SidebarCustomer'
import CustomerMap from './CustomerMap';
import SwiftBot from './SwiftBot';
import OfflineOnline from './OfflineOnline';


function CustomerTrackShipment() {
    const location = useLocation();
    const shipmentDetail = location.state?.shipmentDetail;
    const originCityCoords = location.state?.originCityCoords;
    const destinationCityCoords = location.state?.destinationCityCoords;
    const trackingId = location.state?.trackingId;
    const [isRiderDisconnect, setisRiderDisconnect] = useState(false)
    const [lastUpdateago, setLastUpdateAgo] = useState('')
    const [eta, setEta] = useState(null);

    return (
        <div className='flex'>
            {/* Left Sidebar */}
            <SidebarCustomer />
            <SwiftBot />
            <OfflineOnline />

            {/* Right Content */}
            <div className={`flex-1 min-[1226px]:ml-[18vw] w-[100vw]  h-screen bg-white overflow-y-auto`}>
                <div className="w-full bg-white flex flex-col">
                    <div className='w-full shadow-lg bg-[#009688] text-white flex justify-center items-center p-8'>
                        <div className='text-5xl max-sm:text-2xl font-semibold'>Shipment Tracking</div>
                    </div>
            
                    <div className='sm:flex justify-center items-center gap-4 px-4 py-6 '>
                        {/* Shipment Track detials */}
                        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-5">
                            <div className="w-full border shadow-sm rounded-full py-2 px-4 mb-4 flex justify-center items-center">
                                <h2 className="text-lg sm:text-xl font-semibold">Shipment Details</h2>
                            </div>
                            <div className="flex flex-col gap-3 text-sm sm:text-base text-gray-700">
                                <p><strong>Tracking ID:</strong> {shipmentDetail?.trackingid}</p>
                                <p><strong>From:</strong> {shipmentDetail?.originCity}</p>
                                <p><strong>To:</strong> {shipmentDetail?.destinationCity}</p>
                                <p><strong>Status:</strong> {shipmentDetail?.shipmentStatus}</p>
                                <p><strong>Last Updated:</strong> {lastUpdateago}</p>
                                <p><strong>Estimated Arrival:</strong> {eta !== null ? `${eta} minutes` : 'Calculating ETA...'}</p>
                            </div>
                        </div>

                        {/* Real time Map */}
                        <div className='w-full'>
                            <CustomerMap
                                originCityCoords={originCityCoords}
                                destinationCityCoords={destinationCityCoords}
                                trackingId={trackingId}
                                setLastUpdateAgo={setLastUpdateAgo}
                                setEta={setEta}
                            />
                        </div>
                    </div>

                    {isRiderDisconnect && (
                        <div className='w-full flex justify-center absolute top-[50%] right-[0%]'>
                            <div className='w-[30%]  rounded-3xl shadow-2xl flex justify-center items-center flex-col p-5 relative bg-white transition-all duration-300'>
                                <p className=' text-gray-700 text-[44px] font-semibold text-center'>Rider Disconected. Try later!</p>
                            </div>
                        </div>
                    )}


                </div>
            </div>
        </div>


    );
}

export default CustomerTrackShipment;
