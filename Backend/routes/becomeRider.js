import * as dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { Rider } from '../models/riderModel.js'
import { Wallet } from '../models/customerWalletModel.js'
import { UserOTP } from '../models/otpModel.js'
import { ScheduleShip } from '../models/scheduleaShip.js'
import { DeliverShipment } from '../models/deliverShipment.js'
import { RiderWallet } from '../models/riderWalletModel.js'
import { RiderWalletTransactions } from '../models/riderWalletTransactions.js'
import { CustomerWalletTransactions } from '../models/customerWalletTransactions.js'
import bcrypt, { genSalt } from 'bcrypt'
import { Route } from '../models/route.js'
import nodemailer from 'nodemailer'
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding.js'
const geocoder = mbxGeocoding({ accessToken: process.env.MAP_TOKEN });
const router = express.Router();

router.use(cors({
   origin: 'https://swiftlogix.cc',
   credentials: true
}));

router.use(express.json());
router.use(express.urlencoded({ extended: true }));


const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, 'uploads/');
   },
   filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
   }
});

const fileFilter = (req, file, cb) => {
   const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
   if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
   } else {
      cb(new Error('Invalid file type. Only JPG, JPEG, and PNG are allowed.'), false);
   }
};

const upload = multer({
   storage: storage,
   limits: { fileSize: 20 * 1024 * 1024 },
   fileFilter: fileFilter
});

cloudinary.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET,
});


//set email tranporter smtp
const transporter = nodemailer.createTransport({
   host: 'smtp.gmail.com',
   port: 465,
   auth: {
      user: 'fromswiftlogix@gmail.com',
      pass: 'uslf ubwr wfkb suoy'
   }
});

const requireLogin = ((req, res, next) => {
   if (!req.session.user) {
      return res.json({ success: false });
   }
   next()
})

//send otp email to user
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

const sendAcceptEmail = async (email, originCity, destinationCity, trackingid) => {

   try {
      //mail options
      const mailOptions = {
         from: '"SWIFTLOGIX" <fromswiftlogix@gmail.com>',
         to: email,
         subject: 'About Shipment Status',
         html: `<p>Rider has been assigned to your shipment.</p>
                <big><b>Details</b></big>
                <p><b>Tracking ID:</b> ${trackingid}<p/>
                <p><b>From:</b> ${originCity}<p/>
                <p><b>To:</b> ${destinationCity}<p/>
                <p>Best regards,<br>
                <strong>The SWIFTLOGIX Team</strong>`
      }

      await transporter.sendMail(mailOptions)

      return true;

   } catch (error) {
      return false;
   }
}

const sendPickedEmail = async (email, originCity, destinationCity, trackingid) => {

   try {
      //mail options
      const mailOptions = {
         from: '"SWIFTLOGIX" <fromswiftlogix@gmail.com>',
         to: email,
         subject: 'About Shipment Status',
         html: `<p>Your Shipment is in Transit. Now, you can live track your shipment.</p>
                <big><b>Details</b></big>
                <p><b>Tracking ID:</b> ${trackingid}<p/>
                <p><b>From:</b> ${originCity}<p/>
                <p><b>To:</b> ${destinationCity}<p/>
                <p>Best regards,<br>
                <strong>The SWIFTLOGIX Team</strong>`
      }

      await transporter.sendMail(mailOptions)

      return true;

   } catch (error) {
      return false;
   }
}

const sendCompletedEmail = async (email, originCity, destinationCity, trackingid) => {

   try {
      //mail options
      const mailOptions = {
         from: '"SWIFTLOGIX" <fromswiftlogix@gmail.com>',
         to: email,
         subject: 'About Shipment Status',
         html: `<p>Congratulations, your shipment has arrived at its destination. Please collect your parcel from the
                <b>SWIFTLOGIX</b> warehouse. Thank you!</p>
                <big><b>Details</b></big>
                <p><b>Tracking ID:</b> ${trackingid}<p/>
                <p><b>From:</b> ${originCity}<p/>
                <p><b>To:</b> ${destinationCity}<p/>
                <p>Best regards,<br>
                <strong>The SWIFTLOGIX Team</strong>`
      }

      await transporter.sendMail(mailOptions)

      return true;

   } catch (error) {
      return false;
   }
}


