import { FiDownload, FiEye } from "react-icons/fi";

const AdminInsuranceClaimDetails = ({ insuranceClaimData }) => {
    return (
        <div className="mt-6 px-4">
            <div className="w-full flex justify-center">
                <div className="bg-white w-full max-w-4xl border border-gray-300 p-6 rounded-2xl shadow-md">
                    <div className="text-gray-700 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:gap-6">
                            <p className="pb-1">
                                <strong>Tracking ID:</strong> {insuranceClaimData?.trackingid}
                            </p>
                            <p className="pb-1">
                                <strong>Description:</strong> {insuranceClaimData?.description}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <p className="pb-2">
                                    <strong>Shipment Value Proof:</strong>
                                </p>
                                <div className="flex gap-2 items-center">
                                    <img
                                        src={insuranceClaimData?.shipmentValueProof}
                                        alt="Shipment Value Proof"
                                        className="w-40 h-40  rounded-md border"
                                    />
                                    <div className="flex flex-col gap-3 ">
                                        <a
                                            href={insuranceClaimData?.shipmentValueProof}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            title="Shipment Value Proof"
                                        >
                                            <FiEye size={20} className="cursor-pointer" />
                                        </a>
                                        <a
                                            href={
                                                insuranceClaimData?.shipmentValueProof
                                                    ? insuranceClaimData.shipmentValueProof.replace('/upload/', '/upload/fl_attachment/')
                                                    : '#'
                                            }
                                            download={`shipment-proof-${insuranceClaimData?.trackingid}.jpg`}
                                            className=""
                                            title="Download Shipment Value Proof"
                                        >
                                            <FiDownload size={20} className="cursor-pointer" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <p className="pb-2">
                                    <strong>Other Supporting Document:</strong>
                                </p>
                                <div className="flex gap-2 items-center">
                                    <img
                                        src={insuranceClaimData?.otherSupportingDocument}
                                        alt="Other Supporting Document"
                                        className="w-40 h-40 rounded-md border"
                                    />
                                    <div className="flex flex-col gap-3 ">
                                        <a
                                            href={insuranceClaimData?.otherSupportingDocument}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            title="View Supporting Document"
                                        >
                                            <FiEye size={20} className="cursor-pointer" />
                                        </a>
                                        <a
                                            href={
                                                insuranceClaimData?.otherSupportingDocument
                                                    ? insuranceClaimData.otherSupportingDocument.replace('/upload/', '/upload/fl_attachment/')
                                                    : '#'
                                            }
                                            download={`supporting-document-${insuranceClaimData?.trackingid}.jpg`}
                                            title="Download Supporting Document"
                                        >
                                            <FiDownload size={20} className="cursor-pointer" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default AdminInsuranceClaimDetails;
