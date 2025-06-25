import React, { useState } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import RateCalculatorMain from './RateCalculatorMain'
import SwiftBot from './SwiftBot'
import OfflineOnline from './OfflineOnline'

const RateCalculator = () => {
    
    return (
        <div>
            <OfflineOnline />
            <SwiftBot />
            <Navbar />
            <RateCalculatorMain />
            <Footer />
        </div>
    )
}

export default RateCalculator