const sendRiderAccountUpdateNotification = async (riderStatus, email, name) => {

   try {
      let mailOptions = null;
      if (riderStatus === 'active') {
         //mail options
         mailOptions = {
            from: '"SWIFTLOGIX" <fromswiftlogix@gmail.com>',
            to: email,
            subject: 'Update on Your SwiftLogix Account Application',
            html: `<p>Dear ${name},</p>
                            <p>
                               We’re excited to welcome you to <strong> SwiftLogix!.</strong>.
                            </p>
                            <p>
                                Your account is active now.
                            </p>
                            <p>
                                Thank you for choosing SWIFTLOGIX. If you have any questions or need further assistance, feel free to contact our customer support team.
                            </p>
                            <p>Best regards,<br>
                            <strong>The SWIFTLOGIX Team</strong></p>`
         }
      } else if (riderStatus === 'rejected') {
         //mail options
         mailOptions = {
            from: '"SWIFTLOGIX" <fromswiftlogix@gmail.com>',
            to: email,
            subject: 'Update on Your SwiftLogix Account Application',
            html: `<p>Dear ${name},</p>
                            <p>
                               Thank you for your interest in becoming a partner with <strong> SwiftLogix!.</strong>.
                            </p>
                            <p>
                               After carefully reviewing your application, we regret to inform you that we are unable to approve your account at this time.
                            </p>
                            <p>
                                Please know this decision was made based on your given information.
                            </p>
                            <p>Best regards,<br>
                            <strong>The SWIFTLOGIX Team</strong></p>`
         }
      }

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


//here handle rider signup accounts
router.post('/rider-signup', upload.fields([
   { name: 'drivingLicenseFront', maxCount: 1 },
   { name: 'drivingLicenseBack', maxCount: 1 },
   { name: 'vehicleCardFront', maxCount: 1 },
   { name: 'vehicleCardBack', maxCount: 1 },
   { name: 'cnicFront', maxCount: 1 },
   { name: 'cnicBack', maxCount: 1 },
   { name: 'picture', maxCount: 1 },
]), async (req, res) => {
   const initialRewardPoints = 50;
   const active = 'pending';
   const stars = 3;
   let signupDetails = {
      name: req.body.name,
      email: req.body.email,
      cnic: req.body.cnic,
      mobileno: req.body.mobileno,
      password: req.body.password,
      city: req.body.city,
      address: req.body.address,
      dateofbirth: req.body.dateofbirth,
      picture: '',
      vehicleType: req.body.vehicleType,
      vehicleMake: req.body.vehicleMake,
      vehicleModel: req.body.vehicleModel,
      vehicleNumberPlate: req.body.vehicleNumberPlate,
      drivingLicenseFront: '',
      drivingLicenseBack: '',
      vehicleCardFront: '',
      vehicleCardBack: '',
      cnicFront: '',
      cnicBack: '',
      active: active,
      datetime: '',
      verified: false,
      stars: stars
   }

   if (!signupDetails.name || !signupDetails.email || !signupDetails.mobileno || !signupDetails.password || !signupDetails.dateofbirth
      || !signupDetails.vehicleType || !signupDetails.vehicleMake || !signupDetails.vehicleModel || !signupDetails.vehicleNumberPlate
   ) {
      return res.json({ success: false, message: 'All fields required' })
   }

   const salt = await genSalt(12);
   const hashPassword = await bcrypt.hash(signupDetails.password, salt);
   signupDetails.password = hashPassword;

   if (!(req.files['drivingLicenseFront'])) {
      return res.json({ success: false, message: 'Driving License front side is required' })
   }

   if (!(req.files['drivingLicenseBack'])) {
      return res.json({ success: false, message: 'Driving License back side is required' })
   }

   if (!(req.files['vehicleCardFront'])) {
      return res.json({ success: false, message: 'Vehicle card front side is required' })
   }

   if (!(req.files['vehicleCardBack'])) {
      return res.json({ success: false, message: 'Vehicle card back side is required' })
   }

   if (!(req.files['cnicFront'])) {
      return res.json({ success: false, message: 'CNIC front side is required' })
   }

   if (!(req.files['cnicBack'])) {
      return res.json({ success: false, message: 'CNIC back side is required' })
   }

   if (!(req.files['picture'])) {
      return res.json({ success: false, message: 'Picture is required' })
   }

   //upload drivingLicenseFront
   const filePathdrivingLicenseFront = req.files['drivingLicenseFront'][0].path;
   const resultdrivingLicenseFront = await cloudinary.uploader.upload(filePathdrivingLicenseFront, {
      folder: 'drivingLicense'
   });
   signupDetails.drivingLicenseFront = resultdrivingLicenseFront.secure_url;
   // upload drivingLicenseBack
   const filePathdrivingLicenseBack = req.files['drivingLicenseBack'][0].path;
   const resultdrivingLicenseBack = await cloudinary.uploader.upload(filePathdrivingLicenseBack, {
      folder: 'drivingLicense'
   });
   signupDetails.drivingLicenseBack = resultdrivingLicenseBack.secure_url;
   // upload vehicleCardFront
   const filePathvehicleCardFront = req.files['vehicleCardFront'][0].path;
   const resultvehicleCardFront = await cloudinary.uploader.upload(filePathvehicleCardFront, {
      folder: 'vehicleCard'
   });
   signupDetails.vehicleCardFront = resultvehicleCardFront.secure_url;
   // upload vehicleCardBack
   const filePathvehicleCardBack = req.files['vehicleCardBack'][0].path;
   const resultvehicleCardBack = await cloudinary.uploader.upload(filePathvehicleCardBack, {
      folder: 'vehicleCard'
   });
   signupDetails.vehicleCardBack = resultvehicleCardBack.secure_url;
   // upload cnicFront
   const filePathcnicFront = req.files['cnicFront'][0].path;
   const resultcnicFront = await cloudinary.uploader.upload(filePathcnicFront, {
      folder: 'CNIC'
   });
   signupDetails.cnicFront = resultcnicFront.secure_url;
   // upload cnicBack
   const filePathcnicBack = req.files['cnicBack'][0].path;
   const resultcnicBack = await cloudinary.uploader.upload(filePathcnicBack, {
      folder: 'CNIC'
   });
   signupDetails.cnicBack = resultcnicBack.secure_url;
   // upload picture
   const filePathpicture = req.files['picture'][0].path;
   const resultpicture = await cloudinary.uploader.upload(filePathpicture, {
      folder: 'Rider Picture'
   });
   signupDetails.picture = resultpicture.secure_url;
   fs.unlinkSync(filePathdrivingLicenseFront);
   fs.unlinkSync(filePathdrivingLicenseBack);
   fs.unlinkSync(filePathvehicleCardFront);
   fs.unlinkSync(filePathvehicleCardBack);
   fs.unlinkSync(filePathcnicFront);
   fs.unlinkSync(filePathcnicBack);
   fs.unlinkSync(filePathpicture);

   let now = new Date();
   let date = now.toLocaleDateString("en-PK", { timeZone: "Asia/Karachi" });
   let time = now.toLocaleTimeString("en-PK", { timeZone: "Asia/Karachi" });
   let datetime = `${date} ${time}`;
   signupDetails.datetime = datetime;
   //added rider in database
   const newRider = new Rider(signupDetails);
   await newRider.save();
   //added wallet of above user in database
   const newWallet = new RiderWallet({
      riderid: newRider._id,
      points: initialRewardPoints,
   })
   await newWallet.save();
   //added intial reward points transaction in database
   const walletTransaction = await RiderWalletTransactions({
      riderid: newRider._id,
      transactionAmount: initialRewardPoints,
      transactionType: 'Added',
      datetime: datetime
   })
   await walletTransaction.save();

   const isOTPSend = await sendOTPVerificationEmail(newRider);

   if (!isOTPSend) {
      return res.json({ success: false, message: 'OTP not sent' })

   }


   return res.json({ success: true, message: 'Signup Successfully', riderData: newRider })

})


router.post('/verify-riderdataexist', async (req, res) => {
   let riderInformation = {
      name: req.body.riderInformation.name,
      email: req.body.riderInformation.email,
      cnic: req.body.riderInformation.cnic,
      mobileno: req.body.riderInformation.mobileno,
      password: req.body.riderInformation.password,
   }

   const emailExist = await Rider.findOne({ email: riderInformation.email });

   if (emailExist != null) {
      return res.json({ success: true, message: 'Email already exist!' })
   }
   const cnicExist = await Rider.findOne({ cnic: riderInformation.cnic });
   if (cnicExist != null) {
      return res.json({ success: true, message: 'CNIC already exist!' })
   }
   const mobilenoExist = await Rider.findOne({ mobileno: riderInformation.mobileno });
   if (mobilenoExist != null) {
      return res.json({ success: true, message: 'Mobile no already exist!' })
   }


   return res.json({ success: false })

})

router.post('/rider-verifyotp', async (req, res) => {
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
         await Rider.updateOne({ _id: userId }, { verified: true });
         await UserOTP.deleteMany({ userId: userId });
         const rider = await Rider.findOne({ _id: userId });

         const sessionData = {
            name: rider.name,
            email: rider.email,
            mobileno: rider.mobileno,
            cnic: rider.cnic,
         }
         req.session.userId = rider._id;
         req.session.user = sessionData;
         req.session.visited = true;
         req.session.save();
         return res.json({ success: true, message: 'OTP Verified' });
      }

   }

   return res.json({ success: false, message: 'Invalid OTP!' })
})


