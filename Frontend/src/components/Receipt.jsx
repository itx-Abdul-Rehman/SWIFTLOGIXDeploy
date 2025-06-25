import React, { useState, useEffect } from "react";
import { jsPDF } from 'jspdf';
import html2canvas from "html2canvas";
import { FiDownload } from "react-icons/fi";
import paid from './icons/paid.png'

const Receipt = ({ senderData, receiverData, packageData, packagePrice, scheduleTime, trackingId, qrcode, paymentMethod, position }) => {
  const [receiptImage, setreceiptImage] = useState(null)

  const generateReceiptImage = () => {
    const content = document.getElementById(`receipt-${position}`);
    const scale = 2;

    html2canvas(content, { scale }).then((canvas) => {
      setreceiptImage(canvas.toDataURL('image/png'));
    });
  };

  useEffect(() => {
    generateReceiptImage();
  }, []);

  const downloadReceiptPDF = async () => {
    try {
      const receiptElement = document.getElementById(`receipt-${position}`);

      const canvas = await html2canvas(receiptElement, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("l", "mm", [297, 210]);

      const imgWidth = 277;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save("receipt.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };


  return (
    <>
      {/* Receipt Design Hidden */}
      <div id={`receipt-${position}`} className="max-w-6xl mx-auto p-2 bg-white rounded-md absolute left-[-9999px]">
        <div className="w-full flex justify-between p-3">
          <h2 className="text-lg font-bold text-center">SWIFTLOGIX</h2>
          <h2 className="text-lg font-bold text-center">{packageData.shipmentType}</h2>
        </div>
        <div className="w-full  flex text-center text-[18px] font-bold ">
          <div className="flex-1 border border-black p-2 rounded-tl-lg">Shipment Information</div>
          <div className="flex-1 border border-black p-2">Client Information</div>
          <div className="flex-1 border border-black p-2 rounded-tr-lg">Price Information</div>
        </div>

        <div className="flex border border-black  ">
          <div className="flex-1 border-r border-black p-2">
            <div className="flex justify-between gap-1">
              <div>
                <p className="font-bold">Tracking Id#:</p>
                <p>{trackingId}</p>
              </div>
              <div>
                <img src={qrcode} alt="QRCode" />
              </div>
            </div>
            <p className=" border-black"><b>Schedule Date/Time: </b>{scheduleTime}</p>
            <p className=""><b>Origin: </b>{packageData.originCity}</p>
            <p className=""><b>Destination: </b>{packageData.destinationCity}</p>
            <p className=""><b>Weight: </b>{packageData.weight}kg</p>
            <p className=""><b>Pieces: </b>{packageData.pieces}</p>
            <p className=""><b>Sensitive: </b>{packageData.sensitivePackage}</p>
          </div>
          <div className="flex-1 border-r border-black p-2">
            <p className="font-bold">From:</p>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{senderData.sendername}</p>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{senderData.sendercontact}</p>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{packageData.originCity}</p>
            <p className="font-bold">To:</p>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{receiverData.receivername}</p>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{receiverData.receivercontact}</p>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{receiverData.receiveraddress}</p>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{packageData.destinationCity}</p>
          </div>
          <div className="flex-1 p-2">
            <p><span className="font-bold">Charged Base: </span> {packagePrice.basePrice} Rs</p>
            <p><span className="font-bold">Charged Weight: </span>{packagePrice.weightCharges} Rs</p>
            <p><span className="font-bold">Charged Distance: </span>{packagePrice.distanceCharges} Rs</p>
            {packagePrice.insurance === 'yes' &&
              <p><span className="font-bold">Insurance: </span>100% (50 Rs)</p>
            }
            {packagePrice.insurance === 'no' &&
              <p><span className="font-bold">Insurance: </span>0% (0 Rs)</p>
            }
            <p><span className="font-bold">Rate: </span>{packagePrice.totalPrice} Rs</p>
            <p><span className="font-bold">Payable Amount: </span>{packagePrice.totalPrice} Rs</p>
            <p><span className="font-bold">Payment Method: </span>{paymentMethod}</p>
            <p><span className="font-bold">Pay By: </span>{packageData.payby}</p>
            {(packageData?.paid) &&
              <div className="w-full flex justify-center">
                <img src={paid} alt="paid" className="w-20 py-4" />
              </div>
            }
          </div>

        </div>

        <div className="w-full flex justify-end">
          <div>www.SwiftLogix.com</div>
        </div>
      </div>

      {/* Small Receipt Preview */}
      {receiptImage && (
        <div className='w-[150px] h-[150px]  mt-4 border hover:scale-105 transition-all duration-150 border-gray-300 p-2'>
          <img src={receiptImage} alt='Generated Receipt' className='w-full' />
        </div>
      )}

      {/* Download Button */}
      <div className="flex justify-center my-6">
        <button
          type="button"
          onClick={downloadReceiptPDF}
          className="bg-[#009688] text-white py-2 px-4 flex gap-2 items-center justify-center rounded-full hover:bg-[#FF7043] transition duration-200 ease-in-out hover:scale-105"
        >
          <span>Receipt</span> <FiDownload />
        </button>
      </div>

    </>
  );
};

export default Receipt;
