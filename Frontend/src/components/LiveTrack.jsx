import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar'
import Footer from './Footer'
import SwiftBot from './SwiftBot';
import OfflineOnline from './OfflineOnline';
import FadeInSection from './FadeInSection';



const LiveTrack = () => {
    const navigate = useNavigate();
    const [trackingId, setTrackingId] = useState('');
    const [error, setError] = useState(null);
    const [isResponse, setIsResponse] = useState('idle')

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
            setIsResponse('processing')
            const response = await fetch(`${import.meta.env.VITE_API_URL}/track-shipment`, {
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
                setIsResponse('success')
                navigate('/track-shipment', {
                    state: {
                        shipmentDetail: result.shipmentDetail,
                        originCityCoords: result.originCityCoords,
                        destinationCityCoords: result.destinationCityCoords,
                        trackingId: trackingId
                    }
                });
                return;
            }
            setIsResponse('idle')
            setError(result.message);
        } catch (error) {
            console.error("Error:", error);
        }
    };


    return (
        <div>
            <Navbar />
            <FadeInSection delay={0.2}>
                <div className="w-full bg-[#009688] text-white flex justify-center items-center p-6 sm:p-8">
                    <div className="text-3xl sm:text-4xl md:text-5xl font-semibold text-center">
                        Live Track Shipment
                    </div>
                </div>

                <div className="w-full min-h-[40vh] flex justify-center items-center px-4">
                    <div className="w-full flex justify-center">
                        <div className="w-full sm:w-[80%] md:w-[60%] lg:w-[50%] flex flex-col items-center">
                            <div className="w-full flex flex-col sm:flex-row items-center sm:justify-between gap-2">
                                <input
                                    type="text"
                                    required
                                    onChange={handleInput}
                                    value={trackingId}
                                    disabled={isResponse === 'processing'}
                                    placeholder="Live-Track your Shipment"
                                    className="placeholder:text-[#2632386d] w-full p-3 sm:p-[15px] rounded-lg sm:rounded-l-lg border-2 border-[#009688] bg-[#F7F7F7] focus:outline-none focus:ring-[#009688] focus:border-[#009688]"
                                />
                                <input
                                    type="submit"
                                    value={isResponse === 'processing' ? 'Processing...' : isResponse === 'success' ? 'Tracked' : 'Track Now'}
                                    onClick={hanldeSubmit}
                                    className="bg-[#009688] hover:bg-[#FF7043] min-[550px]:relative right-6 cursor-pointer  w-auto p-3 sm:p-[17px] rounded-lg sm:rounded-l-none text-[#F7F7F7] font-semibold transition-all ease-in-out duration-300 hover:text-[18px]"
                                />
                            </div>
                            <div>
                                {error && (
                                    <p className="text-red-500 font-semibold text-md mt-2">{error}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </FadeInSection>

            <SwiftBot />
            <OfflineOnline />
            <Footer />

        </div>
    )
}

export default LiveTrack
