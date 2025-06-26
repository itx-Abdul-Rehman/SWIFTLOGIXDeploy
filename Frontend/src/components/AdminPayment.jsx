import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { FaComments, FaArrowLeft } from 'react-icons/fa';
import tick from './icons/tick.svg'
import AdminSidebar from './AdminSidebar';
import OfflineOnline from './OfflineOnline';


const AdminPayment = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [transactionId, settransactionId] = useState('');
    const [isTransactionAvailable, setisTransactionAvailable] = useState(false)
    const [showInputField, setShowInputField] = useState(true);
    const [transactionDetail, setTransactionDetail] = useState('');
    const [payMessage, setPayMessage] = useState('')




    useEffect(() => {
        const fetchData = async () => {
            try {

                const token = localStorage.getItem('token');

                const response = await fetch(`${import.meta.env.VITE_API_URL}/admin`, {
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


            } catch (err) {

            }
        }

        fetchData()
    }, [])


    const handleInput = (e) => {
        setError('')
        settransactionId(e.target.value);
    }


    const getTransaction = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/get-transaction`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ transactionId })
                }
            )

            if (!response.ok) {
                console.log('Error in response');
            }

            const result = await response.json();

            if (result.success) {
                setTransactionDetail(result.transaction)
            }

        } catch (error) {
            console.log('Error in fetching transaction', error.message);
        }
    }


    const hanldeSubmit = async () => {

        if (!transactionId) {
            setError('Transaction ID is required*')
            return
        }

        if (!(transactionId.length == 24)) {
            setError('Enter Valid Transaction ID')
            return
        }

        // Data get from database after
        await getTransaction();
        setShowInputField(false);
        setisTransactionAvailable(true);
    }



    const handleOnBack = () => {
        setTransactionDetail('')
        settransactionId('')
        setShowInputField(true);
        setisTransactionAvailable(false);
    }

    const waitForSecond = () => {
        setTimeout(() => {
            setPayMessage('')
            window.location.reload();
        }, 1000);
    }

    const handlePay = async () => {

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/transaction-pay`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ transactionId })
                }
            );

            if (!response.ok) {
                console.log('Response error')
            }

            const result = await response.json();

            if (result.success) {
                setPayMessage(result.message);
                waitForSecond()
            }

        } catch (error) {

        }
    }

    return (
        <div className='flex min-h-screen overflow-hidden'>
           <OfflineOnline />
            <AdminSidebar />

            <div className='min-[1226px]:ml-[18vw] w-full flex-1 flex flex-col justify-start items-center'>
                <div className='relative bg-[#009688] text-white w-full py-8 flex justify-center items-center'>
                    <div className='text-3xl max-[418px]:text-2xl  sm:text-4xl  font-semibold'>Payment</div>
                    {isTransactionAvailable && <FaArrowLeft onClick={handleOnBack} className='absolute bottom-[-32px] left-[10%]  cursor-pointer text-black' />}
                </div>

                {showInputField && (
                    <div className='h-[40vh] flex justify-center items-center w-full'>
                        <div className='flex flex-col items-center w-full sm:w-[40vw] p-4'>
                            <div className='flex flex-col  sm:flex-row w-full gap-4'>
                                <input onChange={handleInput} type="text" value={transactionId} name="cnic/mobileno/email" id="reprint-label" placeholder='Enter Transaction ID'
                                    className='placeholder:text-[#2632386d] relative w-full px-4 py-2 rounded-lg border-2 border-[#009688]
                         bg-[#F7F7F7] focus:outline-none focus:border-[#FF7043] ' />
                                <input onClick={hanldeSubmit} type="submit" value="Search" className='cursor-pointer font-semibold text-white p-2 bg-[#009688] hover:bg-[#FF7043] rounded-lg md:relative right-6 md:rounded-l-none
                         transition-all ease-in-out duration-300 hover:text-[18px]' />
                            </div>
                            <div>
                                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                            </div>
                        </div>
                    </div>
                )}

                {isTransactionAvailable && !(transactionDetail) && <p className='absolute top-[25%]'>
                    <span className='text-[#FF7043] font-bold'>Transaction not found</span> </p>}

                {/* Transaction details */}
                {isTransactionAvailable && transactionDetail &&
                    <div className='absolute top-[25%] w-[90vw] sm:w-[70vw] md:w-[50vw] flex flex-col gap-4' >
                        <div className='bg-white' >
                            <div className='bg-[#009688] p-4 rounded-tr-lg rounded-tl-lg text-white w-full flex flex-col gap-4 justify-center items-center'>
                                <div className='font-semibold text-3xl'>Rs. {transactionDetail?.transactionAmount}</div>
                                <div className='text-center'>
                                    <div className='font-semibold'></div>
                                    <div>SwiftLogix</div>
                                </div>
                            </div>

                            <div className='w-full  flex flex-col px-2'>
                                <div className='font-semibold mb-1 text-lg'>Transaction Details</div>
                                <div className='mb-1 flex justify-between'><div>Transaction ID</div><div>{transactionDetail?._id}</div> </div>
                                <div className='mb-1 flex justify-between'><div>Transaction Time</div><div>{transactionDetail?.datetime}</div> </div>
                            </div>

                            {transactionDetail.paid &&
                                <div className='flex justify-center my-4'>
                                    <img src={tick} alt="tick" />
                                </div>
                            }
                        </div>

                        <div className='flex justify-center gap-4'>
                            {/* Save Button */}
                            <button
                                type="button"
                                onClick={handlePay}
                                className={`${!(transactionDetail.paid) ? 'bg-[#009688] text-white py-2 px-6 rounded-full hover:bg-[#FF7043] transition duration-200 ease-in-out' : 'text-red-500 text-3xl mt-2 font-semibold'}`}
                            >
                                {transactionDetail.paid ? 'Paid' : 'Pay?'}
                            </button>
                        </div>
                    </div>
                }

            </div>

            {payMessage &&
                <div className='w-full flex justify-center items-center fixed top-0 left-0 h-screen bg-black bg-opacity-50 z-50'>
                    <div className='w-[80%] sm:w-[60%] md:w-[40%] lg:w-[30%] rounded-3xl shadow-2xl bg-white p-5 flex flex-col items-center relative transition-all duration-300'>
                        <img src={tick} alt="Success" className='w-20   shadow-2xl rounded-full absolute -top-9' />
                        <p className='mt-10   text-center text-xl sm:text-[36px] text-gray-700 font-semibold'>
                            {payMessage}
                        </p>
                    </div>
                </div>
            }

            
        </div>
    )
}

export default AdminPayment
