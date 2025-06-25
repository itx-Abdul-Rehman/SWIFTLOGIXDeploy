import { useLocation } from 'react-router-dom';
import CustomerMap from './CustomerMap';
import Navbar from './Navbar';
import Footer from './Footer';
import SwiftBot from './SwiftBot';
import OfflineOnline from './OfflineOnline';
import { useState } from 'react';


function TrackShipment() {
    const location = useLocation();
    const shipmentDetail = location.state?.shipmentDetail;
    const originCityCoords = location.state?.originCityCoords;
    const destinationCityCoords = location.state?.destinationCityCoords;
    const trackingId = location.state?.trackingId;
    const [lastUpdateago, setLastUpdateAgo] = useState('')
    const [eta, setEta] = useState(null);


    return (
        <div>
            <Navbar />
            <OfflineOnline />
            {/* Main Content */}
            <div className="flex-1 bg-white">
                <div className="w-full bg-white flex flex-col">

                    {/* Header */}
                    <div className="w-full shadow-lg bg-[#009688] text-white flex justify-center items-center p-6 sm:p-8">
                        <h1 className="text-2xl sm:text-4xl md:text-5xl font-semibold text-center">Shipment Tracking</h1>
                    </div>

                    {/* Content Area */}
                    <div className="flex flex-col lg:flex-row justify-center items-center gap-6 px-4 py-6 w-full">

                        {/* Shipment Details Box */}
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

                        {/* Map Component */}
                        <div className="w-full max-w-3xl">
                            <CustomerMap
                                originCityCoords={originCityCoords}
                                destinationCityCoords={destinationCityCoords}
                                trackingId={trackingId}
                                setLastUpdateAgo={setLastUpdateAgo}
                                setEta={setEta}
                            />
                        </div>

                    </div>
                </div>
            </div>


            <SwiftBot />
            <Footer />
        </div >


    );
}

export default TrackShipment;
