import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { FaComments, FaArrowLeft } from 'react-icons/fa';
import tick from './icons/tick.svg'
import AdminSidebar from './AdminSidebar';
import InsuranceClaimCard from './InsuranceClaimCard';
import AdminInsuranceClaimDetails from './AdminInsuranceClaimDetails';
import OfflineOnline from './OfflineOnline';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const AdminInsurance = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [searchTrackingId, setsearchTrackingId] = useState(null);
    const [pendingClaimsCount, setPendingClaimsCount] = useState(0);
    const [acceptedClaimsCount, setAcceptedClaimsCount] = useState(0);
    const [rejectedClaimsCount, setRejectedClaimsCount] = useState(0);
    const [completedClaimsCount, setCompletedClaimsCount] = useState(0);
    const [selectedCard, setSelectedCard] = useState(null);
    const [userData, setuserData] = useState({})
    const [allInsuranceClaims, setallInsuranceClaims] = useState([]);
    const [allInsuranceClaimsCopies, setallInsuranceClaimsCopies] = useState([]);
    const [selectedInsuranceClaim, setSelectedInsuranceClaim] = useState(null)
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
            const response = await fetch('http://13.203.194.4:3000/get-insurance-claims',
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
            const claims = result.claims;

            if (claims.length > 0) {
                setallInsuranceClaims(claims);
                setallInsuranceClaimsCopies(claims)
            } else {
                setallInsuranceClaims([])
                setallInsuranceClaimsCopies([])
            }

        }

        fetchData()
    }, [userData, selectedCard])


    //here count  accepted claims
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('http://13.203.194.4:3000/get-insurance-claims',
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ selectedCard: 'accepted', city: userData?.city })
                }
            )
            if (!response.ok) {
                console.log('response error');
            }

            const result = await response.json();
            setAcceptedClaimsCount(result.claims.length);

        }

        fetchData()
    }, [userData])


    //here count pending claims
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('http://13.203.194.4:3000/get-insurance-claims',
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
            setPendingClaimsCount(result.claims.length);

        }

        fetchData()
    }, [userData])

    //here count rejected claims
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('http://13.203.194.4:3000/get-insurance-claims',
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
            setRejectedClaimsCount(result.claims.length);

        }

        fetchData()
    }, [userData])

    //here count completed claims
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('http://13.203.194.4:3000/get-insurance-claims',
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ selectedCard: 'completed', city: userData?.city })
                }
            )
            if (!response.ok) {
                console.log('response error');
            }

            const result = await response.json();
            setCompletedClaimsCount(result.claims.length);

        }

        fetchData()
    }, [userData])





    const handleChange = (e) => {
        setError('')
        setsearchTrackingId(e.target.value);
        setallInsuranceClaims(allInsuranceClaimsCopies)
    }


    const handleSeacrh = async () => {
        setError('')
        if ((searchTrackingId.length === 0)) {
            setError('Tracking Id required*')
            return
        }
        const searchedClaim = allInsuranceClaims.find(claims => claims.trackingid === searchTrackingId);
        if (!searchedClaim) {
            setError('No, insurance claim found.')
            return
        }
        setallInsuranceClaims([searchedClaim]);
    }

    const waitForSecond = () => {
        setTimeout(() => {
            setIsSuccessfullyUpdate(false)
            setIsUnSuccessfullyUpdate(false)
            window.location.reload()
        }, 3000);
    }

    const handleAcceptandReject = async (index, claimStatus) => {
        try {
            setProcessingIndex(index)
            setProcessingStatus(claimStatus)
            const trackingid = allInsuranceClaims[index].trackingid;

            const response = await fetch('http://13.203.194.4:3000/update-insurance-claims',
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ trackingid: trackingid, claimStatus: claimStatus })
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
                toast.success('Claim status updated')
                window.location.reload()
            } else {
                setProcessingIndex(null)
                setProcessingStatus(null)
                toast.success('Failed update to claim status')
                window.location.reload()
            }

        } catch (error) {
            toast.success('Failed update to claim status')
        }
    }



    return (
        <div className='flex min-h-screen overflow-hidden'>

            <AdminSidebar />
            <ToastContainer />

            <div className='min-[1226px]:ml-[18vw] w-full flex-1 flex flex-col justify-start '>
                <div className='relative bg-[#009688] text-white w-full py-8 flex justify-center items-center'>
                    <div className='text-3xl max-[418px]:text-2xl  sm:text-4xl  font-semibold'>Insurance</div>

                </div>


                {/* Dashboard Cards */}
                <div className='relative'>
                    <div className='flex gap-6 p-8'>
                            <DashboardCard
                                title="Completed Claims"
                                value={completedClaimsCount}
                                onClick={() => handleCardClick('completed')}
                                isSelected={selectedCard === 'completed'}
                            />
                            <DashboardCard
                                title="Pending Claims"
                                value={pendingClaimsCount}
                                onClick={() => handleCardClick('pending')}
                                isSelected={selectedCard === 'pending'}
                            />
                            <DashboardCard
                                title="Accepted Claims"
                                value={acceptedClaimsCount}
                                onClick={() => handleCardClick('accepted')}
                                isSelected={selectedCard === 'accepted'}
                            />
                            <DashboardCard
                                title="Rejected Claims"
                                value={rejectedClaimsCount}
                                onClick={() => handleCardClick('rejected')}
                                isSelected={selectedCard === 'rejected'}
                            />
                    


                        {/* Search field */}
                        <div className={`absolute bottom-[-37px] text-center max-sm:top-[13rem]  right-4 sm:right-10 md:right-16 p-2 bg-white rounded-lg w-[90%] sm:w-auto`}>
                            {/* Error message appears above the search bar */}
                            {error && (
                                <div className="text-red-600 mb-2 text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="flex flex-wrap items-center gap-2">
                                <input
                                    type="text"
                                    placeholder="Tracking ID"
                                    value={searchTrackingId}
                                    name="searchTrackingId"
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
                        </div>

                    </div>

                </div>

                {
                    allInsuranceClaims.length == 0 &&
                    <div className='flex justify-center items-center'>No, {selectedCard} insurance claims</div>
                }

                {/*Insrance Claims List */}
                <div className={`flex  flex-wrap  gap-4  max-sm:px-4 sm:pl-8 ${selectedCard !== 'scheduled' && 'sm:mt-12 mt-24'}`}>
                    {allInsuranceClaims.map((data, index) => (
                        <InsuranceClaimCard
                            key={index}
                            trackingNumber={data.trackingid}
                            description={data.description}
                            datetime={data.datetime}
                            onClick={() => setSelectedInsuranceClaim(index)}
                            onAccept={() => handleAcceptandReject(index, 'accepted')}
                            onReject={() => handleAcceptandReject(index, 'rejected')}
                            onPaid={() => handleAcceptandReject(index, 'completed')}
                            selectedCard={selectedCard}
                            processingIndex={processingIndex}
                            processingStatus={processingStatus}
                            index={index}
                        />
                    ))}
                </div>


                {/* Show Insurance Claim details if a claim is selected */}
                {selectedInsuranceClaim !== null && selectedInsuranceClaim !== undefined && (
                    <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
                        <div className="relative bg-white rounded-lg p-4 max-w-4xl w-full">
                            <button
                                onClick={() => setSelectedInsuranceClaim(null)}
                                className="absolute top-4 right-4 text-[#FF7043] text-3xl font-bold focus:outline-none"
                                aria-label="Close"
                            >
                                ×
                            </button>
                            <AdminInsuranceClaimDetails
                                insuranceClaimData={allInsuranceClaims[selectedInsuranceClaim]}
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

            <OfflineOnline />

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

export default AdminInsurance
