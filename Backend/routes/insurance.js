import * as dotenv from 'dotenv'
dotenv.config()

import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer'
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { insuranceClaim } from '../models/insuranceClaimModel.js';
import { ScheduleShip } from '../models/scheduleaShip.js';

const router = express.Router();

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


router.use(cors({
    origin: 'https://swiftlogix.cc',
    credentials: true

}));

router.use(express.json());
router.use(express.urlencoded({ extended: true }));



//set email tranporter smtp
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: 'fromswiftlogix@gmail.com',
        pass: 'uslf ubwr wfkb suoy'
    }
});



const sendInsuranceClaimUpdateNotification = async (claimStatus, email, trackingId) => {

    try {
        let mailOptions = null;
        if (claimStatus === 'accepted') {
            //mail options
            mailOptions = {
                from: '"SWIFTLOGIX" <fromswiftlogix@gmail.com>',
                to: email,
                subject: 'Insurance Claim Update',
                html: `<p>Dear Customer,</p>
                            <p>
                                We are pleased to inform you that our team has reviewed your insurance claim associated with 
                                <strong>Tracking ID ${trackingId}.</strong>.
                            </p>
                            <p>
                                You may now collect your approved claim amount from the nearest 
                                <strong>SWIFTLOGIX</strong> shop or franchise location in your city. Please remember to bring a CNIC and your tracking details when you visit.
                            </p>
                            <p>
                                Thank you for choosing SWIFTLOGIX. If you have any questions or need further assistance, feel free to contact our customer support team.
                            </p>
                            <p>Best regards,<br>
                            <strong>The SWIFTLOGIX Team</strong></p>`
            }
        } else if (claimStatus === 'rejected') {
            //mail options
            mailOptions = {
                from: '"SWIFTLOGIX" <fromswiftlogix@gmail.com>',
                to: email,
                subject: 'Insurance Claim Update',
                html: `<p>Dear Customer,</p>
                            <p>
                                We regret to inform you that after a careful review, your insurance claim associated with 
                                <strong>Tracking ID ${trackingId}</strong> has been <strong>rejected</strong>.
                            </p>
                            <p>
                                Please note that this decision was made based on our insurance policy terms and the information provided in your claim.
                                If you believe this decision was made in error or if you would like further clarification, we encourage you to contact our customer support team.
                            </p>
                            <p>
                                Thank you for understanding, and we appreciate your continued trust in SWIFTLOGIX.
                            </p>
                            <p>Best regards,<br>
                            <strong>The SWIFTLOGIX Team</strong></p>`
            }
        } else if (claimStatus === 'completed') {
            //mail options
            mailOptions = {
                from: '"SWIFTLOGIX" <fromswiftlogix@gmail.com>',
                to: email,
                subject: 'Insurance Claim Paid',
                html: `<p>Dear Customer,</p>
                            <p>
                                We are pleased to inform you that your insurance claim associated with 
                                <strong>Tracking ID ${trackingId}</strong> has been <strong>successfully paid</strong>.
                            </p>
                            <p>
                                Thank you for trusting SWIFTLOGIX. If you have any questions or need further assistance, feel free to contact our customer support team.
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


const sendInsuranceClaimReceivedNotification = async (email, trackingId) => {

    try {
        //mail options
        const mailOptions = {
            from: '"SWIFTLOGIX" <fromswiftlogix@gmail.com>',
            to: email,
            subject: 'Insurance Claim Received',
            html: `<p>Dear Customer,</p>
                            <p>
                                We have successfully received your insurance claim associated with 
                                <strong>Tracking ID ${trackingId}</strong>.
                            </p>
                            <p>
                                Our team will now review your claim and process the refund within 
                                <strong>7–14 business days</strong> after the submission date. You will be notified once the review is complete.
                            </p>
                            <p>
                                Thank you for your patience and for choosing SWIFTLOGIX. If you have any questions or require further assistance, please do not hesitate to contact our customer support team.
                            </p>
                            <p>Best regards,<br>
                            <strong>The SWIFTLOGIX Team</strong></p>`
        }

        await transporter.sendMail(mailOptions)

        return true;

    } catch (error) {
        return false;
    }
}



router.post('/insurance-claim', upload.fields([
    { name: 'proofShipmentValue', maxCount: 1 },
    { name: 'anySupportingDocument', maxCount: 1 }
]), async (req, res) => {
    const trackingId = req.body.trackingid;
    const description = req.body.description;
    const email = req.body.email;
    const claimStatus = 'pending';

    try {
        const uploadedFiles = {};

        const isShipment = await ScheduleShip.find({
            trackingid: trackingId,
            shipmentStatus: 'completed'
        })

        const noInsuranceShipment = await ScheduleShip.find({
            trackingid: trackingId,
            shipmentStatus: 'completed',
            insurance: 'yes',
        })

        const isAlreadyClaim = await insuranceClaim.find({
            trackingid: trackingId,
        })


        if (!(isShipment.length > 0)) {
            return res.status(400).json({ success: false, message: 'Tracking Id not exist' });
        }

        if (!(noInsuranceShipment.length > 0)) {
            return res.status(400).json({ success: false, message: 'Tracking Id not insured' });
        }

        if (isAlreadyClaim.length > 0) {
            return res.status(400).json({ success: false, message: 'Already applied or claimed insurance' });
        }

        // Upload proofShipmentValue if present
        if (req.files['proofShipmentValue']) {
            const filePath = req.files['proofShipmentValue'][0].path;
            const result = await cloudinary.uploader.upload(filePath, {
                folder: 'insurance_claims'
            });
            uploadedFiles.proofShipmentValue = result.secure_url;
            fs.unlinkSync(filePath);
        }

        // Upload anySupportingDocument if present
        if (req.files['anySupportingDocument']) {
            const filePath = req.files['anySupportingDocument'][0].path;
            const result = await cloudinary.uploader.upload(filePath, {
                folder: 'insurance_claims'
            });
            uploadedFiles.anySupportingDocument = result.secure_url;
            fs.unlinkSync(filePath);
        }


        const proofShipmentValue = uploadedFiles.proofShipmentValue;
        const anySupportingDocument = uploadedFiles.anySupportingDocument;

        let now = new Date();
        let datetime = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`

        const newInsuranceClaim = new insuranceClaim({
            trackingid: trackingId,
            email: email,
            description: description,
            shipmentValueProof: proofShipmentValue,
            otherSupportingDocument: anySupportingDocument,
            city: isShipment[0].originCity,
            datetime: datetime,
            claimStatus: claimStatus
        })

        await newInsuranceClaim.save();
        await sendInsuranceClaimReceivedNotification(email, trackingId)
        return res.json({ success: true, message: 'Claim received' });

    } catch (err) {
        return res.status(500).json({ success: false, message: 'Failed to submit claim' });
    }
});


router.post('/get-insurance-claims', async (req, res) => {
    const claimStatus = req.body.selectedCard;
    const city = req.body.city;

    try {
        const insuranceClaims = await insuranceClaim.find(
            {
                claimStatus: claimStatus,
                city: city
            }
        )

        return res.status(200).json({ success: true, claims: insuranceClaims });

    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error getting insurance claims' });
    }
})

router.post('/update-insurance-claims', async (req, res) => {
    try {
        const trackingId = req.body.trackingid;
        const claimStatus = req.body.claimStatus;

        const result = await insuranceClaim.findOne({
            trackingid: trackingId
        })

        const email = result.email;

        const isUpdate = await insuranceClaim.updateMany(
            { trackingid: trackingId },
            { $set: { claimStatus: claimStatus } }
        )

        await sendInsuranceClaimUpdateNotification(claimStatus, email, trackingId)
        return res.status(200).json({ success: true, message: 'Isurance claim status updated' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error updating insurance claim status' });
    }
})


export const InsuranceRoute = router;
