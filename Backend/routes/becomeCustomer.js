import * as dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import { Customer } from '../models/customerModel.js'
import { Wallet } from '../models/customerWalletModel.js'
import { CustomerWalletTransactions } from '../models/customerWalletTransactions.js'
import { UserOTP } from '../models/otpModel.js'
import bcrypt, { genSalt } from 'bcrypt'
import nodemailer from 'nodemailer'
import { ScheduleShip } from '../models/scheduleaShip.js'
import { Route } from '../models/route.js'
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding.js'
import { Rider } from '../models/riderModel.js'
const geocoder = mbxGeocoding({ accessToken: process.env.MAP_TOKEN });
const router = express.Router();


router.use(cors({
   origin: 'https://swiftlogix.cc',
   credentials: true

}));

router.use(express.json());

const requireLogin = ((req, res, next) => {
   if (!req.session.user) {
      return res.json({ success: false });
   }
   next()
})


//set email tranporter smtp
const transporter = nodemailer.createTransport({
   host: 'smtp.gmail.com',
   port: 465,
   auth: {
      user: 'fromswiftlogix@gmail.com',
      pass: 'uslf ubwr wfkb suoy'
   }
});


const sendOTPVerificationEmail = async ({ _id, email }) => {
   try {
      const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

      //mail options
      const mailOptions = {
         from: '"SWIFTLOGIX" <fromswiftlogix@gmail.com>',
         to: email,
         subject: 'Verify your email',
         html: `<p>Your OTP <b>${otp}</b></p> <p>Expire after 2 minutes</p>
          <p>Best regards,<br>
          <strong>The SWIFTLOGIX Team</strong>`
      }

      //hashOTP
      const salt = await genSalt(12);
      const hashOTP = await bcrypt.hash(otp, salt);
      const newUserOtp = await new UserOTP({
         userId: _id,
         otp: hashOTP,
         createdAt: Date.now(),
         expireAt: Date.now() + 2 * 60000
      })

      await newUserOtp.save();

      await transporter.sendMail(mailOptions)

      return true;

   } catch (error) {
      return false;
   }
}


const findOriginCityCordinates = async (originCity) => {
   try {
      const loglat = await geocoder.forwardGeocode({
         query: originCity,
         limit: 1
      }).send()

      const coordinates = loglat.body.features[0].geometry.coordinates;
      return { lat: coordinates[1], lng: coordinates[0] };
   } catch (error) {

   }
}

const findDestinationCityCordinates = async (destinationCity) => {
   try {
      const loglat = await geocoder.forwardGeocode({
         query: destinationCity,
         limit: 1
      }).send()

      const coordinates = loglat.body.features[0].geometry.coordinates;
      return { lat: coordinates[1], lng: coordinates[0] };
   } catch (error) {

   }
}



//here handle customer signup accounts
router.post('/signup', async (req, res) => {
   const initialRewardPoints = 50;
   let signupDetails = {
      name: req.body.name,
      email: req.body.email,
      mobileno: req.body.mobileno,
      password: req.body.password,
      verified: false,
      cnic: null,
      address: null
   }

   const emailExist = await Customer.findOne({ email: signupDetails.email });

   if (emailExist != null) {
      return res.json({ success: false, message: 'Email already exist!' })
   }
   const mobilenoExist = await Customer.findOne({ mobileno: signupDetails.mobileno });
   if (mobilenoExist != null) {
      return res.json({ success: false, message: 'Mobile no already exist!' })
   }

   if (!signupDetails.name || !signupDetails.email || !signupDetails.mobileno || !signupDetails.password) {
      return res.json({ success: false, message: 'All fields required' })
   }

   const salt = await genSalt(12);
   const hashPassword = await bcrypt.hash(signupDetails.password, salt);
   signupDetails.password = hashPassword;

   //added user in database
   const newCustomer = new Customer(signupDetails);
   await newCustomer.save();
   //added wallet of above user in database
   let now = new Date();
   let date = now.toLocaleDateString("en-PK", { timeZone: "Asia/Karachi" });
   let time = now.toLocaleTimeString("en-PK", { timeZone: "Asia/Karachi" });
   let datetime = `${date} ${time}`;
   const newWallet = new Wallet({
      customerid: newCustomer._id,
      points: initialRewardPoints,
   })
   await newWallet.save();
   //added intial reward points transaction in database
   const walletTransaction = await CustomerWalletTransactions({
      customerid: newCustomer._id,
      transactionAmount: initialRewardPoints,
      transactionType: 'Added',
      datetime: datetime
   })
   await walletTransaction.save();

   const isOTPSend = await sendOTPVerificationEmail(newCustomer);

   if (!isOTPSend) {
      return res.json({ success: false, message: 'OTP not sent' })

   }


   return res.json({ success: true, message: 'Signup Successfully', data: newCustomer })

})

