import React, { useState, useEffect } from 'react'
import { jsPDF } from 'jspdf'
import { FiDownload } from "react-icons/fi";
import html2canvas from 'html2canvas';

const Label = ({ barCode, senderData, receiverData, packageData, totalPrice, position }) => {
    const [labelImage, setLabelImage] = useState(null);

    const generateLabelImage = () => {
        const content = document.getElementById(`label-${position}`);
        const scale = 2;

        html2canvas(content, { scale }).then((canvas) => {
            setLabelImage(canvas.toDataURL('image/png'));
        });
    };

    useEffect(() => {
        generateLabelImage();
    }, []);

    const downloadLabelPDF = async () => {
        const labelElement = document.getElementById(`label-${position}`);
        if (!labelElement) return;

        const canvas = await html2canvas(labelElement, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");

        const doc = new jsPDF("p", "mm", "a4");
        const imgWidth = 100; 
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        doc.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
        doc.save("label.pdf");
    };


    return (
        <div>
            <div className='w-full flex justify-center mt-4'>
                <div className='w-[50%] flex flex-col items-center '>
                    
                    {/* Label Design (Hidden) */}
                    <div className='w-[100mm] p-2 absolute left-[-9999px] ' id={`label-${position}`}>
                        <div className='flex justify-between font-bold text-2xl mb-4'>
                            <div>SWIFTLOGIX</div>
                            <div>{packageData.shipmentType}</div>
                        </div>
                        <div className='h-[1px] w-full bg-black'></div>
                        <div className='flex justify-between mb-4'>
                            <div>
                                <div className='font-bold'>From:</div>
                                <div className='pl-6'>{senderData.sendername}</div>
                                <div className='pl-6'>{senderData.sendercontact}</div>
                                <div className='pl-6'>{packageData.originCity}</div>
                            </div>
                            <div>
                                <div className='flex gap-2'>
                                    <div className='font-bold'>{totalPrice}&nbsp; RS</div>
                                    {packageData.insurance === 'yes' && <div className='font-bold'> - INSURED </div>}
                                    {packageData.insurance === 'no' && <div className='font-bold'> - UNINSURED</div>}
                                </div>
                                <div>ACTWGT&nbsp;: {packageData.weight}kg</div>
                            </div>
                        </div>
                        <div className='h-[1px] w-full bg-black'></div>
                        <div className='mb-4'>
                            <div className='font-bold'>To:</div>
                            <div className='pl-6'>{receiverData.receivername}</div>
                            <div className='pl-6'>{receiverData.receivercontact}</div>
                            <div className='pl-6'>{receiverData.receiveraddress}</div>
                            <div className='pl-6'>{packageData.destinationCity}</div>
                        </div>
                        <div className='h-[1px] w-full bg-black'></div>
                        <div className='flex flex-col items-center mt-2'>
                            <div className='font-bold mb-3'>SWIFTLOGIX&nbsp;&nbsp;TRACKING&nbsp;#</div>
                            <img src={barCode.barcode} alt='Shipment Barcode' />
                        </div>
                    </div>

                    {/* Small Label Preview */}
                    {labelImage && (
                        <div className='w-[150px] h-auto mt-4 border border-gray-300 p-2  hover:scale-105 transition-all duration-100'>
                            <img src={labelImage} alt='Generated Label' className='w-full' />
                        </div>
                    )}

                    {/* Download Button */}
                    <div className='flex justify-center my-6'>
                        <button
                            type='button'
                            onClick={downloadLabelPDF}
                            className='bg-[#009688] text-white flex items-center justify-center gap-2 py-2 px-4 rounded-full hover:bg-[#FF7043] transition duration-200 ease-in-out hover:scale-105'
                        >
                            <span>Label</span> <FiDownload />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Label
