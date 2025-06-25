import paid from './icons/paid.png'

const RiderPickShipmentsInfo = ({ allShipments, pdfRef }) => {


    return (
        <div ref={pdfRef} className="space-y-6">
            <div className="font-bold text-center ">SWIFTLOGIX</div>
            {allShipments.map((shipments, index) => (
                <div key={index} className="border-2 max-w-4xl  w-full p-4 rounded-lg shadow-sm">
                    {/* Header */}
                    <div className="flex justify-between mb-2 text-sm">
                        <div><span className="font-semibold">Tracking ID:</span> {shipments.trackingId?.trackingId}</div>
                        <div>Time: {shipments.packageFormData?.pickuptime} &nbsp;&nbsp; {shipments.packageFormData?.pickupdate}</div>
                    </div>

                    {/* Horizontal Line */}
                    <div className="w-full h-px bg-gray-300 mb-4"></div>

                    {/* Main Content */}
                    <div className="flex gap-4 text-sm">
                        {/* Sender Info */}
                        <div className="flex-1">
                            <div className="mb-2 font-semibold">Sender Information</div>
                            <div>Name: {shipments.senderFormData?.sendername}</div>
                            <div>Contact no: {shipments.senderFormData?.sendercontact}</div>
                            <div>Pay By: {shipments.packageFormData?.payby}</div>
                            {(shipments.packageFormData?.paid) &&
                                <div className="w-full flex justify-center">
                                    <img src={paid} alt="paid" className="w-20 py-4" />
                                </div>
                            }

                        </div>

                        {/* Vertical Divider */}
                        <div className="w-px bg-gray-300" />

                        {/* Package Info */}
                        <div className="flex-1">
                            <div className="mb-2 font-semibold">Package Information</div>
                            <div>Origin City: {shipments.packageFormData?.originCity}</div>
                            <div>Destination City: {shipments.packageFormData?.destinationCity}</div>
                            <div>Weight: {shipments.packageFormData?.weight}</div>
                            <div>Pieces: {shipments.packageFormData?.pieces}</div>
                            <div className="">Pickup Address: {shipments.packageFormData?.pickupaddress}</div>
                            <div className="">Description: {shipments.packageFormData?.packageDescription}</div>
                        </div>

                        {/* Vertical Divider */}
                        <div className="w-px bg-gray-300" />

                        {/* Sender Confirmation */}
                        <div className="flex-1">
                            <div className="mb-2 font-semibold">Sender Confirmation</div>
                            <div className="flex items-center  gap-2 mb-4">
                                Picked? <input type="checkbox" className="w-5 h-5 mt-4" />
                            </div>
                            <div>Signature: __________________</div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RiderPickShipmentsInfo;