//here handle customer logins
router.post('/login', async (req, res) => {
   const email = req.body.email;
   const password = req.body.password;

   const result = await Customer.findOne({ email: email })

   if (result != null) {
      const isMatched = await bcrypt.compare(password, result.password);
      if (isMatched) {
         if (!result.verified) {
            const otpResult = await UserOTP.findOne({ userId: result._id });
            if (otpResult != null) {
               if (otpResult.expireAt < Date.now()) {
                  await UserOTP.deleteMany({ userId: result._id });
                  const isOTPSend = await sendOTPVerificationEmail(result);

                  if (!isOTPSend) {
                     return res.json({ success: false, message: 'OTP not sent' })
                  }
               }
            } else {
               const isOTPSend = await sendOTPVerificationEmail(result);

               if (!isOTPSend) {
                  return res.json({ success: false, message: 'OTP not sent' })
               }
            }

            return res.json({ success: true, verification: 'PENDING', message: 'You are successfully logged in but email not verified!', data: result });
         }

         const sessionData = {
            name: result.name,
            email: result.email,
            mobileno: result.mobileno,
            password: result.password,
            cnic: result.cnic,
            address: result.address
         }
         req.session.userId = result._id;
         req.session.user = sessionData;
         req.session.visited = true;
         req.session.save();
         return res.json({ success: true, verification: 'VERIFIED', message: 'You are successfully logged in!', userData: sessionData });
      }
   }

   return res.json({ success: false, message: 'Credentials not matched! Try again' });
})


router.post('/verifyotp', async (req, res) => {
   const userId = req.body.userId
   const otpCode = req.body.otp;

   if (!userId || !otpCode) {
      console.log('error')
   }


   const result = await UserOTP.findOne({ userId: userId });
   if (result != null) {
      const isMatched = await bcrypt.compare(otpCode, result.otp);
      if (isMatched) {
         if (result.expireAt < Date.now()) {
            await UserOTP.deleteMany({ userId: userId });
            return res.json({ success: false, message: 'OTP has expired' })
         }
         await Customer.updateOne({ _id: userId }, { verified: true });
         await UserOTP.deleteMany({ userId: userId });
         const customer = await Customer.findOne({ _id: userId });

         const sessionData = {
            name: customer.name,
            email: customer.email,
            mobileno: customer.mobileno,
            password: customer.password,
            cnic: customer.cnic,
            address: customer.address
         }
         req.session.userId = customer._id;
         req.session.user = sessionData;
         req.session.visited = true;
         req.session.save();
         return res.json({ success: true, message: 'OTP Verified' });
      }

   }

   return res.json({ success: false, message: 'Invalid OTP!' })
})


router.post('/resendotp', async (req, res) => {
   const user = {
      _id: req.body.userId,
      email: req.body.email
   }

   try {
      // Delete any existing OTP records for the user
      await UserOTP.deleteMany({ userId: user._id });

      // Resend OTP
      const isOTPSent = await sendOTPVerificationEmail(user);

      if (isOTPSent === true) {
         return res.json({ success: true, message: 'OTP Resent Successfully' });
      } else {
         return res.json({ success: false, message: 'OTP not sent' });
      }
   } catch (error) {
      console.error('Error in resend OTP route:', error);
      return res.json({ success: false, message: 'Failed to resend OTP. Please try again.' });
   }
});


router.get('/customer-dashboard', requireLogin, async (req, res) => {
   const user = req.session.userId;

   try {
      const result = await Customer.findOne(
         {
            _id: user,
         }
      );
      const walletResult = await Wallet.findOne(
         {
            customerid: user,
         }
      );
      return res.status(200).json({ success: true, userData: result, points: walletResult.points });
   } catch (error) {
      return res.status(500).json({ success: false });
   }
});

router.get('/customer-profile', requireLogin, async (req, res) => {
   const user = req.session.userId;

   try {
      const result = await Customer.findOne(
         {
            _id: user
         }
      )
      return res.status(200).json({ success: true, userData: result })
   } catch (error) {
      return res.status(500).json({ success: false })
   }

});

router.get('/wallet', requireLogin, async (req, res) => {
   const user = req.session.userId;
   try {
      const walletResult = await Wallet.findOne(
         {
            customerid: user,
         }
      );
      const transactionResults = await CustomerWalletTransactions.find({
         customerid: user,
      })

      return res.json({ success: true, points: walletResult.points, transactions: transactionResults })
   } catch (error) {
      return res.status(500).json({ success: false });
   }

});

router.get('/customer-shipments', requireLogin, (req, res) => {
   res.json({ success: true, userData: req.session.user })
});

