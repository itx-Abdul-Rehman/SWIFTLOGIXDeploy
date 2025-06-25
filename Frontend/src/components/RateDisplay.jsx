import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import { useLocation, NavLink } from 'react-router-dom'
import SwiftBot from './SwiftBot'
import OfflineOnline from './OfflineOnline'
import FadeInSection from './FadeInSection'

const RateDisplay = () => {
    const location = useLocation();
    const { service, basePrice, weightCharges, distanceCharges, totalPrice, insuranceType } = location.state;
    return (
        <div>
            <Navbar />
            <OfflineOnline />
            <div className='w-full bg-[#009688] text-white flex justify-center items-center p-8'>
                <div className='text-3xl sm:text-4xl font-semibold'>Rate Calculator</div>
            </div>

            <FadeInSection delay={0.2}>
                {/* Price Information */}
                <div className="w-full flex justify-center">
                    <div className="w-full sm:w-[90%] md:w-[85%] lg:w-[70%] flex flex-col items-center my-8 px-2">

                        {/* Title */}
                        <div className="w-full m-4 flex justify-start">
                            <div className="font-semibold text-2xl sm:text-3xl md:text-4xl text-center">Price Details:</div>
                        </div>

                        {/* Responsive Table */}
                        <div className="w-full overflow-x-auto border-[2px] flex justify-center">
                            <div className="min-w-[600px] w-full">
                                {/* Table Header */}
                                <div className="w-full font-semibold bg-[#009688] flex text-sm sm:text-base text-center">
                                    <div className="w-[16.66%] border-[1px] p-2">Service</div>
                                    <div className="w-[16.66%] border-[1px] p-2">Base Price</div>
                                    <div className="w-[16.66%] border-[1px] p-2">Weight Charges</div>
                                    <div className="w-[16.66%] border-[1px] p-2">Distance Charges</div>
                                    <div className="w-[16.66%] border-[1px] p-2">Insurance</div>
                                    <div className="w-[16.66%] border-[1px] p-2">Total Price</div>
                                </div>

                                {/* Table Body */}
                                <div className="w-full font-semibold flex text-sm sm:text-base text-center">
                                    <div className="w-[16.66%] border-[1px] p-2">{service}</div>
                                    <div className="w-[16.66%] border-[1px] p-2">{basePrice}</div>
                                    <div className="w-[16.66%] border-[1px] p-2">{weightCharges}</div>
                                    <div className="w-[16.66%] border-[1px] p-2">{distanceCharges}</div>
                                    <div className="w-[16.66%] border-[1px] p-2">{insuranceType}</div>
                                    <div className="w-[16.66%] border-[1px] p-2">{totalPrice}</div>
                                </div>
                            </div>
                        </div>

                        {/* Recalculate Button */}
                        <div className="mt-8 flex justify-center">
                            <NavLink to="/rate-calculator">
                                <button className="bg-[#009688] text-white font-medium px-6 py-2 rounded-lg hover:bg-[#FF7043] transition duration-300 hover:scale-105">
                                    Recalculate Price
                                </button>
                            </NavLink>
                        </div>


                    </div>

                </div>
            </FadeInSection>
            <SwiftBot />
            <Footer />
        </div >
    )
}

export default RateDisplay
