import React, { useState } from 'react'
import mastercard from './icons/mastercard.svg'
import visacard from './icons/visacard.svg'
import cash from './icons/cash.png'
import wallet from './icons/wallet.png'
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck } from 'react-icons/fa';


const Payment = ({ onBackStep, onCashPayment, onCardPayment, walletPoints, onWalletPayment, isWalletShow, setpackageFormData, packageFormData }) => {
    const [selectedPayment, setSelectedPayment] = useState(null)
    const [selectedPayBy, setSelectedPayBy] = useState(null)
    const [status, setStatus] = useState("idle");

    const handlePaymentChange = (e) => {
        setSelectedPayBy(null)
        setSelectedPayment(e.target.value);
    }

    const handlePayBy = (e) => {
        setSelectedPayBy(e.target.value);
        setpackageFormData({
            ...packageFormData,
            payby: e.target.value
        });

    }

    const handleBack = () => {
        onBackStep();
    }

    const handlePayments = () => {
         setStatus('processing')
        if (selectedPayment === 'Cash') {
            onCashPayment();
        } else if (selectedPayment === 'Card') {
            onCardPayment();
        } else if (selectedPayment === 'Wallet') {
            onWalletPayment();
        }
    }


    return (
        <div className='max-w-3xl mx-auto my-10 p-6 bg-white rounded-lg shadow-lg'>
            <div className='text-3xl font-bold text-gray-700 text-center mb-6'>Choose a payment method</div>
            <div className='w-full mb-3 border-[1px] '></div>
            <div className='flex justify-between'>
                <div>
                    <input onChange={handlePaymentChange} type="radio" value="Card" name="paymentmethod" id="paymentmethod" className='scale-150' />
                    <span className='ml-2 font-semibold text-gray-700 '>Card</span>
                </div>
                <div className='flex gap-1'>
                    <img src={mastercard} alt="mastercard" className='w-12 h-8 shadow-lg rounded-sm border shadow-white' />
                    <img src={visacard} alt="visacard" className='w-12 h-8 border rounded-sm shadow-lg  shadow-white' />
                </div>
            </div>
            <div className='w-full my-3 border-[1px] '></div>
            <div className='flex justify-between'>
                <div>
                    <input onChange={handlePaymentChange} type="radio" value="Cash" name="paymentmethod" id="paymentmethod" className='scale-150' />
                    <span className='ml-2 font-semibold text-gray-700 '>Cash</span>
                </div>
                <div>
                    <img src={cash} alt="cash" className='w-12 h-8 rounded-sm shadow-lg  shadow-white' />
                </div>
            </div>
            {selectedPayment === 'Cash' &&
                <div className='flex justify-center gap-6'>
                    <div>
                        <input onChange={handlePayBy} type="radio" value="sender" name="payby" id="payby" className='scale-150' />
                        <span className='ml-2 text-[14px] text-gray-700 '>Pay by Sender</span>
                    </div>
                    <div>
                        <input onChange={handlePayBy} type="radio" value="receiver" name="payby" id="payby" className='scale-150' />
                        <span className='ml-2  text-[14px] text-gray-700 '>Pay by Receiver</span>
                    </div>
                </div>
            }
            <div className='w-full my-3 border-[1px] '></div>

            {isWalletShow &&
                <div className='flex justify-between'>
                    <div>
                        <input onChange={handlePaymentChange} type="radio" value="Wallet" name="paymentmethod" id="paymentmethod" className='scale-150' />
                        <span className='ml-2 font-semibold text-gray-700 '>Wallet</span>
                    </div>
                    <div>
                        <img src={wallet} alt="cash" className='w-11 rounded-sm shadow-lg  shadow-white' />
                    </div>
                </div>
            }


            {/* Button Group */}
            <div className="flex justify-between mt-6">
                {/* Back Button */}
                <button 
                    type="button"
                    onClick={handleBack}
                    className="bg-[#FF7043] text-white py-2 px-4 rounded-full hover:bg-[#009688] transition duration-200 ease-in-out"
                >
                    Back
                </button>


                {/* Next Button */}
                {selectedPayment !== 'Cash' && selectedPayment &&
                    <div
                        onClick={!(selectedPayment === 'Wallet' && walletPoints < 250) && handlePayments}
                        className={`${selectedPayment === 'Wallet' && walletPoints < 250 ? 'text-red-500 text-lg mt-2 font-semibold'
                            : 'bg-[#009688]  text-white cursor-pointer relative py-2 px-4 rounded-full hover:bg-[#FF7043] transition duration-200 ease-in-out'}`}
                    >
                        <AnimatePresence>
                            {status === "success" && (
                                <motion.div
                                    initial={{ x: 100, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute left-[50%]"
                                >
                                    <FaCheck className="text-white" />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <AnimatePresence >
                            {status === "processing" && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1, rotate: 360 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                    className="absolute right-4 h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                                />
                            )}
                        </AnimatePresence>
                        {selectedPayment === 'Wallet' && walletPoints < 250 ? 'Insufficient Points' : status === "processing" ? "Processing..." : status === "success" ? "" : `Continue to ${selectedPayment}`}
                    </div>
                }
                {selectedPayment === 'Cash' && selectedPayBy &&
                    <div
                        onClick={!(selectedPayment === 'Wallet' && walletPoints < 250) && handlePayments}
                        className={`${selectedPayment === 'Wallet' && walletPoints < 250 ? 'text-red-500 text-lg mt-2 font-semibold'
                            : 'bg-[#009688]  text-white cursor-pointer py-2 px-4 relative rounded-full hover:bg-[#FF7043] transition duration-200 ease-in-out'}`}
                    >
                        <AnimatePresence>
                            {status === "success" && (
                                <motion.div
                                    initial={{ x: 100, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute left-[50%]"
                                >
                                    <FaCheck className="text-white" />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <AnimatePresence >
                            {status === "processing" && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1, rotate: 360 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                    className="absolute right-4 h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                                />
                            )}
                        </AnimatePresence>
                        {selectedPayment === 'Wallet' && walletPoints < 250 ? 'Insufficient Points' : status === "processing" ? "Processing..." : status === "success" ? "" : `Continue to ${selectedPayment}`}
                    </div>
                }
            </div>

        </div>
    )
}

export default Payment
