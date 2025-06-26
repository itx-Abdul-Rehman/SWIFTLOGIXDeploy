import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaComments } from 'react-icons/fa';
import SidebarRider from './SidebarRider';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import RiderTrackShipment from './RiderTrackShipment';
import tick from './icons/tick.svg'
import { io } from 'socket.io-client';
import OfflineOnline from './OfflineOnline';

const socket = io(`${import.meta.env.VITE_API_URL}`, {
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    transports: ["websocket"],
    autoConnect: false,
});


const RiderDashboard = () => {
    const navigate = useNavigate();
    const [currentCity, setCurrentCity] = useState(null)
    const [showDeliveries, setShowDeliveries] = useState(false); // State to toggle the deliveries section
    const [userData, setuserData] = useState(null)
    const [availableDeliveries, setavailableDeliveries] = useState([])
    const [refresh, setrefresh] = useState(false)
    const [isAssigned, setisAssigned] = useState(null)
    const [originCityCoords, setoriginCityCoords] = useState(null)
    const [destinationCityCoords, setdestinationCityCoords] = useState(null)
    const [inTransit, setinTransit] = useState(false)
    const [transitShipments, settransitShipments] = useState([])
    const [inTransitError, setInTransiterror] = useState(false)
    const [processingIndex,setProcessingIndex]=useState(null)

    useEffect(() => {
        socket.connect();
        return () => {
            socket.disconnect();
        };
    }, []);

    //check user rider login or not
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/rider-dashboard`,
                    { credentials: 'include' }
                );
                const result = await response.json();

                if (result.success) {
                    setuserData(result.userData);
                    return
                }

                navigate('/rider-login')
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    //get availabale deliveries
    useEffect(() => {

        const fetchData = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/get-deliveries`,
                    {
                        method: 'POST',
                        credentials: 'include',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ currentCity })
                    },

                );
                const result = await response.json();

                if (result.success) {
                    setavailableDeliveries(result.deliveries);
                    console.log(availableDeliveries)
                    return
                }

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [currentCity, refresh])

    const waitForSecond = () => {
        setTimeout(() => {
            setrefresh(!refresh);
            setisAssigned(null)
        }, 1000);
    }

    const waitForSecondTransit = () => {
        setTimeout(() => {
            setInTransiterror(false)
        }, 2000);
    }

    const handleAccept = async (index) => {
        try {
            if (inTransit) {
                setInTransiterror(true)
                waitForSecondTransit()
                return
            }
            setProcessingIndex(index)
            const response = await fetch(`${import.meta.env.VITE_API_URL}/assigned-delivery`,
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(availableDeliveries[index])
                }
            )
            if (!response.ok) {
                console.log('Error in response')
            }

            const result = await response.json();
            if (result.success) {
                setisAssigned(result.message)
                setProcessingIndex(null)
                waitForSecond();
            } else {
                setisAssigned(result.message)
                setProcessingIndex(null)
                waitForSecond();
            }


        } catch (error) {
            console.error("Error Assigned Delivery:", error);
        }
    }

    useEffect(() => {
        const riderPickedShipments = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/check-pick-shipment`,
                    {
                        credentials: 'include'
                    }
                )

                if (!response.ok) {
                    console.log('Response error');
                }

                const result = await response.json();

                if (result.success) {
                    console.log('run0')
                    const shipments = result.transitShipments;
                    settransitShipments(shipments);
                    setoriginCityCoords(result.originCityCoords);
                    setdestinationCityCoords(result.destinationCityCoords);
                    setinTransit(result.success);
                    
                    return
                }

            } catch (error) {
                console.error("Error Fetching Data about rider picked shipment:", error);
            }
        }

        riderPickedShipments();
    }, [])

    return (
        <div className="flex">
            {/* Left Sidebar */}
            <SidebarRider />

            {/* Right Content */}
            <div className={`flex-1 min-[1226px]:ml-[18vw] h-screen relative bg-white overflow-y-auto`}>
                <OfflineOnline />
                {/* Header Section */}
                <div className="flex-1 h-full bg-white  overflow-y-auto">
                    <div className="w-full h-[20%] flex min-[1025px]:justify-between max-[1025px]:justify-center items-center px-6 mb-6">
                        <div className="flex items-center gap-3 shadow-xl rounded-xl px-4 py-2">
                            <h2 className="text-2xl sm:text-4xl text-[#009688] font-bold">Hello,</h2>
                            <p className="text-2xl sm:text-4xl text-gray-700 font-bold">{userData?.name}</p>
                        </div>
                    </div>

                    {/* Deliveries Toggle Section */}
                    <div
                        className={`absolute max-sm:top-[20%] top-[15%] max-[1025px]:left-0 right-0 mx-auto min-[1025px]:mx-0 min-[1025px]:top-10 min-[1025px]:right-10  w-[80%] md:w-[20vw] flex justify-between items-center text-[#009688] px-4 shadow-md py-2 cursor-pointer ${!showDeliveries ? 'rounded-full' : ''}  transition-all duration-300`}
                        onClick={() => setShowDeliveries(!showDeliveries)}
                    >
                        <span className='text-xl font-semibold'>Deliveries</span>
                        <span className='hover:border'>
                            {showDeliveries ? (
                                <FaAngleUp size={24} color='#FF7043' />
                            ) : (
                                <FaAngleDown size={24} color='#FF7043' />
                            )}
                        </span>
                    </div>

                    {/* Deliveries Section - Only visible when showDeliveries is true */}
                    {showDeliveries && (
                        <div
                            className="absolute max-[1025px]:left-0 right-0 mx-auto min-[1025px]:mx-0 max-sm:top-[25%] top-[20%] min-[1025px]:right-10 min-[1025px]:top-[10%]  md:w-[20vw] bg-white shadow-lg rounded-b-lg p-4 mt-2 z-10 max-h-[70vh] sm:max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
                        >
                            {availableDeliveries.length === 0 && (
                                <span className='flex justify-center text-gray-700'>Sorry! No Deliveries.</span>
                            )}
                            <ul className="space-y-4">
                                {availableDeliveries.map((shipment, index) => (
                                    <li key={index} className="text-gray-700 p-4 border rounded-lg shadow-sm bg-white text-sm sm:text-base">
                                        <div className="flex max-lg:flex-row flex-col min-[1226px]:flex-row justify-between mb-2 gap-1">
                                            <span><strong>From:</strong> {shipment?.originCity}</span>
                                            <span><strong>To:</strong> {shipment?.destinationCity}</span>
                                        </div>
                                        <div className="flex max-lg:flex-row flex-col  min-[1226px]:flex-row justify-between mb-2 gap-1">
                                            <span><strong>Weight:</strong> {shipment?.weight} Kg</span>
                                            <span><strong>Pieces:</strong> {shipment?.pieces}</span>
                                        </div>
                                        <div className="flex max-lg:flex-row flex-col  min-[1226px]:flex-row justify-between mb-2 gap-1">
                                            <span><strong>Date:</strong> {shipment?.deliveryDate}</span>
                                            <span><strong>Price:</strong> {shipment?.totalPrice}</span>
                                        </div>
                                        <div className="flex  flex-col   min-[1226px]:flex-row gap-2">
                                            {/* <button className="w-full sm:w-auto px-4 py-2 bg-[#FF7043] text-white rounded-lg font-semibold transition-all">
                                                Decline
                                            </button> */}
                                            <button
                                                onClick={() => handleAccept(index)}
                                                className="w-full sm:w-auto px-4 py-2 bg-[#009688] text-white rounded-lg font-semibold transition-all"
                                            >
                                                {processingIndex==index?'Processing':'Accept'}
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}


                    {/* Shipment Track */}
                    <div className='ml-[2vw]'>
                        <RiderTrackShipment
                            currentCity={currentCity}
                            setCurrentCity={setCurrentCity}
                            originCityCoords={originCityCoords}
                            destinationCityCoords={destinationCityCoords}
                            inTransit={inTransit}
                            transitShipments={transitShipments}
                        />
                    </div>
                </div>

                {isAssigned && (
                    <div className='w-full flex justify-center items-center fixed inset-0 px-4 sm:px-6 lg:px-8'>
                        <div className='w-full max-w-md sm:max-w-lg p-5 md:max-w-xl lg:max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col items-center  relative transition-all duration-300'>
                            { isAssigned === 'Shipment assigned successfully.' &&
                                <img
                                src={tick}
                                alt="Success"
                                className='w-16 sm:w-20 shadow-2xl rounded-full absolute -top-8'
                               />
                            }
                            <p className='text-gray-700 text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold'>
                                {isAssigned}
                            </p>
                        </div>
                    </div>
                )}

                {inTransitError && (
                    <div className='w-full flex justify-center items-center fixed inset-0 px-4 sm:px-6 lg:px-8'>
                        <div className='w-full max-w-md sm:max-w-lg p-5 md:max-w-xl lg:max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col items-center  relative transition-all duration-300'>
                            {/* <img
                        src={tick}
                        alt="Success"
                        className='w-16 sm:w-20 shadow-2xl rounded-full absolute -top-8'
                      /> */}
                            <p className='text-gray-700 text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold'>
                                You are in Transit. First complete current deliveries then accept new ones.
                            </p>
                        </div>
                    </div>
                )}


            </div>
        </div>
    );
};

export default RiderDashboard;
