import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import image from './icons/login.png'
import show from './icons/view.png'
import hide from './icons/hide.png'
import OTPCard from './OTPCard.jsx';
import tick from './icons/tick.svg'
import FadeInSection from './FadeInSection.jsx';


const RiderInformation = ({ onNext, setRiderInformation, riderInformation, error, setError }) => {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [otpCard, setOTPCard] = useState(false);
    const [otpVerified, setOTPVerified] = useState(false);

    const [currentUser, setCurrentUser] = useState({
        userId: '',
        name: '',
        email: '',
        mobileno: ''
    })


    const handleChange = (e) => {
        const { name, value } = e.target
        setRiderInformation({
            ...riderInformation,
            [name]: value
        })
        setError('')
    }


    const handleFileChange = (e) => {
        setError('');
        const { name, files } = e.target;
        const file = files[0];
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        const maxSize = 20 * 1024 * 1024; // 20 MB

        if (!validTypes.includes(file.type)) {
            setError('Only JPG, JPEG, or PNG files are allowed*');
            setRiderInformation({
                ...riderInformation,
                [name]: null,
            });
            return;
        }

        if (file.size > maxSize) {
            setError('File size must be under 20MB*');
            setRiderInformation({
                ...riderInformation,
                [name]: null,
            });
            return;
        }

        setRiderInformation({
            ...riderInformation,
            [name]: file,
        });
    };



    const handleSubmit = async (e) => {
        e.preventDefault();

        //Password length match
        if (riderInformation.password.length < 8) {
            setError('Password contain minimum 8 characters');
            return;
        }
        // Password match with confirm password
        if (riderInformation.password !== riderInformation.confirmpassword) {
            setError('Passwords do not match');
            return;
        }

        if (riderInformation.picture == null) {
            setError('Picture is required*')
            return
        }


        setError('');
        // Handle next step here
        onNext()


    };

    return (
        <>
            <FadeInSection delay={0.2}>
                <div className="flex justify-center w-full ">
                    <div className="left h-auto w-full md:w-1/2 mt-4  flex justify-center  ">
                        {/*  */}
                        <div className="w-full h-auto   p-8 bg-white rounded-[10px] shadow-lg ">
                            <h2 className="text-3xl text-gray-700 text-center mb-6 ">Sign Up</h2>
                            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                            <form onSubmit={handleSubmit} method='POST' enctype="multipart/form-data">
                                {/* Name Field */}
                                <h3 className="text-xl font-semibold mb-4 text-gray-700">Rider Information</h3>
                                <div className='flex w-full justify-around gap-8'>
                                    <div className='w-full'>
                                        <div className="mb-4">
                                            <input
                                                type="text"
                                                value={riderInformation.name}
                                                name='name'
                                                onChange={handleChange}
                                                className="w-full p-3 border rounded-md focus:outline-none"
                                                placeholder="Name"
                                                required

                                            />
                                        </div>

                                        {/* Email Field */}
                                        <div className="mb-4">
                                            <input
                                                type="email"
                                                value={riderInformation.email}
                                                name='email'
                                                onChange={handleChange}
                                                className="w-full p-3 border rounded-md focus:outline-none"
                                                placeholder="Email Address"
                                                required
                                            />
                                        </div>
                                        {/* Cnic Field */}
                                        <div className="mb-4">
                                            <input
                                                type="text"
                                                value={riderInformation.cnic}
                                                name='cnic'
                                                onChange={handleChange}
                                                className="w-full p-3 border rounded-md focus:outline-none"
                                                placeholder="CNIC"
                                                required
                                                maxLength={13}
                                                minLength={13}
                                            />
                                        </div>
                                        {/* Mobile no Field */}
                                        <div className="mb-4">
                                            <input
                                                type="text"
                                                value={riderInformation.mobileno}
                                                name='mobileno'
                                                onChange={handleChange}
                                                className="w-full p-3 border rounded-md focus:outline-none"
                                                placeholder="Mobile No"
                                                required
                                                maxLength={11}
                                                minLength={11}
                                            />
                                        </div>
                                        {/* Date of Birth Field */}
                                        <div className="mb-4 mt-8">
                                            <span className='text-gray-700 mb-2  font-semibold'>Date of Birth:</span>
                                            <input
                                                type="date"
                                                value={riderInformation.dateofbirth}
                                                name='dateofbirth'
                                                onChange={handleChange}
                                                className="w-full p-3 border rounded-md focus:outline-none"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className='w-full'>
                                        {/* Password Field */}
                                        <div className="mb-4 relative">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={riderInformation.password}
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
                                                value={riderInformation.confirmpassword}
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

                                        <select required name="city" id="city" onChange={handleChange} value={riderInformation.city} className='mb-3 w-full border p-2 rounded-md'>
                                            <option value="" disabled selected>-- Select City -- (as per CNIC)</option>
                                            <optgroup label="Punjab">
                                                <option value="lahore">Lahore</option>
                                                <option value="faisalabad">Faisalabad</option>
                                                <option value="rawalpindi">Rawalpindi</option>
                                                <option value="gujranwala">Gujranwala</option>
                                                <option value="multan">Multan</option>
                                                <option value="sargodha">Sargodha</option>
                                                <option value="bahawalpur">Bahawalpur</option>
                                                <option value="sialkot">Sialkot</option>
                                                <option value="rahim-yar-khan">Rahim Yar Khan</option>
                                                <option value="sheikhupura">Sheikhupura</option>
                                                <option value="kasur">Kasur</option>
                                                <option value="okara">Okara</option>
                                                <option value="sahiwal">Sahiwal</option>
                                                <option value="gujrat">Gujrat</option>
                                                <option value="jhelum">Jhelum</option>
                                                <option value="mianwali">Mianwali</option>
                                                <option value="daska">Daska</option>
                                                <option value="vehari">Vehari</option>
                                                <option value="bahawalnagar">Bahawalnagar</option>
                                                <option value="pakpattan">Pakpattan</option>
                                                <option value="khushab">Khushab</option>
                                                <option value="khanewal">Khanewal</option>
                                                <option value="muzaffargarh">Muzaffargarh</option>
                                                <option value="dera-ghazi-khan">Dera Ghazi Khan</option>
                                                <option value="sadiqabad">Sadiqabad</option>
                                                <option value="burewala">Burewala</option>
                                                <option value="kamoke">Kamoke</option>
                                                <option value="hafizabad">Hafizabad</option>
                                                <option value="mandi-bahauddin">Mandi Bahauddin</option>
                                                <option value="jhang">Jhang</option>
                                                <option value="toba-tek-singh">Toba Tek Singh</option>
                                                <option value="chichawatni">Chichawatni</option>
                                                <option value="chinniot">Chiniot</option>
                                                <option value="narowal">Narowal</option>
                                                <option value="shakargarh">Shakargarh</option>
                                                <option value="mailsi">Mailsi</option>
                                                <option value="kot-addu">Kot Addu</option>
                                                <option value="layyah">Layyah</option>
                                                <option value="lodhran">Lodhran</option>
                                                <option value="ahmadpur-east">Ahmadpur East</option>
                                                <option value="kamalia">Kamalia</option>
                                                <option value="kharian">Kharian</option>
                                                <option value="chakwal">Chakwal</option>
                                                <option value="bhakkar">Bhakkar</option>
                                                <option value="attock">Attock</option>
                                                <option value="sargodha">Sargodha</option>
                                            </optgroup>
                                            <optgroup label="Sindh">
                                                <option value="karachi">Karachi</option>
                                                <option value="hyderabad">Hyderabad</option>
                                                <option value="sukkur">Sukkur</option>
                                                <option value="larkana">Larkana</option>
                                                <option value="mirpur-khas">Mirpur Khas</option>
                                                <option value="nawabshah">Nawabshah</option>
                                                <option value="jacobabad">Jacobabad</option>
                                                <option value="shikarpur">Shikarpur</option>
                                                <option value="khairpur">Khairpur</option>
                                                <option value="dadu">Dadu</option>
                                                <option value="tando-adam">Tando Adam</option>
                                                <option value="tando-allahyar">Tando Allahyar</option>
                                                <option value="tando-muhammad-khan">Tando Muhammad Khan</option>
                                                <option value="badin">Badin</option>
                                                <option value="matli">Matli</option>
                                                <option value="sanghar">Sanghar</option>
                                                <option value="kashmore">Kashmore</option>
                                                <option value="guddu">Guddu</option>
                                                <option value="ratodero">Ratodero</option>
                                                <option value="umerkot">Umerkot</option>
                                                <option value="mithi">Mithi</option>
                                                <option value="ghotki">Ghotki</option>
                                                <option value="kamber">Kamber</option>
                                                <option value="kotri">Kotri</option>
                                                <option value="mirpur-mathelo">Mirpur Mathelo</option>
                                                <option value="naushahro-firoz">Naushahro Firoz</option>
                                                <option value="sewan">Sewan</option>
                                                <option value="thatta">Thatta</option>
                                                <option value="jamshoro">Jamshoro</option>
                                                <option value="tando-bago">Tando Bago</option>
                                            </optgroup>
                                            <optgroup label="Khyber Pakhtunkhwa">
                                                <option value="peshawar">Peshawar</option>
                                                <option value="mardan">Mardan</option>
                                                <option value="abbottabad">Abbottabad</option>
                                                <option value="kohat">Kohat</option>
                                                <option value="dera-ismail-khan">Dera Ismail Khan</option>
                                                <option value="swat">Swat</option>
                                                <option value="mingora">Mingora</option>
                                                <option value="charsadda">Charsadda</option>
                                                <option value="nowshera">Nowshera</option>
                                                <option value="mansehra">Mansehra</option>
                                                <option value="bannu">Bannu</option>
                                                <option value="haripur">Haripur</option>
                                                <option value="swabi">Swabi</option>
                                                <option value="lakki-marwat">Lakki Marwat</option>
                                                <option value="batkhela">Batkhela</option>
                                                <option value="chitral">Chitral</option>
                                                <option value="dir">Dir</option>
                                                <option value="karak">Karak</option>
                                                <option value="tank">Tank</option>
                                                <option value="hangu">Hangu</option>
                                                <option value="shangla">Shangla</option>
                                                <option value="battagram">Battagram</option>
                                                <option value="malakand">Malakand</option>
                                                <option value="lower-dir">Lower Dir</option>
                                                <option value="upper-dir">Upper Dir</option>
                                                <option value="buner">Buner</option>
                                                <option value="torghar">Torghar</option>
                                                <option value="kolai-palas">Kolai Palas</option>
                                            </optgroup>
                                            <optgroup label="Balochistan">
                                                <option value="quetta">Quetta</option>
                                                <option value="khuzdar">Khuzdar</option>
                                                <option value="turban">Turbat</option>
                                                <option value="gwadar">Gwadar</option>
                                                <option value="sibi">Sibi</option>
                                                <option value="loralai">Loralai</option>
                                                <option value="mastung">Mastung</option>
                                                <option value="zhob">Zhob</option>
                                                <option value="chaman">Chaman</option>
                                                <option value="dalbandin">Dalbandin</option>
                                                <option value="dureji">Dureji</option>
                                                <option value="kalat">Kalat</option>
                                                <option value="panjgur">Panjgur</option>
                                                <option value="nushki">Nushki</option>
                                                <option value="dadu">Dadu</option>
                                                <option value="lasbela">Lasbela</option>
                                                <option value="kharan">Kharan</option>
                                                <option value="washuk">Washuk</option>
                                                <option value="kech">Kech</option>
                                                <option value="aawar">Awaran</option>
                                            </optgroup>
                                            <optgroup label="Islamabad Capital Territory">
                                                <option value="islamabad">Islamabad</option>
                                            </optgroup>
                                            <optgroup label="Azad Jammu & Kashmir">
                                                <option value="muzaffarabad">Muzaffarabad</option>
                                                <option value="mirpur">Mirpur</option>
                                                <option value="kotli">Kotli</option>
                                                <option value="bhimber">Bhimber</option>
                                                <option value="rawalakot">Rawalakot</option>
                                                <option value="bagh">Bagh</option>
                                                <option value="pallandri">Pallandri</option>
                                                <option value="hattian-bala">Hattian Bala</option>
                                                <option value="haveli">Haveli</option>
                                            </optgroup>
                                            <optgroup label="Gilgit-Baltistan">
                                                <option value="gilgit">Gilgit</option>
                                                <option value="skardu">Skardu</option>
                                                <option value="hunza">Hunza</option>
                                                <option value="ghizer">Ghizer</option>
                                                <option value="ghanche">Ghanche</option>
                                                <option value="diamir">Diamir</option>
                                                <option value="astore">Astore</option>
                                                <option value="shigar">Shigar</option>
                                                <option value="kharmang">Kharmang</option>
                                                <option value="nagar">Nagar</option>
                                            </optgroup>
                                        </select>

                                        <div className="mb-4">
                                            <textarea
                                                value={riderInformation.address}
                                                name='address'
                                                onChange={handleChange}
                                                className="w-full p-3 border rounded-md focus:outline-none"
                                                placeholder="Full Address"
                                                required
                                            >
                                            </textarea>
                                        </div>
                                        <div className="mb-4">
                                            <span className='text-gray-700 mb-2 font-semibold'>Picture:</span>
                                            <input
                                                type="file"
                                                name="picture"
                                                onChange={handleFileChange}
                                                className="w-full p-3 border rounded-md focus:outline-none"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Sign Up Button */}
                                <div className='w-full flex justify-center'>
                                    <button
                                        type='submit'
                                        className="text-center bg-[#009688] font-semibold hover:bg-[#FF7043] text-white py-3 px-12 rounded-md mb-4 transition-all duration-300"
                                    >
                                        Next
                                    </button>
                                </div>


                                {/* Login Link */}
                                <p className="text-center text-sm">
                                    Already have an account?{' '}
                                    <NavLink to='/rider-login'>
                                        <a href="/login" className="text-[#FF7043]">Login</a>
                                    </NavLink>
                                </p>
                            </form>
                        </div>
                    </div>

                    {/* Hidden not used */}
                    <div className="hidden right w-[50%] h-[100%]  justify-center items-center">
                        <div className="bg-[#FF7043] w-[70%] h-[80%] rounded-[60px] flex flex-col pt-4 justify-around items-center relative text-white ">

                            <div className='text-6xl'>WELCOME!</div>

                            <div className='className=' absolute bottom-0 >
                                <img src={image} alt="Logo" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Login successfully card */}

                {otpVerified && (
                    <div className='w-full flex justify-center absolute top-[50%]'>
                        <div className='w-[30%]  rounded-3xl shadow-2xl flex justify-center items-center flex-col p-5 relative bg-white transition-all duration-300'>
                            <img src={tick} alt="Success" className='w-20 shadow-2xl rounded-full absolute top-[-36px]' />
                            <p className='mt-16 text-gray-700 text-[44px] font-semibold text-center'>You are successfully Signed up!</p>
                        </div>
                    </div>
                )}
            </FadeInSection>
            {/* OTP CARD */}
            {otpCard && <OTPCard email={currentUser.email} userId={currentUser.userId} setOTPCard={setOTPCard} setOTPVerified={setOTPVerified} navigate={handleNavigateToDashBoard} />}

        </>
    );
};

export default RiderInformation;