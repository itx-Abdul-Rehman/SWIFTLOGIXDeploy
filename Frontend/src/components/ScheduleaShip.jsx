import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import SenderForm from './SenderForm';
import ReceiverForm from './ReceiverForm';
import PackageForm from './PackageForm';
import SummaryForm from './summaryForm';
import Label from './Label';
import Receipt from './Receipt';
import Payment from './Payment';
import SuccessfulPayment from './SuccessfulPayment';
import SwiftBot from './SwiftBot';
import OfflineOnline from './OfflineOnline';



const ScheduleaShip = () => {
    const [barCode, setBarCode] = useState({
        success: '',
        message: '',
        barcode: ''
    })
    const [searchParams] = useSearchParams();
    const [currentStep, setCurrentStep] = useState("sender");
    const [scheduleTime, setScheduleTime] = useState(null)
    const [trackingId, setTrackingId] = useState(null)
    const [qrcode, setQRCode] = useState(null);
    const [activeStep, setActiveStep] = useState(1);
    const [useMyProfile, setuseMyProfile] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState(null)
    const step = useRef(1)
    const [packagePrice, setPackagePrice] = useState({
        service: '',
        basePrice: '',
        weightCharges: '',
        distanceCharges: '',
        totalPrice: '',
        insurance: ''
    })
    const [senderFormData, setSenderFormData] = useState({
        sendername: '',
        sendercontact: '',
        senderemail: '',
        sendercnic: ''
    });
    const [receiverFormData, setReceiverFormData] = useState({
        receivername: '',
        receivercontact: '',
        receiveremail: '',
        receivercnic: '',
        receiverarea: '',
        receiverhouseno: '',
        receiveraddress: ''
    });
    const [packageFormData, setPackageFormData] = useState({
        originCity: '',
        destinationCity: '',
        weight: '',
        pieces: '',
        pickupdate: '',
        pickuptime: '',
        insurance: '',
        pickupaddress: '',
        shipmentType: '',
        deliveryMethod: '',
        sensitivePackage: '',
        packageDescription: '',
        orignalprice: '',
        payby: ''
    });

    const handleSenderFormDataChange = (e) => {
        const { name, value } = e.target;
        setSenderFormData({
            ...senderFormData,
            [name]: value
        });
    };

    const handleReceiverFormDataChange = (e) => {
        const { name, value } = e.target;
        setReceiverFormData({
            ...receiverFormData,
            [name]: value
        });
    };

    const handlePackageFormDataChange = (e) => {
        const { name, value } = e.target;
        setPackageFormData({
            ...packageFormData,
            [name]: value
        });

    };


    const handleSenderNextStep = () => {
        step.current++;
        setActiveStep(2);
        setCurrentStep("receiver");
    };

    const handleReceiverNextStep = () => {
        step.current++;
        setActiveStep(3);
        setCurrentStep("package");
    }

    const handlePackageNextStep = async () => {

        // Send the form data to the server
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/calculate-point`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(packageFormData),
            });

            const res = await response.json();
            setPackagePrice({
                service: res.service,
                basePrice: res.basePrice,
                weightCharges: res.weightCharges,
                distanceCharges: res.distanceCharges,
                totalPrice: res.totalPrice,
                insurance: res.insurance
            });
            step.current++;
            setActiveStep(4);
            setCurrentStep("summary");
        } catch (error) {
            console.error('Error submitting form:', error);
        }


    }

    //
    const handleSummaryNextStep = () => {
        step.current++;
        setActiveStep(5);
        setCurrentStep("payment");
    }

    //payment with cash handle here
    const handleWithCashPayment = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/scheduleaship-point`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        senderFormData, receiverFormData, packageFormData, packagePrice
                    })
                }
            )

            if (!response.ok) {
                console.log('response error');
            }

            const res = await response.json();

            console.log(res)
            setBarCode(res)
            setScheduleTime(res.scheduletime)
            setTrackingId(res.trackingid)
            setQRCode(res.qrcode)
            setPaymentMethod(res.paymentmethod)
            packageFormData.paid = res.paid;
            if (res.success) {
                step.current++;
                step.current++;
                setActiveStep(6);
                setCurrentStep("label");
            }


        } catch (error) {
            console.error('Error in handleWithCashPayment:', error.message);
        }
    }

    //payment with card handle here
    const handleWithCardPayment = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/checkout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    senderFormData, receiverFormData, packageFormData, packagePrice,
                    endpoint: 'schedule-a-ship'
                })
            })

            if (!response.ok) {
                console.log('response error')
            }

            const res = await response.json()
            if (res.url) {
                window.location.href = res.url;
            }
        } catch (error) {
            console.log("Error in handling card payments: ", error.message)
        }
    }


    //here check payment success or not through query parameter when changes
    useEffect(() => {
        if (searchParams.get('payment') === 'success') {
            const encodedShipmentData = searchParams.get('data');
            if (encodedShipmentData) {
                const decodedShipmentData = JSON.parse(decodeURIComponent(encodedShipmentData));
                setSenderFormData(decodedShipmentData.senderData);
                setReceiverFormData(decodedShipmentData.receiverData);
                setPackageFormData(decodedShipmentData.packageData);
                setPackagePrice(decodedShipmentData.packagePrice);
                setTrackingId(decodedShipmentData.trackingId);
                setScheduleTime(decodedShipmentData.datetime);
                setPaymentMethod(decodedShipmentData.paymentMethod);
            }
            step.current = 5;
            setActiveStep(5);
            setCurrentStep("paid");
        } else if (searchParams.get('payment') === 'failed') {
            const encodedShipmentData = searchParams.get('data');
            if (encodedShipmentData) {
                const decodedShipmentData = JSON.parse(decodeURIComponent(encodedShipmentData));
                setSenderFormData(decodedShipmentData.senderData);
                setReceiverFormData(decodedShipmentData.receiverData);
                setPackageFormData(decodedShipmentData.packageData);
                setPackagePrice(decodedShipmentData.packagePrice);
            }
            step.current = 5;
            setActiveStep(5);
            setCurrentStep("payment");
        }

    }, [searchParams])

    ////hanlde after completed payment here
    const handleCompletedPayment = async () => {

        const response = await fetch(`${import.meta.env.VITE_API_URL}/bar-qrcode`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ trackingId })
        })

        if (!response.ok) {
            console.log('response error');
        }

        const res = await response.json();
        setBarCode(res)
        setQRCode(res.qrcode)
        if (res.success === true) {
            step.current++;
            step.current++;
            setActiveStep(6);
            setCurrentStep("label");
        }
    }


    const handleReceiverBackStep = () => {
        step.current--;
        setActiveStep(1);
        setCurrentStep("sender");
    }

    const handlePackageBackStep = () => {
        step.current--;
        setActiveStep(2);
        setCurrentStep("receiver");
    }

    const handleSummaryBackStep = () => {
        step.current--;
        setActiveStep(3);
        setCurrentStep("package");
    }

    //
    const handlePaymentBackStep = () => {
        step.current--;
        setActiveStep(4);
        setCurrentStep("summary");
    }

    return (
        <div>
            <SwiftBot />
            <OfflineOnline />
            <Navbar />
            <div className="w-full bg-[#009688] text-white flex justify-center items-center px-4 py-6 sm:py-8">
                <div className="text-3xl sm:text-4xl md:text-5xl font-semibold text-center">
                    Schedule a Ship
                </div>
            </div>
            {/* Process steps */}
            <div className='w-full mt-6 flex justify-center items-center'>
                <span
                    className={`rounded-full border-2 p-3 font-semibold
                    ${step.current > 1 ? 'bg-[#009688] text-white' :
                            step.current === 1 ? 'bg-[#FF7043] text-white' : ''
                        }`}

                >01</span>
                <span
                    className={`p-1 border w-[15%] h-2  ${step.current > 2 ? 'bg-[#009688]' : ''}  ${step.current > 1 && step.current < 3 ? 'bg-[#FF7043]' : ''
                        }`}
                ></span>
                <span
                    className={`rounded-full border-2 p-3 font-semibold ${step.current > 2 ? 'bg-[#009688] text-white' :
                        step.current === 2 ? 'bg-[#FF7043] text-white' : ''
                        }`}

                >02</span>
                <span
                    className={`p-1 border w-[15%] h-2 ${step.current > 3 ? 'bg-[#009688]' : ''}  ${step.current > 2 && step.current < 4 ? 'bg-[#FF7043]' : ''
                        }`}
                ></span>
                <span
                    className={`rounded-full border-2 p-3 font-semibold ${step.current > 3 ? 'bg-[#009688] text-white' :
                        step.current === 3 ? 'bg-[#FF7043] text-white' : ''
                        }`}

                >03</span>
                <span
                    className={`p-1 border w-[15%] h-2 ${step.current > 4 ? 'bg-[#009688]' : ''}  ${step.current > 3 && step.current < 5 ? 'bg-[#FF7043]' : ''
                        }`}
                ></span>
                <span
                    className={`rounded-full border-2 p-3 font-semibold ${step.current > 4 ? 'bg-[#009688] text-white' :
                        step.current === 4 ? 'bg-[#FF7043] text-white' : ''
                        }`}

                >04</span>
                <span
                    className={`p-1 border w-[15%] h-2 ${step.current > 5 ? 'bg-[#009688]' : ''}  ${step.current > 4 && step.current < 6 ? 'bg-[#FF7043]' : ''
                        }`}
                ></span>
                <span
                    className={`rounded-full border-2 p-3 font-semibold ${step.current > 5 ? 'bg-[#009688] text-white' :
                        step.current === 5 ? 'bg-[#FF7043] text-white' : ''
                        }`}

                >05</span>
                <span
                    className={`p-1 border w-[15%] h-2 ${step.current > 6 ? 'bg-[#009688]' : ''}  ${step.current > 5 && step.current < 7 ? 'bg-[#FF7043]' : ''
                        }`}
                ></span>
                <span
                    className={`rounded-full border-2 p-3 font-semibold ${step.current > 6 ? 'bg-[#009688] text-white' :
                        step.current === 6 ? 'bg-[#FF7043] text-white' : ''
                        }`}

                >06</span>
            </div>

            {currentStep === "sender" &&
                <SenderForm
                    senderFormData={senderFormData}
                    onSenderFormDataChange={handleSenderFormDataChange}
                    onNextStep={handleSenderNextStep}
                    useMyProfile={useMyProfile}
                />
            }

            {currentStep === "receiver" &&
                <ReceiverForm
                    receiverFormData={receiverFormData}
                    onReceiverFormDataChange={handleReceiverFormDataChange}
                    onBackStep={handleReceiverBackStep}
                    onNextStep={handleReceiverNextStep}
                />
            }


            {currentStep === "package" &&
                <PackageForm
                    packageFormData={packageFormData}
                    onPackageFormDataChange={handlePackageFormDataChange}
                    onBackStep={handlePackageBackStep}
                    onNextStep={handlePackageNextStep}
                />
            }

            {currentStep === "summary" &&
                <SummaryForm
                    senderFormData={senderFormData}
                    receiverFormData={receiverFormData}
                    packageFormData={packageFormData}
                    onBackStep={handleSummaryBackStep}
                    onNextStep={handleSummaryNextStep}
                    packagePrice={packagePrice}
                />

            }

            {currentStep === "payment" &&
                <Payment
                    onBackStep={handlePaymentBackStep}
                    onCashPayment={handleWithCashPayment}
                    onCardPayment={handleWithCardPayment}
                    isWalletShow={false}
                    setpackageFormData={setPackageFormData}
                    packageFormData={packageFormData}
                />

            }

            {currentStep === 'paid' &&
                <SuccessfulPayment
                    onComplete={handleCompletedPayment}
                />
            }

            {currentStep === "label" &&
                <div className="w-full flex flex-col items-center gap-4 mt-4">
                    <div className='font-bold  text-center text-3xl md:text-5xl text-[#009688] mb-4'>{barCode.message}</div>
                    <div className='flex gap-6 items-center w-full md:w-auto border  px-9 mb-10' >
                        <div className="flex-shrink-0">
                            <Label
                                barCode={barCode}
                                senderData={senderFormData}
                                receiverData={receiverFormData}
                                packageData={packageFormData}
                                totalPrice={packagePrice.totalPrice}
                                position={1}
                            />
                        </div>
                        <div className="flex-shrink-0  ">
                            <Receipt
                                senderData={senderFormData}
                                receiverData={receiverFormData}
                                packageData={packageFormData}
                                packagePrice={packagePrice}
                                scheduleTime={scheduleTime}
                                trackingId={trackingId}
                                qrcode={qrcode}
                                paymentMethod={paymentMethod}
                                position={1}
                            />
                        </div>
                    </div>
                </div>
            }



            <Footer />
        </div>
    );
};

export default ScheduleaShip;