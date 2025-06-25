import React, { useState } from 'react'
import mastercard from './icons/mastercard.svg'
import visacard from './icons/visacard.svg'
import cash from './icons/cash.png'


const Withdraw = ({ onBackStep, onCashPayment, onCardPayment, walletPoints, onWalletPayment, isWalletShow }) => {
    const [selectedPayment, setSelectedPayment] = useState(null)

    const handlePaymentChange = (e) => {
        setSelectedPayment(e.target.value);
    }

    const handleBack = () => {
        onBackStep();
    }

    const handlePayments = () => {

        if (selectedPayment === 'Cash') {
            onCashPayment();
        } else if (selectedPayment === 'Online') {
            // onCardPayment();
        }
    }

   


    return (
        <div className='max-w-3xl fixed left-0 right-0 mx-auto my-auto p-6 bg-white rounded-lg shadow-lg top-1/2 transform -translate-y-1/2'>
            <div className='text-3xl font-bold text-gray-700 text-center mb-6'>Choose a withdraw method</div>
            <div className='w-full mb-3 border-[1px] '></div>
            <div className='flex justify-between'>
                <div>
                    <input onChange={handlePaymentChange} type="radio" value="Online" name="paymentmethod" id="paymentmethod" className='scale-150' />
                    <span className='ml-2 font-semibold text-gray-700 '>Online</span>
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
            <div className='w-full my-3 border-[1px] '></div>


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
                {selectedPayment &&
                    <div
                        onClick={!(selectedPayment === 'Online') && handlePayments}
                        className={`${selectedPayment === 'Online'? 'text-red-500 text-lg mt-2 font-semibold'
                            : 'bg-[#009688]  text-white cursor-pointer py-2 px-4 rounded-full hover:bg-[#FF7043] transition duration-200 ease-in-out'}`}
                    >
                        {selectedPayment === 'Online'? 'Not in operation' : `Continue to ${selectedPayment}`}
                    </div>
                }
            </div>
        </div>

    )
}

export default Withdraw