router.get('/customer-scheduleship', requireLogin, async (req, res) => {
   const user = req.session.userId;

   try {
      const result = await Customer.findOne(
         {
            _id: user
         }
      )
      const walletResult = await Wallet.findOne(
         {
            customerid: user,
         }
      );
      return res.status(200).json({ success: true, userData: result, points: walletResult.points })
   } catch (error) {
      return res.status(500).json({ success: false })
   }

});

router.get('/customer-ratecalculator', requireLogin, (req, res) => {
   res.json({ success: true, userData: req.session.user })
});

router.get('/customer-reprintlabel', requireLogin, (req, res) => {
   res.json({ success: true, userData: req.session.user })
});


router.patch('/add-cnic', async (req, res) => {
   const cnic = req.body.customerCnic;
   const user = req.session.userId;

   try {
      const cnicExist = await Customer.findOne({ cnic: cnic })
      if (cnicExist) {
         return res.json({ success: false, message: 'CNIC already exist' })
      }

      const result = await Customer.updateOne({ _id: user }, { $set: { cnic: cnic } });
      return res.json({ success: true })
   } catch (error) {
      return res.status(500).json({ success: false });
   }

})

router.patch('/add-address', async (req, res) => {
   const address = req.body.customerAddress;
   const user = req.session.userId;

   try {
      const result = await Customer.updateOne({ _id: user }, { $set: { address: address } });
      return res.json({ success: true })
   } catch (error) {
      return res.status(500).json({ success: false });
   }
})


router.post('/verifyedit-customer', async (req, res) => {
   try {

      const { editUserData } = req.body;
      const user = req.session.userId;
      const sendEmail = req.body.sendEmail;
      const mailData = {
         _id: editUserData._id,
         email: sendEmail
      }

      const isEmailExist = await Customer.findOne(
         {
            email: editUserData.email,
            _id: { $ne: user }
         },
      )
      if (isEmailExist) {
         return res.json({ success: false, message: 'Email already exist', name: 'email' })
      }

      const isMobileExist = await Customer.findOne(
         {
            mobileno: editUserData.mobileno,
            _id: { $ne: user }
         }
      )
      if (isMobileExist) {
         return res.json({ success: false, message: 'Mobile no already exist', name: 'mobileno' })
      }

      // Delete any existing OTP records for the user
      await UserOTP.deleteMany({ userId: mailData._id });

      const isOTPSend = await sendOTPVerificationEmail(mailData);
      return res.status(200).json({ success: true });
   } catch (error) {
      return res.status(500).json({ success: false })
   }

})

router.put('/saveedit-customer', async (req, res) => {
   const { editUserData } = req.body;
   const user = req.session.userId;

   try {
      if (!(editUserData.password === '********')) {
         const salt = await genSalt(12);
         const hashPassword = await bcrypt.hash(editUserData.password, salt);
         const result = await Customer.updateOne(
            {
               _id: user
            },
            {
               $set: {
                  name: editUserData.name,
                  email: editUserData.email,
                  mobileno: editUserData.mobileno,
                  password: hashPassword,
                  cnic: editUserData.cnic,
                  address: editUserData.address
               }
            }
         )

         if (result.modifiedCount === 0) {
            return res.json({ success: false, message: 'Update Unsuccessfully' })
         }
      } else {
         const result = await Customer.updateOne(
            {
               _id: user
            },
            {
               $set: {
                  name: editUserData.name,
                  email: editUserData.email,
                  mobileno: editUserData.mobileno,
                  cnic: editUserData.cnic,
                  address: editUserData.address
               }
            }
         )
         if (result.modifiedCount === 0) {
            return res.json({ success: false, message: 'Update Unsuccessfully' })
         }
      }




      return res.status(200).json({ success: true, message: 'Update Succesfuuly' });
   } catch (error) {
      return res.status(500).json({ success: false })
   }

})

router.post('/track-shipment', async (req, res) => {
   const trackingid = req.body.trackingId;

   try {
      const isExist = await ScheduleShip.findOne(
         {
            trackingid: trackingid
         }
      )
      if (!isExist) {
         return res.json({ success: false, message: 'Tracking id not exist' });
      }

      if (isExist && isExist.shipmentStatus === 'scheduled' && isExist.assigned === true) {
         return res.json({ success: false, message: 'Your Shipment assigned to rider. Try later! ' });
      } else if (isExist && isExist.shipmentStatus === 'scheduled' && isExist.assigned === false) {
         return res.json({ success: false, message: 'Tracking id not active. Try later!' });
      } else if (isExist && isExist.shipmentStatus === 'completed' && isExist.assigned === true) {
         return res.json({ success: false, message: 'Your Shipment Successfully Shipped!' });
      }

      const originCityCoords = await findOriginCityCordinates(isExist.originCity);
      const destinationCityCoords = await findDestinationCityCordinates(isExist.destinationCity);

      return res.status(200).json({
         success: true, message: 'Tracking id exist and in transit'
         , shipmentDetail: isExist, originCityCoords: originCityCoords, destinationCityCoords: destinationCityCoords
      })
   } catch (error) {
      return res.status(500).json({ success: false, message: 'Server Error' })
   }

})

