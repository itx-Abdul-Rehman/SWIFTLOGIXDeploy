import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FadeInSection from './FadeInSection';

const RateCalculatorMain = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        originCity: '',
        destinationCity: '',
        weight: '',
        shipmentType: '',
        insurance: '',
        orignalprice: ''
    });

    const [error, setError] = useState(null)
    const [orignalpriceerror, setOrignalPriceError] = useState(null)
    const [isResponse,setIsResponse]=useState('idle')

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        setError('')
        setOrignalPriceError('')
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const formDetails = {};
        formData.forEach((value, index) => {
            formDetails[index] = value;
        });

        if (!(formDetails.weight > 0)) {
            setError('Weight must be greater than 0');
            return;
        }

        if (!(/^\d+$/.test(formDetails.orignalprice) || formDetails.insurance === 'no')) {
            setOrignalPriceError('Shipment price must be entered in digits only (e.g., 1200)');
            return;
        }

        if (!(formDetails.orignalprice > 0) && formDetails.insurance === 'yes') {
            setOrignalPriceError('Original Price must be greater than 0');
            return;
        }
        setIsResponse('processing')
        try {
            const response = await fetch("http://13.234.75.47:3000/calculate-point", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formDetails),
            });

            const res = await response.json();
            setIsResponse('success')
            navigate('/price-page', {
                state: {
                    service: res.service,
                    basePrice: res.basePrice,
                    weightCharges: res.weightCharges,
                    distanceCharges: res.distanceCharges,
                    totalPrice: res.totalPrice,
                    insuranceType: res.insurance
                }
            })
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <FadeInSection delay={0.2}>
            <div className='w-full'>
                <div className='w-full bg-[#009688] text-white flex justify-center items-center p-8'>
                    <div className='text-3xl sm:text-4xl font-semibold'>Rate Calculator</div>
                </div>

                <div className="flex justify-center py-10 px-4 bg-gray-100">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
                        <h2 className="text-2xl font-bold text-center mb-6">Rate Calculator</h2>
                        <form onSubmit={handleSubmit}>

                            {/* Origin City */}
                            <div className="mb-4">
                                <label htmlFor="originCity" className="block text-sm font-medium text-gray-700">Origin City</label>
                                <select
                                    id="originCity"
                                    name="originCity"
                                    value={formData.originCity}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#FF7043] focus:border-[#FF7043]"
                                    required
                                >
                                    <option value="" disabled>Select a city</option>
                                    {["Karachi", "Islamabad", "Lahore", "Rawalpindi", "Faisalabad", "Sialkot", "Multan", "Peshawar", "Quetta", "Bahawalpur", "Gujranwala", "Sukkur", "Mardan", "Abbottabad"]
                                        .filter(city => city !== formData.destinationCity)
                                        .map(city => <option key={city} value={city}>{city}</option>)}
                                </select>
                            </div>

                            {/* Destination City */}
                            <div className="mb-4">
                                <label htmlFor="destinationCity" className="block text-sm font-medium text-gray-700">Destination City</label>
                                <select
                                    id="destinationCity"
                                    name="destinationCity"
                                    value={formData.destinationCity}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#FF7043] focus:border-[#FF7043]"
                                    required
                                >
                                    <option value="" disabled>Select a city</option>
                                    {["Karachi", "Islamabad", "Lahore", "Rawalpindi", "Faisalabad", "Sialkot", "Multan", "Peshawar", "Quetta", "Bahawalpur", "Gujranwala", "Sukkur", "Mardan", "Abbottabad"]
                                        .filter(city => city !== formData.originCity)
                                        .map(city => <option key={city} value={city}>{city}</option>)}
                                </select>
                            </div>

                            {/* Weight */}
                            <div className="mb-4">
                                <label htmlFor="weight" className="block text-sm font-medium text-gray-700">Weight (in kg)</label>
                                <input
                                    type="number"
                                    id="weight"
                                    name="weight"
                                    value={formData.weight}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#FF7043] focus:border-[#FF7043]"
                                    required
                                />
                                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                            </div>

                            {/* Shipment Type */}
                            <div className="mb-6">
                                <label htmlFor="shipmentType" className="block text-sm font-medium text-gray-700">Shipment Type</label>
                                <select
                                    id="shipmentType"
                                    name="shipmentType"
                                    value={formData.shipmentType}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#FF7043] focus:border-[#FF7043]"
                                    required
                                >
                                    <option value="">Shipment type</option>
                                    <option value="Ground">Ground</option>
                                    <option value="Express">Express</option>
                                </select>
                            </div>

                            {/* Insurance */}
                            <div className="mb-4">
                                <label htmlFor="insurance" className="block text-sm font-medium text-gray-700">Insurance Type</label>
                                <select
                                    id="insurance"
                                    name="insurance"
                                    value={formData.insurance}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#FF7043] focus:border-[#FF7043]"
                                    required
                                >
                                    <option value="" disabled>Insurance Type</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </select>
                            </div>

                            {/* Original Price */}
                            {formData.insurance === 'yes' && (
                                <div className="mb-4">
                                    <label htmlFor="orignalprice" className="block text-sm font-medium text-gray-700">Shipment Original Price</label>
                                    <input
                                        type='text'
                                        id="orignalprice"
                                        name="orignalprice"
                                        value={formData.orignalprice}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#FF7043] focus:border-[#FF7043]"
                                        required
                                    />
                                    {orignalpriceerror && <p className="text-red-500 text-sm mt-1">{orignalpriceerror}</p>}
                                </div>
                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isResponse==='processing'}
                                className="w-full py-2 px-4 bg-[#009688] text-white font-semibold rounded-lg hover:bg-[#FF7043] transition-all duration-300 ease-in-out"
                            >
                                {isResponse==='processing'?'Processing...':isResponse==='success'?'Calculated':'Calculate'}
                            </button>

                        </form>
                    </div>
                </div>
            </div>
        </FadeInSection>
    );
};

export default RateCalculatorMain;
