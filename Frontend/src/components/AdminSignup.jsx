import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import image from './icons/login.png'
import show from './icons/view.png'
import hide from './icons/hide.png'
import tick from './icons/tick.svg'
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf'
import logo from './logo/SWIFTLOGIX Logo 2.png';
import OfflineOnline from './OfflineOnline';

const AdminSignup = () => {
    const navigate = useNavigate();
    const [signupForm, setSignupForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmpassword: '',
        city:'',
        adminaccesscode: '',
    })
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [isAccountCreated, setIsAccountCreated] = useState(false);
    const [credential, setCredential] = useState('')


    const downloadCredentialPDF = async () => {
        try {
            const credentialElement = document.getElementById('credentials');

            const canvas = await html2canvas(credentialElement, { scale: 2, useCORS: true });
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("l", "mm", [297, 210]);

            const imgWidth = 277;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
            pdf.save("credential.pdf");

            setIsAccountCreated(false);
            setSignupForm({
                name: '',
                email: '',
                password: '',
                confirmpassword: '',
                city:'',
                adminaccesscode: '',
            })
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target
        setSignupForm({
            ...signupForm,
            [name]: value
        })
        setError('')
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        //Password length match
        if (signupForm.password.length < 8) {
            setError('Password contain minimum 8 characters');
            return;
        }
        // Password match with confirm password
        if (signupForm.password !== signupForm.confirmpassword) {
            setError('Passwords do not match');
            return;
        }

        setError('');
        // Handle actual signup logic here

        try {

            const response = await fetch('http://13.234.75.47:3000/admin-signup',
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(signupForm)
                }
            )

            if (!response.ok) {
                console.log('response error');
            }

            const result = await response.json()
            if (result.success) {
                setCredential(result.employeeData)
                setIsAccountCreated(true)

            } else {
                setError(result.message);
            }



        } catch (error) {
            console.error('Error submitting form:', error);
        }

    };




    const handleNavigateToDashBoard = () => {
        navigate('/customer-dashboard');
    }


    return (
        <>
        <OfflineOnline />
            <div className="w-full flex justify-center items-center">
                <div className="flex flex-col items-center text-center">
                    <img src={logo} alt="SwiftLogix Logo" className="w-14 py-2 object-contain" />
                </div>
            </div>

            <div className='w-full bg-[#009688] text-white flex justify-center items-center p-6 sm:p-8'>
                <div className='text-3xl sm:text-5xl font-semibold text-center'>Admin Portal</div>
            </div>

            <div className="flex justify-center mt-2 w-full ">
                <div className="left w-full lg:w-1/2   flex justify-center  ">
                    {/*  */}
                    <div className="w-full lg:max-w-[400px] p-8 bg-white rounded-[10px] shadow-lg ">
                        <h2 className="text-3xl text-gray-700 text-center mb-6 ">Sign Up</h2>
                        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                        <form onSubmit={handleSubmit}>
                            {/* Name Field */}
                            <div className="mb-4">
                                <input
                                    type="text"
                                    value={signupForm.name}
                                    name='name'
                                    onChange={handleChange}
                                    className="w-full p-3 border rounded-md focus:outline-none"
                                    placeholder="Username"
                                    required

                                />
                            </div>

                            {/* Email Field */}
                            <div className="mb-4">
                                <input
                                    type="email"
                                    value={signupForm.email}
                                    name='email'
                                    onChange={handleChange}
                                    className="w-full p-3 border rounded-md focus:outline-none"
                                    placeholder="Email Address"
                                    required
                                />
                            </div>

                            {/* Password Field */}
                            <div className="mb-4 relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={signupForm.password}
                                    name='password'
                                    onChange={handleChange}
                                    className="w-full p-3 border rounded-md focus:outline-none"
                                    placeholder="Password"
                                    required
                                />
                                <span
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <img src={show} alt='Show' className='w-6'></img> : <img src={hide} alt='Hide' className='w-6'></img>}
                                </span>
                            </div>

                            {/* Confirm Password Field */}
                            <div className="mb-4 relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={signupForm.confirmpassword}
                                    name='confirmpassword'
                                    onChange={handleChange}
                                    className="w-full p-3 border rounded-md focus:outline-none"
                                    placeholder="Confirm Password"
                                    required
                                />
                                <span
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <img src={show} alt='Show' className='w-6'></img> : <img src={hide} alt='Hide' className='w-6'></img>}
                                </span>
                            </div>

                              {/* Cities*/}
                              <div className="mb-4 border ">
                                <select onChange={handleChange} name="city" value={signupForm.city} id="cities" className='w-full p-4' required>
                                    <option value="" selected disabled>Select City</option>
                                    <option value="Lahore">Lahore</option>
                                    <option value="Islamabad">Islamabad</option>
                                    <option value="Karachi">Karachi</option>
                                    <option value="Multan">Multan</option>
                                    <option value="Okara">Okara</option>
                                    <option value="Gujrat">Gujrat</option>
                                    <option value="Rawalpindi">Rawalpindi</option>
                                    <option value="Rahim Yar Khan">Rahim Yar Khan</option>
                                </select>
                            </div>

                            {/* Admin access code Field */}
                            <div className="mb-4">
                                <input
                                    type="password"
                                    value={signupForm.adminaccesscode}
                                    name='adminaccesscode'
                                    onChange={handleChange}
                                    className="w-full p-3 border rounded-md focus:outline-none"
                                    placeholder="Admin access code"
                                    required
                                />
                            </div>

                            {/* Sign Up Button */}
                            <button
                                type="submit"
                                className="w-full bg-[#009688] hover:bg-[#FF7043] text-white py-3 rounded-md mb-4 transition-all duration-300"
                            >
                                Sign Up
                            </button>


                            {/* Login Link */}
                            <p className="text-center text-sm">
                                Already have an account?{' '}
                                <NavLink to='/admin-login' className="text-[#FF7043]">
                                    Signin
                                </NavLink>
                            </p>
                        </form>
                    </div>
                </div>

                <div className="hidden right w-[50%] h-[100%]  justify-center items-center">
                    <div className="bg-[#FF7043] w-[70%] h-[80%] rounded-[60px] flex flex-col pt-4 justify-around items-center relative text-white ">

                        <div className='text-6xl'>WELCOME!</div>

                        <div className='className=' absolute bottom-0 >
                            <img src={image} alt="Logo" />
                        </div>
                    </div>
                </div>
            </div>


            {/* Credential element */}
            <div id='credentials' className='flex flex-col gap-4 translate-x-[-200%] p-4 text-3xl'>
                <div>Username: {credential.username}</div>
                <div>Email: {credential.email}</div>
                <div>Password: {credential.password}</div>
                <div>City: {credential.city}</div>
            </div>

            {/* Login successfully card */}

            {isAccountCreated && (
                <div className="absolute left-0 top-0 right-0 bottom-0 w-full min-h-screen flex items-center justify-center px-4">
                    <div className="w-full max-w-md rounded-3xl shadow-2xl flex flex-col justify-center items-center p-6 bg-white relative transition-all duration-300">
                        <img
                            src={tick}
                            alt="Success"
                            className="w-20 h-20 shadow-2xl rounded-full absolute -top-10 bg-white"
                        />
                        <p className="mt-16 text-gray-700 text-2xl sm:text-3xl md:text-4xl font-semibold text-center">
                            Successfully Account Created
                        </p>
                        <button
                            onClick={downloadCredentialPDF}
                            className="mt-8 p-4 bg-[#009688] hover:bg-[#FF7043] text-white py-3 rounded-md transition-all duration-300"
                        >
                            Save Credentials
                        </button>
                    </div>
                </div>

            )}


        </>
    );
};

export default AdminSignup;