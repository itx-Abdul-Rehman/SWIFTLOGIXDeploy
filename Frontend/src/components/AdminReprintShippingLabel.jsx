import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { FaComments, FaArrowLeft } from 'react-icons/fa';
import Label from './Label';
import AdminSidebar from './AdminSidebar';
import Receipt from './Receipt';
import OfflineOnline from './OfflineOnline';

const AdminReprintShippingLabel = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [reprintLabel, setReprintLabel] = useState('');
    const [isLableAvailable, setIsLabelAvailable] = useState(false)
    const [showInputField, setShowInputField] = useState(true);
    const [allShipments, setallShipments] = useState([]);
    const [bar_qr_Code, setBar_Qr_Code] = useState([]);




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
        <div className='flex min-h-screen overflow-hidden'>
            <OfflineOnline />
            <AdminSidebar />

            <div className='min-[1226px]:ml-[18vw] w-full flex-1 flex flex-col justify-start items-center'>
                <div className='relative bg-[#009688] text-white w-full py-8 flex justify-center items-center'>
                    <div className='text-3xl max-[418px]:text-2xl  sm:text-4xl  font-semibold'>Reprint Shipment Label</div>
                    {isLableAvailable && <FaArrowLeft onClick={handleOnBack} className='absolute bottom-[-32px] left-[10%]  cursor-pointer text-black' />}
                </div>

                {showInputField && (
                    <div className='h-[40vh] flex justify-center items-center w-full'>
                        <div className='flex flex-col items-center w-full sm:w-[40vw] p-4'>
                            <div className='flex flex-col  sm:flex-row w-full gap-4'>
                                <input onChange={handleInput} type="text" value={reprintLabel} name="cnic/mobileno/email" id="reprint-label" placeholder='Enter Tracking ID'
                                    className='placeholder:text-[#2632386d] relative w-full px-4 py-2 rounded-lg border-2 border-[#009688]
                         bg-[#F7F7F7] focus:outline-none focus:border-[#FF7043] ' />
                                <input onClick={hanldeSubmit} type="submit" value="Reprint" className='cursor-pointer font-semibold text-white p-2 bg-[#009688] hover:bg-[#FF7043] rounded-lg md:relative right-6 md:rounded-l-none
                         transition-all ease-in-out duration-300 hover:text-[18px]' />
                            </div>
                            <div>
                                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                            </div>
                        </div>
                    </div>
                )}

                {isLableAvailable && allShipments.length == 0 && <p className='h-full flex justify-center items-center'>
                    No, shipments scheduled against&nbsp;<span className='text-[#FF7043] font-bold'>{reprintLabel}</span> </p>}


                {isLableAvailable && (
                    <div className="w-full flex flex-col items-center mt-10 gap-4">
                        {allShipments.map((data, index) => (
                            <div key={index} className="flex gap-6 justify-center items-center w-full md:w-auto border mt-2 px-9">
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
                                <div className="flex-shrink-0 mt-4 ">
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
                    </div>
                )}

            </div>

        </div>
    )
}

export default AdminReprintShippingLabel
