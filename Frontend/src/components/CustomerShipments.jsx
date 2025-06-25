import React, { useState, useEffect } from 'react';
import { FaComments, FaFilter } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import SidebarCustomer from './SidebarCustomer.jsx';
import ShipmentCard from './ShipmentCard.jsx';
import CustomerShipmentDetails from './CustomerShipmentDetails.jsx';
import SwiftBot from './SwiftBot.jsx';
import OfflineOnline from './OfflineOnline.jsx';

const CustomerShipments = () => {
    const navigate = useNavigate();
    const [selectedShipment, setSelectedShipment] = useState(null);
    const [selectedCard, setSelectedCard] = useState(null);
    const [allShipments, setallShipments] = useState([]);
    const [pendingShipmentsCount, setpendingShipmentsCount] = useState(null);
    const [completedShipmentsCount, setcompletedShipmentsCount] = useState(null);
    const [scheduledShipmentsCount, setscheduledShipmentsCount] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState(null);


    //here get selected shipments like pending,completed or scheduled from servers/database
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('http://13.234.75.47:3000/get-shipments',
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
            const shipments = result.shipments;

            if (shipments.length > 0) {
                // Map over all shipments and store them
                const formattedShipments = shipments.map(shipment => ({
                    packagePrice: {
                        service: shipment.shipmentType,
                        basePrice: shipment.basePrice,
                        weightCharges: shipment.weightCharges,
                        distanceCharges: shipment.distanceCharges,
                        totalPrice: shipment.totalPrice,
                        insurance: shipment.insurance
                    },
                    senderFormData: {
                        sendername: shipment.sendername,
                        sendercontact: shipment.sendercontact,
                        senderemail: shipment.senderemail,
                        sendercnic: shipment.sendercnic
                    },
                    receiverFormData: {
                        receivername: shipment.receivername,
                        receivercontact: shipment.receivercontact,
                        receiveremail: shipment.receiveremail,
                        receivercnic: shipment.receivercnic,
                        receiverarea: shipment.receiverarea,
                        receiverhouseno: shipment.receiverhouseno,
                        receiveraddress: shipment.receiveraddress
                    },
                    packageFormData: {
                        originCity: shipment.originCity,
                        destinationCity: shipment.destinationCity,
                        weight: shipment.weight,
                        pieces: shipment.pieces,
                        pickupdate: shipment.pickupdate || '',
                        pickuptime: shipment.pickuptime || '',
                        insurance: shipment.insurance,
                        pickupaddress: shipment.pickupaddress || '',
                        shipmentType: shipment.shipmentType,
                        deliveryMethod: shipment.deliveryMethod,
                        sensitivePackage: shipment.sensitivePackage,
                        packageDescription: shipment.packageDescription
                    },
                    paymentMethod: {
                        paymentMethod: shipment.paymentMethod,
                    },
                    scheduleTime: {
                        scheduleTime: shipment.datetime,
                    },
                    trackingId: {
                        trackingId: shipment.trackingid
                    }

                }));
                setallShipments(formattedShipments);
            } else {
                setallShipments([]);
            }

        }
        fetchData()
    }, [selectedCard])

    //here count shipments completed
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('http://13.234.75.47:3000/get-shipments',
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

    //here count shipments scheduled
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('http://13.234.75.47:3000/get-shipments',
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ selectedCard: 'scheduled' })
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
            const response = await fetch('http://13.234.75.47:3000/get-shipments',
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


    //only one time run when click on shipment and set default scheduled shipments shows
    useEffect(() => {
        setSelectedCard('scheduled')
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://13.234.75.47:3000/customer-shipments',
                    { credentials: 'include' }
                );
                const result = await response.json();
                if (result.success) {
                    return
                }

                navigate('/login')

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
            document.documentElement.classList.add('bg-white');
        }
    }

    const toggleDropdownFilter = () => {
        setIsOpen(prev => !prev);
    };

    const handleSelect = (option) => {
        setSelectedFilter(option);
        setIsOpen(false);

        let sortedShipments = [...allShipments];

        if (option === 'Newest') {
            sortedShipments.reverse();
        } else if (option === 'Oldest') {
            sortedShipments.reverse();
        }

        setallShipments(sortedShipments);
    };

    return (
        <div className="flex">
            {/* Left Sidebar */}
            <SidebarCustomer />
            <SwiftBot />

            {/* Right Content Area */}
            <div className="flex-1 w-full min-[1226px]:ml-[18vw] h-screen bg-white overflow-y-auto relative">
                <OfflineOnline />
                {/* Header */}
                <div className='w-full shadow-xl font-bold text-[#009688] bg-white flex justify-center items-center p-8'>
                    <div className='text-5xl font-semibold'>Shipments</div>
                </div>

                {/* Dashboard Cards */}
                <div>
                    <div className='flex gap-6 p-8'>
                        <DashboardCard
                            title="Completed Shipments"
                            value={completedShipmentsCount}
                            onClick={() => handleCardClick('completed')}
                            isSelected={selectedCard === 'completed'}
                        />
                        <DashboardCard
                            title="Scheduled Shipments"
                            value={scheduledShipmentsCount}
                            onClick={() => handleCardClick('scheduled')}
                            isSelected={selectedCard === 'scheduled'}
                        />
                        <DashboardCard
                            title="Pending Shipments"
                            value={pendingShipmentsCount}
                            onClick={() => handleCardClick('pending')}
                            isSelected={selectedCard === 'pending'}
                        />
                    </div>

                    {/* Filter button */}
                    <div className="px-4 sm:px-6 md:px-8 pb-4 flex gap-4 relative">
                        <div className="relative">
                            {/* Filter Button */}
                            <div
                                className="inline-flex items-center gap-1 cursor-pointer py-2 px-3 font-semibold rounded-full border"
                                onClick={toggleDropdownFilter}
                            >
                                <FaFilter size={24} color={isOpen ? '#009688' : '#FF7043'} />
                                <p>Filter</p>
                            </div>

                            {/* Dropdown Menu */}
                            {isOpen && (
                                <div className="absolute top-full left-0 mt-2 w-[40vw] sm:w-[30vw] md:w-[20vw] lg:w-[14vw] min-w-[150px] max-w-[200px] flex flex-col items-center shadow-lg rounded-lg p-2 border bg-white z-10">
                                    <div
                                        onClick={() => handleSelect('Newest')}
                                        className="cursor-pointer hover:bg-[#009688] hover:text-white w-full text-center py-1"
                                    >
                                        Newest
                                    </div>
                                    <div className="my-2 w-[80%] border border-gray-300"></div>
                                    <div
                                        onClick={() => handleSelect('Oldest')}
                                        className="cursor-pointer hover:bg-[#009688] hover:text-white w-full text-center py-1"
                                    >
                                        Oldest
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>



                </div>

                {
                    allShipments.length == 0 &&
                    <div className='flex justify-center items-center'>no {selectedCard} shipments</div>
                }

                {/* Shipments List */}
                <div className="flex flex-wrap gap-4 max-sm:px-4 sm:pl-8">
                    {allShipments.map((data, index) => (
                        <ShipmentCard
                            key={index}
                            trackingNumber={data.trackingId.trackingId}
                            originCity={data.packageFormData.originCity}
                            destinationCity={data.packageFormData.destinationCity}
                            receiverName={data.receiverFormData.receivername}
                            datetime={data.scheduleTime.scheduleTime}
                            onClick={() => setSelectedShipment(index)}
                        />
                    ))}
                </div>

                {/* Show Shipment details if a shipment is selected */}
                {selectedShipment !== null && selectedShipment !== undefined && (
                    <div className="absolute top-0 w-full h-auto bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
                        <CustomerShipmentDetails
                            senderFormData={allShipments[selectedShipment].senderFormData}
                            receiverFormData={allShipments[selectedShipment].receiverFormData}
                            packageFormData={allShipments[selectedShipment].packageFormData}
                            packagePrice={allShipments[selectedShipment].packagePrice}
                        />
                        <button
                            onClick={() => setSelectedShipment(null)}
                            className="fixed top-4 right-10 text-[#FF7043] text-[44px]"
                        >
                            ×
                        </button>
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

export default CustomerShipments;
