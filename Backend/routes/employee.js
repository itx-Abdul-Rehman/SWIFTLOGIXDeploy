import * as dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import bcrypt, { genSalt } from 'bcrypt'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import { Employee } from '../models/employeeModel.js'
import { RiderWalletTransactions } from '../models/riderWalletTransactions.js'
const router = express.Router();

router.use(cors({
    origin: 'http://13.234.75.47:5173',
  credentials: true

}));

router.use(express.json());

//set email tranporter smtp
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  auth: {
    user: 'fromswiftlogix@gmail.com',
    pass: 'uslf ubwr wfkb suoy'
  }
});



const sendPickNotification = async (email, originCity, destinationCity, trackingid, time) => {

  try {
    //mail options
    const mailOptions = {
      from: '"SWIFTLOGIX" <fromswiftlogix@gmail.com>',
      to: email,
      subject: 'About Shipment',
      html: `<p>Rider picking your scheduled shipment today at ${time}.</p>
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


// Middleware to verify token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ success: false });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ success: false });
    req.user = user;
    next();
  });
}


router.post('/admin-signup', async (req, res) => {
  const signupData = {
    username: req.body.name,
    email: req.body.email,
    password: req.body.password,
    city: req.body.city
  }
  const adminaccesscode = req.body.adminaccesscode;

  try {

    if (!(adminaccesscode === process.env.ADMIN_ACCESS_CODE)) {
      return res.status(404).json({
        success: false,
        message: 'Admin access code invalid!'
      })
    }

    const salt = await genSalt(12);
    const hashPassword = await bcrypt.hash(signupData.password, salt);

    const newEmployee = new Employee({
      username: signupData.username,
      email: signupData.email,
      password: hashPassword,
      city: signupData.city
    });

    await newEmployee.save();

    return res.status(200).json({
      success: true,
      message: 'Successfully Account Created.',
      employeeData: signupData
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
})


router.post('/admin-login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const result = await Employee.findOne({ email: email });
    if (!result) {
      return res.status(404).json({ success: false, message: 'Credentials not matched! Try again.' });
    }

    const isMatched = await bcrypt.compare(password, result.password);
    if (!isMatched) {
      return res.status(404).json({ success: false, message: 'Credentials not matched! Try again.' });
    }

    const token = jwt.sign({ email: result.email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    return res.status(200).json({
      success: true,
      message: 'You are successfully logged in.',
      token: token,
      userdata: result
    });

  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }

})

router.get('/admin', authenticateToken, async (req, res) => {
  try {
    const result = await Employee.findOne({ email: req.user.email });
    res.json({
      success: true,
      userData: result
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }

})

router.post('/get-transaction', async (req, res) => {
  const transactionid = req.body.transactionId;

  try {
    const transaction = await RiderWalletTransactions.findOne({
      _id: transactionid
    })

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found"
      });
    }

    return res.status(200).json({
      success: true,
      transaction: transaction
    });

  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
})

router.post('/transaction-pay', async (req, res) => {
  const transactionid = req.body.transactionId;

  try {
    await RiderWalletTransactions.updateOne(
      { _id: transactionid },
      { $set: { paid: true } }
    )



    return res.status(200).json({
      success: true,
      message: 'Paid'
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
})


router.post('/send-notification', async (req, res) => {
  const shipments = req.body

  try {
    shipments.forEach(async (shipment) => {
      await sendPickNotification(
        shipment.senderFormData.senderemail,
        shipment.packageFormData.originCity,
        shipment.packageFormData.destinationCity,
        shipment.trackingId.trackingId,
        shipment.packageFormData.pickuptime,
      )
    });

    return res.status(200).json({ success: true, message: 'Succesfully send notification' })
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
})

export const EmployeeRoute = router;
