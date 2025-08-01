import React, { useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa';
import Navbar from './Navbar'
import Footer from './Footer'
import Label from './Label';
import Receipt from './Receipt';
import SwiftBot from './SwiftBot';
import OfflineOnline from './OfflineOnline';
import FadeInSection from './FadeInSection';



const ReprintShippingLabel = () => {

    const [error, setError] = useState(null);
    const [reprintLabel, setReprintLabel] = useState('');
    const [isLableAvailable, setIsLabelAvailable] = useState(false)
    const [showInputField, setShowInputField] = useState(true);
    const [allShipments, setallShipments] = useState([]);
    const [bar_qr_Code, setBar_Qr_Code] = useState([]);
    const [isResponse,setIsResponse]=useState('idle')
    
    const handleInput = (e) => {
        setError('')
        setReprintLabel(e.target.value);
    }


    const genrateBarCode = async (shipments) => {

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/regenrate-bar-qrcode`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ shipments })
                }
            )

            if (!response.ok) {
                console.log('Error in response');
                return;
            }
            const barcodeResults = await response.json();
            const bar_qr_codeDataArray = barcodeResults.bar_qr_codeDataArray;
            setBar_Qr_Code(bar_qr_codeDataArray);

        } catch (error) {
            console.log('Error in fetching bar codes', error.message);
        }
    }

    const getShipmentsLabel = async () => {
        try {
            setIsResponse('processing')
            const response = await fetch(`${import.meta.env.VITE_API_URL}/reprint-label`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ reprintLabel })
                }
            )

            if (!response.ok) {
                console.log('Error in response');
            }

            const result = await response.json();
            setIsResponse('success')
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
                        payby: shipment.payby,
                        paid: shipment.paid
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

            }
            genrateBarCode(shipments)

        } catch (error) {
            console.log('Error in fetching shipments', error.message);
        }
    }


    const hanldeSubmit = async () => {

        if (!reprintLabel) {
            setError('Tracking ID is required*')
            return
        }

        if (!(reprintLabel.length == 14)) {
            setError('Enter Valid Tracking ID')
            return
        }

        // Data get from database after
        await getShipmentsLabel();
        setShowInputField(false);
        setIsLabelAvailable(true);
    }



    const handleOnBack = () => {
        setallShipments([])
        setReprintLabel('')
        setShowInputField(true);
        setIsLabelAvailable(false);
    }



    return (
        <div>
            <SwiftBot />
            <Navbar />
            <OfflineOnline />
            {/* Header Section */}
            <FadeInSection delay={0.2}>
                <div className="w-full bg-[#009688] text-white flex justify-center items-center p-6 sm:p-8">
                    <div className="text-3xl sm:text-4xl md:text-5xl font-semibold text-center">
                        Reprint Shipment Label
                    </div>
                </div>

                {showInputField && (
                    <div className='h-[40vh] flex justify-center items-center w-full'>
                        <div className='flex flex-col items-center w-full sm:w-[40vw] p-4'>
                            <div className='flex flex-col  sm:flex-row w-full gap-4'>
                                <input onChange={handleInput} type="text" value={reprintLabel} name="cnic/mobileno/email" id="reprint-label" placeholder='Enter Tracking ID'
                                    className='placeholder:text-[#2632386d] relative w-full px-4 py-2 rounded-lg border-2 border-[#009688]
                                    bg-[#F7F7F7] focus:outline-none focus:border-[#FF7043] ' />
                                <input onClick={hanldeSubmit} type="submit" value={isResponse==='processing'?'Processing...':isResponse==='success'?'Reprint':'Reprint'} className='cursor-pointer font-semibold text-white p-2 bg-[#009688] hover:bg-[#FF7043] rounded-lg md:relative right-6 md:rounded-l-none
                                    transition-all ease-in-out duration-300 hover:text-[18px]' />
                            </div>
                            <div>
                                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                            </div>
                        </div>
                    </div>
                )}

                {isLableAvailable && allShipments.length == 0 && <p className='min-h-[30vh] flex justify-center items-center'>No, shipments scheduled against&nbsp;<span className='text-[#FF7043] font-bold'>{reprintLabel}</span> </p>}
        
                {isLableAvailable && <FaArrowLeft onClick={handleOnBack} className='absolute left-[10%] mt-4 cursor-pointer' />}


                {isLableAvailable && (
                    <div className="w-full flex flex-col items-center mt-10 min-h-[50vh]">
                        <FadeInSection delay={0.2}>
                            {allShipments.map((data, index) => (
                                <div key={index} className="flex  gap-4 items-center justify-center w-full md:w-auto border px-4 py-2">
                                    {/* Label Component */}
                                    <div className="flex-shrink-0">
                                        <Label
                                            barCode={bar_qr_Code[index] || { message: '', barcode: '', qrcode: '' }}
                                            senderData={data.senderFormData}
                                            receiverData={data.receiverFormData}
                                            packageData={data.packageFormData}
                                            totalPrice={data.packagePrice.totalPrice}
                                            position={index}
                                        />
                                    </div>

                                    {/* Receipt Component */}
                                    <div className="flex-shrink-0">
                                        <Receipt
                                            senderData={data.senderFormData}
                                            receiverData={data.receiverFormData}
                                            packageData={data.packageFormData}
                                            packagePrice={data.packagePrice}
                                            scheduleTime={data.scheduleTime?.scheduleTime || ''}
                                            trackingId={data.trackingId?.trackingId || ''}
                                            qrcode={bar_qr_Code[index]?.qrcode || ''}
                                            paymentMethod={data.paymentMethod?.paymentMethod || ''}
                                            position={index}
                                        />
                                    </div>
                                </div>
                        ))}
                         </FadeInSection>
                    </div>
                )}
            </FadeInSection>


            <Footer />

        </div>
    )
}

export default ReprintShippingLabel
