import { useState } from 'react'
import Navbar from './components/Navbar'
import Main from './components/Main'
import Cards from './components/Cards'
import Footer from './components/Footer'
import ProductAndServices from './components/ProductAndServices'
import SwiftBot from './components/SwiftBot'
import OfflineOnline from './components/OfflineOnline'


function App() {
  const [rateCalulatorAdrress, setRateCalulatorAdrress] = useState('/rate-calculator')
  const [scheduleShipAdrress, setScheduleShipAdrress] = useState('/schedule-a-ship')
  const [reprintLabelAddress, setReprintLabelAdrress] = useState('/reprint-shipping-label')
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  return (
    <>
      <Navbar />
      <Main />
      <Cards
        rateCalulatorAdrress={rateCalulatorAdrress}
        scheduleShipAdrress={scheduleShipAdrress}
        reprintLabelAddress={reprintLabelAddress} />
      {/* <ProductAndServices /> */}
      <SwiftBot />
      <Footer />
      <OfflineOnline />
    </>
  )
}

export default App