router.post('/rider-resendotp', async (req, res) => {
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


//here handle rider logins
router.post('/rider-login', async (req, res) => {
   const email = req.body.email;
   const password = req.body.password;

   const result = await Rider.findOne({ email: email })

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

         if (result.active === "pending") {
            return res.json({ success: false, message: 'Your verification is currently in process and will be completed within 24 hours of registration.' })
         }

         if (result.active === "rejected") {
            return res.json({ success: false, message: 'Account is blocked.' })
         }

         const sessionData = {
            name: result.name,
            email: result.email,
            mobileno: result.mobileno,
            password: result.password,
            cnic: result.cnic,
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

router.get('/rider-dashboard', requireLogin, async (req, res) => {
   const user = req.session.userId;

   try {
      const result = await Rider.findOne(
         {
            _id: user,
         }
      );
      //   const walletResult = await Wallet.findOne(
      //      {
      //         customerid: user,
      //      }
      //   );
      return res.status(200).json({ success: true, userData: result });
   } catch (error) {
      return res.status(500).json({ success: false });
   }
});

router.get('/rider-profile', requireLogin, async (req, res) => {
   const user = req.session.userId;

   try {
      const result = await Rider.findOne(
         {
            _id: user
         }
      )
      return res.status(200).json({ success: true, userData: result })
   } catch (error) {
      return res.status(500).json({ success: false })
   }

});

router.get('/rider-wallet', requireLogin, async (req, res) => {
   const riderid = req.session.userId;
   try {
      const userData = await Rider.findOne(
         {
            _id: riderid
         }
      )
      const walletResult = await RiderWallet.findOne(
         {
            riderid: riderid,
         }
      );
      const transactionResults = await RiderWalletTransactions.find({
         riderid: riderid,
      })

      return res.json({ success: true, points: walletResult.points, transactions: transactionResults, userData: userData })
   } catch (error) {
      return res.status(500).json({ success: false });
   }

});

router.get('/rider-shipments', requireLogin, (req, res) => {
   res.json({ success: true })
});

router.post('/get-deliveries', async (req, res) => {
   const riderCity = req.body.currentCity;
   const shipmentStatus = 'dropped';
   const assigned = false;
   if (!riderCity) {
      return res.json({ success: false, message: 'Rider location not provided' })
   }

   try {
      const result = await ScheduleShip.find({ originCity: riderCity, assigned: assigned, shipmentStatus: shipmentStatus });
      const deliveries = result.map((shipment) => ({
         shipmentid: shipment?._id,
         trackingid: shipment?.trackingid,
         originCity: shipment?.originCity,
         destinationCity: shipment?.destinationCity,
         senderemail: shipment?.senderemail,
         weight: shipment?.weight,
         pieces: shipment?.pieces,
         deliveryDate: shipment?.deliveryDate,
         totalPrice: shipment?.totalPrice ? Math.floor(shipment.totalPrice * 0.80) : 0
      }));
      return res.json({ success: true, deliveries: deliveries });
   } catch (error) {
      return res.status(500).json({ success: false });
   }


})

router.post('/assigned-delivery', async (req, res) => {
   const riderId = req.session.userId;
   const deliveryStatus = 'accepted';
   const trackingId = req.body.trackingid;
   const originCity = req.body.originCity;
   const destinationCity = req.body.destinationCity;
   const senderemail = req.body.senderemail;
   const now = new Date();

   try {
      const isRiderExist = await DeliverShipment.find({
         riderid: riderId,
         deliveryStatus: deliveryStatus
      })

      if (isRiderExist.length > 0) {
         const isSameDestination = await DeliverShipment.find({
            riderid: riderId,
            destinationCity: req.body.destinationCity,
            deliveryStatus: deliveryStatus
         })


         if (!(isSameDestination.length > 0)) {
            return res.json({ success: false, message: 'You only accepted multiple shipments with same destination city.' });
         }
      }

      const assignResult = await ScheduleShip.updateOne(
         { _id: req.body.shipmentid, assigned: false },
         { $set: { assigned: true, shipmentStatus: deliveryStatus } }
      );

      if (assignResult.modifiedCount === 0) {
         return res.json({ success: false, message: 'This shipment is already assigned to another rider.' });
      }


      const newDeliverShipment = new DeliverShipment({
         trackingid: req.body.trackingid,
         riderid: riderId,
         shipmentid: req.body.shipmentid,
         originCity: req.body.originCity,
         destinationCity: req.body.destinationCity,
         weight: req.body.weight,
         pieces: req.body.pieces,
         deliveryDate: req.body.deliveryDate,
         price: req.body.totalPrice,
         deliveryStatus: deliveryStatus,
         createdAt: now,
      })

      await newDeliverShipment.save();

      res.json({ success: true, message: 'Shipment assigned successfully.' });
   } catch (error) {
      return res.status(500).json({ success: false, message: 'Shipment assigned unsuccessfully.' });
   }

})

router.post('/get-rider-shipments', async (req, res) => {
   try {
      const riderId = req.session.userId;
      const selectedCard = req.body.selectedCard;

      const shipments = await DeliverShipment.find({
         riderid: riderId,
         deliveryStatus: selectedCard
      });

      res.json({ success: true, shipments: shipments });
   } catch (error) {
      console.error('Error fetching shipments:', error);
      res.status(500).json({ success: false, message: "Server error" });
   }
})


router.post('/rider-picked', async (req, res) => {
   const trackingId = req.body.trackingId.trackingId;
   const originCity = req.body.packageFormData.originCity;
   const destinationCity = req.body.packageFormData.destinationCity;
   const senderemail = req.body.senderFormData.senderemail;

   try {
      const deliverShipment = await DeliverShipment.updateOne({ trackingid: trackingId }
         , { $set: { deliveryStatus: 'pending' } }
      );
      const scheduleaShip = await ScheduleShip.updateOne({ trackingid: trackingId },
         { $set: { shipmentStatus: 'pending' } }
      )

      await sendPickedEmail(senderemail, originCity, destinationCity, trackingId);
      return res.status(200).json({ success: true, message: 'Shipment Status Updated' });
   } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
   }
})

router.get('/check-pick-shipment', async (req, res) => {
   const riderid = req.session.userId;

   try {
      const transitShipments = await DeliverShipment.find(
         {
            riderid: riderid,
            deliveryStatus: 'pending'
         }
      )

      if (!transitShipments) {
         return json({ success: false, message: 'Rider not in transit' });
      }

      const originCityCoords = await findOriginCityCordinates(transitShipments[0].originCity)
      const destinationCityCoords = await findDestinationCityCordinates(transitShipments[0].destinationCity)

      return res.status(200).json({
         success: true, message: 'Rider in transit',
         transitShipments: transitShipments, originCityCoords: originCityCoords,
         destinationCityCoords: destinationCityCoords
      });
   } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
   }
})

router.post('/shipment-completed', async (req, res) => {
   const riderid = req.session.userId;
   const transitShipments = req.body.transitShipments;
   const customerRewardPoints = 50; // customer reward

   try {
      //get all shipment details
      const shipments = await Promise.all(
         transitShipments.map(async (shipment) => (
            await ScheduleShip.findOneAndUpdate(
               { _id: shipment.shipmentid },
               { $set: { totalPrice: shipment.price } },
               { new: true }
            ).exec()
         ))
      );

      //  update all shipments status customer and rider
      await Promise.all(
         shipments.map(async (shipment) => {
            try {
               // Update ScheduleShip status to 'completed'
               await ScheduleShip.updateOne(
                  { _id: shipment._id },
                  { $set: { shipmentStatus: 'completed' } }
               );

               // Update DeliverShipment status to 'completed'
               await DeliverShipment.updateOne(
                  { shipmentid: shipment._id },
                  { $set: { deliveryStatus: 'completed' } }
               );

               // Get rider wallet details
               const riderWallet = await RiderWallet.findOne({ riderid: riderid });
               // Get customer wallet details
               const customerWallet = await Wallet.findOne({ customerid: shipment.customerid });
               // Check if the customer wallet exists
               if (customerWallet && riderWallet) {
                  //update customer wallet
                  const updatedCustomerReward = Number(customerWallet.points) + Number(customerRewardPoints);
                  await Wallet.updateOne(
                     { customerid: shipment.customerid },
                     { $set: { points: updatedCustomerReward } }
                  );
                  //update rider wallet
                  const riderShipmentPrice = shipment.totalPrice;//rider shipment price
                  const updatedRiderReward = Number(riderWallet.points) + Number(riderShipmentPrice);
                  await RiderWallet.updateOne(
                     { riderid: riderid },
                     { $set: { points: updatedRiderReward } }
                  );
                  //customer and rider wallet transaction make
                  let now = new Date();
                  let date = now.toLocaleDateString("en-PK", { timeZone: "Asia/Karachi" });
                  let time = now.toLocaleTimeString("en-PK", { timeZone: "Asia/Karachi" });
                  let datetime = `${date} ${time}`;
                  const customerWalletTransaction = new CustomerWalletTransactions({
                     customerid: shipment.customerid,
                     transactionAmount: customerRewardPoints,
                     transactionType: 'Added',
                     datetime: datetime
                  });
                  const riderWalletTransaction = new RiderWalletTransactions({
                     riderid: riderid,
                     transactionAmount: riderShipmentPrice,
                     transactionType: 'Added',
                     datetime: datetime
                  });

                  await Route.deleteMany({ trackingid: shipment.trackingid });

                  await customerWalletTransaction.save()
                  await riderWalletTransaction.save();
                  await sendCompletedEmail(shipment.senderemail, shipment.originCity, shipment.destinationCity, shipment.trackingid);
               } else {
                  //update rider wallet
                  const riderShipmentPrice = shipment.totalPrice;//rider shipment price
                  const updatedRiderReward = Number(riderWallet.points) + Number(riderShipmentPrice);
                  await RiderWallet.updateOne(
                     { riderid: riderid },
                     { $set: { points: updatedRiderReward } }
                  );

                  let now = new Date();
                  let date = now.toLocaleDateString("en-PK", { timeZone: "Asia/Karachi" });
                  let time = now.toLocaleTimeString("en-PK", { timeZone: "Asia/Karachi" });
                  let datetime = `${date} ${time}`;

                  const riderWalletTransaction = new RiderWalletTransactions({
                     riderid: riderid,
                     transactionAmount: riderShipmentPrice,
                     transactionType: 'Added',
                     datetime: datetime
                  });

                  await Route.deleteMany({ trackingid: shipment.trackingid });
                  await riderWalletTransaction.save();
                  await sendCompletedEmail(shipment.senderemail, shipment.originCity, shipment.destinationCity, shipment.trackingid);
               }
            } catch (error) {
               return res.status(500).json({ success: false, message: "Server Error Shipment Status not updated" });
            }
         })
      );

      return res.status(200).json({ success: true, message: "Shipment completed and wallet updated successfully" });
   } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
   }
});

router.post('/withdraw-money-cash', async (req, res) => {
   const withdrawAmount = req.body.withdrawAmount;
   const riderid = req.session.userId;

   try {
      let now = new Date();
      let date = now.toLocaleDateString("en-PK", { timeZone: "Asia/Karachi" });
      let time = now.toLocaleTimeString("en-PK", { timeZone: "Asia/Karachi" });
      let datetime = `${date} ${time}`;

      const wallet = await RiderWallet.findOne({
         riderid: riderid
      })

      if (!wallet) {
         return res.status(404).json({ success: false })
      }

      const currentPoints = wallet.points;

      if (parseInt(withdrawAmount) > parseInt(currentPoints)) {
         return res.status(404).json({ success: false })
      }

      const remainingPoints = currentPoints - withdrawAmount;

      await RiderWallet.updateOne(
         {
            riderid: riderid
         },
         { $set: { points: remainingPoints } },
         { new: true }
      )

      const riderWalletTransaction = new RiderWalletTransactions({
         riderid: riderid,
         transactionAmount: withdrawAmount,
         transactionType: 'Deducted',
         datetime: datetime
      });

      await riderWalletTransaction.save();
      const transactionId = riderWalletTransaction._id;

      return res.status(200).json({
         success: true,
         remainingPoints: remainingPoints,
         withdrawAmount: withdrawAmount,
         datetime: datetime,
         transactionId: transactionId
      })
   } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
   }
})


router.post('/get-riders', async (req, res) => {
   try {
      const riderStatus = req.body.selectedCard;
      const city = req.body.city.toLowerCase();

      const riders = await Rider.find(
         {
            active: riderStatus,
            city: city
         }
      )



      return res.status(200).json({ success: true, riders: riders });

   } catch (error) {
      return res.status(500).json({ success: false, message: 'Error getting riders' });
   }
})


router.post('/update-riders', async (req, res) => {
   try {
      const cnic = req.body.cnic;
      const riderStatus = req.body.riderStatus;

      const result = await Rider.findOne({
         cnic: cnic
      })

      const email = result.email;
      const name = result.name;

      const isUpdate = await Rider.updateMany(
         { cnic: cnic },
         { $set: { active: riderStatus } }
      )

      await sendRiderAccountUpdateNotification(riderStatus, email, name)
      return res.status(200).json({ success: true, message: 'Rider status updated' });
   } catch (error) {
      return res.status(500).json({ success: false, message: 'Error updating rider status' });
   }
})

router.post('/rider-cancel-shipment', async (req, res) => {
   try {
      const { trackingid, riderid, createdAt, deliveryDate } = req.body;

      if (!trackingid || !createdAt || !deliveryDate || !riderid) {
         return res.status(400).json({ success: false, message: 'Failed to cancel shipemnt' });
      }

      const now = new Date();
      const acceptTime = new Date(createdAt);

      const [dd, mm, yyyy] = deliveryDate.split('-');
      const deliverydate = new Date(`${yyyy}-${mm}-${dd}`);
      deliverydate.setHours(
         now.getHours(),
         now.getMinutes(),
         now.getSeconds(),
         now.getMilliseconds()
      )

      const isToday = now.toDateString() === acceptTime.toDateString();
      const timeDiffInHours = (now - acceptTime) / (1000 * 60 * 60);

      if (isToday) {
         if (timeDiffInHours > 2) {
            await Rider.updateOne(
               {
                  _id: riderid
               },
               { $set: { stars: updatedStars } }
            )
         }
      } else {
         if (timeDiffInHours > 12) {
            await Rider.updateOne(
               {
                  _id: riderid
               },
               { $set: { stars: updatedStars } }
            )
         }
      }

      await DeliverShipment.deleteMany(
         { trackingid: trackingid }
      )

      await ScheduleShip.updateMany(
         {
            trackingid: trackingid
         },
         { $set: { shipmentStatus: 'dropped', assigned: false } }
      )

      return res.status(200).json({ success: true, message: 'Shipment cancelled successfully' });
   } catch (error) {
      return res.status(500).json({ success: false, message: 'Server error during cancellation' });
   }
})


router.get('/rider-logout', (req, res) => {
   req.session.destroy();
   res.json({ success: true, redirect: `${process.env.CLIENT_URL}/rider-login` })
})

export const BecomeRider = router;