router.post('/get-route-coordinates', async (req, res) => {
   const trackingid = req.body.trackingId;
   try {
      const result = await Route.findOne({ trackingid: trackingid });
      if (!result) {
         return res.status(404).json({ success: false, message: 'Tracking ID not exist' })
      }

      return res.status(200).json({ success: true, route: result })

   } catch (error) {
      return res.status(500).json({ success: false, message: 'Internal Server Error' })
   }
})


router.get('/logout', (req, res) => {
   req.session.destroy();
   res.json({ success: true, redirect: `${process.env.CLIENT_URL}/login` })
})

const genrateUserIDForgotPassword = () => {
   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   let userId = '';
   for (let i = 0; i < 8; i++) {
      userId += characters.charAt(Math.floor(Math.random() * characters.length));
   }

   return userId
}

router.post('/send-otp-forgot-password', async (req, res) => {
   try {

      const email = req.body.email;
      const type = req.body.type;
      let isFind = [];

      if (type === 'rider') {
         isFind = await Rider.find({
            email: email
         })
      } else if (type === 'customer') {
         isFind = await Customer.find({
            email: email
         })
      }

      if (!(isFind.length > 0)) {
         return res.json({ success: false, message: 'Email do not exist' })
      }

      const userId = genrateUserIDForgotPassword();
      const isSend = await sendOTPVerificationEmail({ _id: userId, email: email });
      if (!isSend) {
         return res.json({ success: false, message: 'Failed to send OTP. Try again' })
      }

      return res.json({ success: true, message: 'OTP send succesfully', userId: userId })
   } catch (error) {
      return res.json({ success: false, message: 'Failed to send OTP. Try again' })
   }
})


router.post('/verifyotp-forgot-password', async (req, res) => {
   try {
      const userId = req.body.userId
      const otpCode = req.body.otp;

      if (!userId || !otpCode) {
         console.log('error')
      }


      const result = await UserOTP.findOne({ userId: userId });
      if (result != null) {
         const isMatched = await bcrypt.compare(otpCode, result.otp);
         if (isMatched) {
            if (result.expireAt < Date.now()) {
               await UserOTP.deleteMany({ userId: userId });
               return res.json({ success: false, message: 'OTP has expired' })
            }

            await UserOTP.deleteMany({ userId: userId });

            return res.json({ success: true, message: 'OTP Verified' });
         }

      }

      return res.json({ success: false, message: 'Invalid OTP' })
   } catch (error) {
      return res.json({ success: false, message: 'OTP not verified. Try again' })
   }

})



router.post('/resendotp-forgot-password', async (req, res) => {
   const user = {
      _id: req.body.userId,
      email: req.body.email
   }

   try {
      // Delete any existing OTP records for the user
      await UserOTP.deleteMany({ userId: user._id });

      // Resend OTP
      const isOTPSent = await sendOTPVerificationEmail(user);

      if (isOTPSent === true) {
         return res.json({ success: true, message: 'OTP Resent Successfully' });
      } else {
         return res.json({ success: false, message: 'OTP not sent' });
      }
   } catch (error) {
      console.error('Error in resend OTP route:', error);
      return res.json({ success: false, message: 'Failed to resend OTP. Please try again.' });
   }
});


router.post('/create-new-password', async (req, res) => {
   try {
      const password = req.body.password;
      const confirmPassword = req.body.confirmPassword;
      const type = req.body.type;
      const email = req.body.email;

      if (password !== confirmPassword) {
         return res.json({ success: false, message: 'Passwords do not match.' })
      }

      const salt = await genSalt(12);
      const hashPassword = await bcrypt.hash(password, salt);

      if (type === 'rider') {
         const isUpdate = await Rider.updateOne(
            {
               email: email
            },
            {
               $set: { password: hashPassword }
            }
         )

      } else if (type === 'customer') {

         const isUpdate = await Customer.updateOne(
            {
               email: email
            },
            {
               $set: { password: hashPassword }
            }
         )
      }


      return res.status(200).json({ success: true, message: 'New password created' })
   } catch (error) {
      return res.status(500).json({ success: false, message: 'Failed to create new password. Try again' })
   }

})



export const BecomeCustomer = router;