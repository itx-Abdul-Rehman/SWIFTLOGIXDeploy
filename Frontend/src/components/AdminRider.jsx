import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { FaComments, FaArrowLeft } from 'react-icons/fa';
import tick from './icons/tick.svg'
import AdminSidebar from './AdminSidebar';
import InsuranceClaimCard from './InsuranceClaimCard';
import AdminInsuranceClaimDetails from './AdminInsuranceClaimDetails';
import AdminRiderCard from './AdminRiderCard';
import AdminRiderCardDetails from './AdminRiderCardDetails';
import OfflineOnline from './OfflineOnline';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const AdminRider = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [searchCnic, setsearchCnic] = useState(null);
    const [pendingRidersCount, setPendingRidersCount] = useState(0);
    const [rejectedRidersCount, setrejectedRidersCount] = useState(0);
    const [activeRidersCount, setactiveRidersCount] = useState(0);
    const [selectedCard, setSelectedCard] = useState(null);
    const [userData, setuserData] = useState({})
    const [allRiders, setallRiders] = useState([]);
    const [allRidersCopies, setallRidersCopies] = useState([]);
    const [selectedRider, setSelectedRider] = useState(null)
    const [isSuccessfullyUpdate, setIsSuccessfullyUpdate] = useState(false)
    const [isUnSuccessfullyUpdate, setIsUnSuccessfullyUpdate] = useState(false)
    const [responseMessage, setResponseMessage] = useState(null)
    const [processingIndex, setProcessingIndex] = useState(null)
    const [processingStatus, setProcessingStatus] = useState(null)


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

                if (!response.ok) {
                    console.log('Response error')
                }
                const result = await response.json();
                if (!result.success) {
                    navigate('/admin-login')
                }

                setuserData(result.userData);


            } catch (err) {

            }
        }

        fetchData()
    }, [])

    //only one time run when click on insurance and set default insurance claims shows
    useEffect(() => {
        setSelectedCard('pending')
    }, [])

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



    //here get selected type claims
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('http://13.203.194.4:3000/get-riders',
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ selectedCard, city: userData?.city })
                }
            )
            if (!response.ok) {
                console.log('response error');
            }

            const result = await response.json();
            const riders = result.riders;
            console.log(riders)
            if (riders.length > 0) {
                setallRiders(riders);
                setallRidersCopies(riders)
            } else {
                setallRiders([]);
                setallRidersCopies([])
            }

        }

        fetchData()
    }, [userData, selectedCard])


    //here count  rejected riders
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('http://13.203.194.4:3000/get-riders',
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ selectedCard: 'rejected', city: userData?.city })
                }
            )
            if (!response.ok) {
                console.log('response error');
            }

            const result = await response.json();
            setrejectedRidersCount(result.riders.length);

        }

        fetchData()
    }, [userData])


    //here count pending riders
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('http://13.203.194.4:3000/get-riders',
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ selectedCard: 'pending', city: userData?.city })
                }
            )
            if (!response.ok) {
                console.log('response error');
            }

            const result = await response.json();
            setPendingRidersCount(result.riders.length);

        }

        fetchData()
    }, [userData])

    //here count active riders
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('http://13.203.194.4:3000/get-riders',
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ selectedCard: 'active', city: userData?.city })
                }
            )
            if (!response.ok) {
                console.log('response error');
            }

            const result = await response.json();
            setactiveRidersCount(result.riders.length);

        }

        fetchData()
    }, [userData])




    const handleChange = (e) => {
        setError('')
        setsearchCnic(e.target.value);
        setallRiders(allRidersCopies)
    }


    const handleSeacrh = async () => {
        setError('')
        if ((searchCnic.length === 0)) {
            setError('Cnic required*')
            return
        }
        const searchedRider = allRiders.find(riders => riders.cnic === searchCnic);
        if (!searchedRider) {
            setError('No, rider found.')
            return
        }
        setallRiders([searchedRider]);
    }

    const waitForSecond = () => {
        setTimeout(() => {
            setIsSuccessfullyUpdate(false)
            setIsUnSuccessfullyUpdate(false)
            window.location.reload()
        }, 3000);
    }

    const handleAcceptandReject = async (index, riderStatus) => {
        try {
            setProcessingIndex(index)
            setProcessingStatus(riderStatus)
            const cnic = allRiders[index].cnic;

            const response = await fetch('http://13.203.194.4:3000/update-riders',
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ cnic: cnic, riderStatus: riderStatus })
                }
            )
            if (!response.ok) {
                console.log('response error');
            }

            const result = await response.json();
            setResponseMessage(result.message)
            if (result.success) {
                setProcessingIndex(null)
                setProcessingStatus(null)
                toast.success('Rider status updated')
                window.location.reload()
            } else {
                setProcessingIndex(null)
                setProcessingStatus(null)
                toast.error('Failed to update rider status')
                window.location.reload()
            }

        } catch (error) {
            toast.error('Failed to update rider status')
        }
    }

    return (
        <div className='flex min-h-screen overflow-hidden'>
            <OfflineOnline />
            <AdminSidebar />
            <ToastContainer />

            <div className=' relative min-[1226px]:ml-[18vw] w-full flex-1 flex flex-col justify-start '>
                <div className='relative bg-[#009688] text-white w-full py-8 flex justify-center items-center'>
                    <div className='text-3xl max-[418px]:text-2xl  sm:text-4xl  font-semibold'>Riders</div>

                </div>


                {/* Dashboard Cards */}
                <div className='relative'>
                    <div className='flex gap-6 p-8'>
                        <DashboardCard
                            title="Active Riders"
                            value={activeRidersCount}
                            onClick={() => handleCardClick('active')}
                            isSelected={selectedCard === 'active'}
                        />
                        <DashboardCard
                            title="Pending Riders"
                            value={pendingRidersCount}
                            onClick={() => handleCardClick('pending')}
                            isSelected={selectedCard === 'pending'}
                        />
                        <DashboardCard
                            title="Blocked Riders"
                            value={rejectedRidersCount}
                            onClick={() => handleCardClick('rejected')}
                            isSelected={selectedCard === 'rejected'}
                        />

                        {/* Search field */}
                        <div className={`absolute bottom-[-37px] text-center right-4 max-sm:top-[13rem] sm:right-10 md:right-16 p-2 bg-white rounded-lg w-[90%] sm:w-auto`}>
                            <div className="flex flex-wrap items-center gap-2">
                                <input
                                    type="text"
                                    placeholder="Enter CNIC"
                                    value={searchCnic}
                                    name="searchCnic"
                                    onChange={handleChange}
                                    className="flex-1 min-w-0 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#009688] w-full sm:w-auto"
                                />
                                <button
                                    onClick={handleSeacrh}
                                    className="bg-[#009688] text-white px-4 py-2 rounded-lg hover:bg-[#FF7043] w-full sm:w-auto"
                                >
                                    Search
                                </button>
                            </div>
                            {/* Error message appears above the search bar */}
                            {error && (
                                <div className="text-red-600 mb-2 text-sm">
                                    {error}
                                </div>
                            )}
                        </div>

                    </div>

                </div>

                {
                    allRiders.length == 0 &&
                    <div className='flex justify-center items-center'>No, {selectedCard} riders</div>
                }

                {/*Insrance Claims List */}
                <div className={`flex  flex-wrap gap-4 max-sm:px-4 sm:pl-8 ${selectedCard !== 'scheduled' && 'sm:mt-12 mt-24 mb-4'}`}>
                    {allRiders.map((data, index) => (
                        <AdminRiderCard
                            key={index}
                            name={data.name}
                            cnic={data.cnic}
                            datetime={data.datetime}
                            onClick={() => setSelectedRider(index)}
                            onAccept={() => handleAcceptandReject(index, 'active')}
                            onReject={() => handleAcceptandReject(index, 'rejected')}
                            selectedCard={selectedCard}
                            processingIndex={processingIndex}
                            processingStatus={processingStatus}
                            index={index}
                        />
                    ))}
                </div>


                {/* Show Rider details if a rider is selected */}
                {selectedRider !== null && selectedRider !== undefined && (
                    <div className="absolute inset-0 flex justify-center items-center z-50">
                        <div className="relative bg-white  w-full  max-h-screen overflow-y-auto rounded-lg shadow-lg">
                            <button
                                onClick={() => setSelectedRider(null)}
                                className="fixed top-4 right-8 text-[#FF7043] text-3xl font-bold focus:outline-none"
                                aria-label="Close"
                            >
                                ×
                            </button>
                            <AdminRiderCardDetails
                                riderData={allRiders[selectedRider]}
                                onAccept={() => handleAcceptandReject(index, 'active')}
                                onReject={() => handleAcceptandReject(index, 'rejected')}
                                selectedCard={selectedCard}
                            />
                        </div>
                    </div>

                )}


                {/* submit notification */}
                {isSuccessfullyUpdate &&
                    <div className='border-none bg-[#009688] text-white w-60 p-4 absolute bottom-8 right-4  bg-opacity-3 backdrop-blur-lg '>
                        {responseMessage}
                    </div>
                }
                {isUnSuccessfullyUpdate &&
                    <div className='border-none bg-[#FF7043] text-white w-60 p-4 absolute bottom-8 right-4  bg-opacity-3 backdrop-blur-lg '>
                        {responseMessage}
                    </div>
                }


            </div>

        </div>
    )
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

export default AdminRider
