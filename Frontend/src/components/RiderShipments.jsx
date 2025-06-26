import React, { useState, useEffect } from 'react';
import { FaComments, FaFilter } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import RiderShipmentCard from './RiderShipmentCard.jsx';
import SidebarRider from './SidebarRider.jsx';
import tick from './icons/tick.svg'
import OfflineOnline from './OfflineOnline.jsx';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const RiderShipments = () => {
    const navigate = useNavigate();
    const [selectedShipment, setSelectedShipment] = useState(null);
    const [selectedCard, setSelectedCard] = useState(null);
    const [allShipments, setallShipments] = useState([]);
    const [pendingShipmentsCount, setpendingShipmentsCount] = useState(null);
    const [completedShipmentsCount, setcompletedShipmentsCount] = useState(null);
    const [acceptedShipmentsCount, setscheduledShipmentsCount] = useState(null);
    const [refresh, setrefresh] = useState(false)
    const [isPicked, setisPicked] = useState(null)



    const waitForSecond = () => {
        setTimeout(() => {
            setrefresh(!refresh);
            setisPicked(null)
        }, 1000);
    }


    //here get selected shipments like pending,completed or scheduled from servers/database
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/get-rider-shipments`,
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ selectedCard })
                }
            )
            if (!response.ok) {
                console.log('response error');
            }

            const result = await response.json();
            if (result.success) {
                return setallShipments(result.shipments);
            }

        }
        fetchData()
    }, [selectedCard, refresh])

    //here count shipments completed
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/get-rider-shipments`,
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ selectedCard: 'completed' })
                }
            )
            if (!response.ok) {
                console.log('response error');
            }

            const result = await response.json();
            setcompletedShipmentsCount(result.shipments.length);

        }

        fetchData()
    }, [])

    //here count shipments accepted
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/get-rider-shipments`,
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ selectedCard: 'accepted' })
                }
            )
            if (!response.ok) {
                console.log('response error');
            }

            const result = await response.json();
            setscheduledShipmentsCount(result.shipments.length);

        }

        fetchData()
    }, [])

    //here count shipments pending
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/get-rider-shipments`,
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ selectedCard: 'pending' })
                }
            )
            if (!response.ok) {
                console.log('response error');
            }

            const result = await response.json();
            setpendingShipmentsCount(result.shipments.length);

        }

        fetchData()
    }, [])


    //only one time run when click on shipment and set default accepted shipments shows
    useEffect(() => {
        setSelectedCard('accepted')
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/rider-shipments`,
                    { credentials: 'include' }
                );
                const result = await response.json();
                if (result.success) {
                    return
                }

                navigate('/rider-login')

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const handleCardClick = (card) => {
        setSelectedCard(card);
        // Toggle the background color based on the clicked card
        if (card === 'scheduled') {
            document.documentElement.classList.add('bg-[#009688]');
            document.documentElement.classList.remove('bg-white');
        } else {
            document.documentElement.classList.remove('bg-[#009688]');
            document.documentElement.classList.add('bg-white');[selectedShipment]
        }
    }

    const handleCancel = async (index) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/rider-cancel-shipment`,
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(allShipments[index])
                }
            )

            if (!response.ok) {
                console.log('Response error')
            }

            const result = await response.json()
            if (result.success) {
                 toast.success(result.message)    
            }else{
                toast.error(result.message)
            }

        } catch (error) {
          toast.error('Failed to cancel shipment')
        }
    }

   

    return (
        <div className="flex flex-col min-[1226px]:flex-row">
            {/* Left Sidebar */}
            <SidebarRider />

            {/* Right Content Area */}
            <div className="flex-1 min-[1226px]:ml-[18vw] min-h-screen bg-white overflow-y-auto relative">
                <OfflineOnline />
                {/* Header */}
                <div className='w-full shadow-xl font-bold text-[#009688] bg-white flex justify-center items-center p-4 sm:p-6 md:p-8'>
                    <div className='text-3xl sm:text-4xl md:text-5xl font-semibold'>Shipments</div>
                </div>

                {/* Dashboard Cards */}
                <div>
                    <div className='flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 p-4 sm:p-6 md:p-8'>
                        <DashboardCard
                            title="Completed Shipments"
                            value={completedShipmentsCount}
                            onClick={() => handleCardClick('completed')}
                            isSelected={selectedCard === 'completed'}
                        />
                        <DashboardCard
                            title="Accepted Shipments"
                            value={acceptedShipmentsCount}
                            onClick={() => handleCardClick('accepted')}
                            isSelected={selectedCard === 'accepted'}
                        />
                        <DashboardCard
                            title="Pending Shipments"
                            value={pendingShipmentsCount}
                            onClick={() => handleCardClick('pending')}
                            isSelected={selectedCard === 'pending'}
                        />
                    </div>

                    {/* Filter Button */}
                    {/* <div className='px-4 sm:px-6 md:px-8 pb-4 flex gap-4'>
                        <div>
                            <div className="inline-flex items-center gap-2 cursor-pointer py-2 px-4 font-semibold rounded-full border border-gray-300">
                                <FaFilter size={20} color='#FF7043' />
                                <p className='text-sm sm:text-base'>Filter</p>
                            </div>
                        </div>
                    </div> */}
                </div>

                {/* No Shipments Message */}
                {allShipments.length === 0 && (
                    <div className='flex justify-center items-center text-lg sm:text-xl text-gray-500 p-4'>
                        No {selectedCard} shipments
                    </div>
                )}

                {/* Shipments List */}
                <div className="flex flex-wrap gap-4 px-4 sm:px-6 md:px-8 pb-16">
                    {allShipments.map((shipment, index) => (
                        <RiderShipmentCard
                            key={index}
                            trackingNumber={shipment.trackingid}
                            originCity={shipment.originCity}
                            destinationCity={shipment.destinationCity}
                            weight={shipment.weight}
                            pieces={shipment.pieces}
                            deliveryDate={shipment.deliveryDate}
                            price={shipment.price}
                            onCancel={() => handleCancel(index)}
                            selectedCard={selectedCard}
                        />
                    ))}
                </div>

                {/* Success Popup */}
                {isPicked && (
                    <div className='w-full flex justify-center absolute top-[50%] right-0 px-4'>
                        <div className='w-full sm:w-[80%] md:w-[50%] lg:w-[30%] rounded-3xl shadow-2xl flex justify-center items-center flex-col p-6 sm:p-8 relative bg-white transition-all duration-300'>
                            <img src={tick} alt="Success" className='w-16 sm:w-20 shadow-2xl rounded-full absolute -top-10' />
                            <p className='mt-16 text-gray-700 text-2xl sm:text-3xl md:text-[44px] font-semibold text-center'>{isPicked}!</p>
                        </div>
                    </div>
                )}

               
            </div>
        </div>
    );

}


// Dashboard card component
function DashboardCard({ title, value, onClick, isSelected }) {
    return (
        <div
            onClick={onClick}
            className={`cursor-pointer p-6 hover:bg-[#009688] rounded-lg shadow-md ${isSelected ? 'bg-[#009688] text-white' : 'bg-white'} text-gray-700 hover:text-white`}
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{title}</h3>
            </div>
            <p className="text-3xl font-bold">{value}</p>
        </div>
    );
}

export default RiderShipments;
