import tick from './icons/tick.svg'

const InsuranceClaimCard = ({ trackingNumber, description, datetime, onClick,
    onAccept, onReject, selectedCard, onPaid, processingIndex, processingStatus, index }) => {

    return (
        <div
            className="w-full sm:w-[90%] md:w-[70%] lg:max-w-sm bg-white border rounded-xl shadow-md p-4 hover:scale-105 transition-all duration-300"
        >
            {/* Header (Tracking Number + Date) */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                <span className="font-semibold text-base sm:text-lg text-[#009688]">
                    Tracking ID# {trackingNumber}
                </span>
                <p className="text-gray-600 text-sm sm:text-base">
                    <strong>{datetime}</strong>
                </p>
            </div>

            <div className="text-sm sm:text-base">
                <p className="text-gray-600">
                    <strong>Description:</strong> {description}
                </p>

            </div>

            {/* Footer Buttons */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
                <button onClick={onClick} className="bg-[#009688] text-white px-4 py-2 rounded-lg hover:bg-[#FF7043] transition-all duration-300 text-sm sm:text-base">
                    Details
                </button>

                {selectedCard === 'pending' &&
                    <>
                        <button onClick={onAccept} className={`bg-[#009688] text-white px-4 py-2 rounded-lg hover:bg-[#FF7043] transition-all duration-300 text-sm sm:text-base`}>
                            {processingIndex === index && processingStatus === 'accepted' ? 'Processing...' : 'Accept'}
                        </button>

                        <button onClick={onReject} className={`bg-[#009688] text-white px-4 py-2 rounded-lg hover:bg-[#FF7043] transition-all duration-300 text-sm sm:text-base`}>
                            {processingIndex === index && processingStatus === 'rejected' ? 'Processing...' : 'Reject'}
                        </button>
                    </>
                }
                {selectedCard === 'accepted' &&
                    <button onClick={onPaid} className={`bg-[#009688] text-white px-4 py-2 rounded-lg hover:bg-[#FF7043] transition-all duration-300 text-sm sm:text-base`}>
                       {processingIndex === index && processingStatus === 'completed' ? 'Processing...' : 'Paid?'}
                    </button>
                }
                {selectedCard === 'completed' &&
                    <img src={tick} alt="tick" />
                }

            </div>
        </div>
    );

};

export default InsuranceClaimCard;
