import * as dotenv from "dotenv";
dotenv.config();

import e from 'express';
import { ScheduleShip } from '../models/scheduleaShip.js';
import { Wallet } from "../models/customerWalletModel.js";
import { CustomerWalletTransactions } from "../models/customerWalletTransactions.js";
import cors from 'cors'
import bodyParser from 'body-parser';
import bwipjs from 'bwip-js';
import QRCode from 'qrcode';
import Stripe from 'stripe'
import nodemailer from 'nodemailer'
import { DeliverShipment } from "../models/deliverShipment.js";
import { Rider } from '../models/riderModel.js'
import cron from 'node-cron'
const router = e.Router();
const stripe = new Stripe(process.env.STRIPE_KEY);  //stripe apikey used to access stripe features

router.use(cors({
    origin: 'https://swiftlogix.cc',
    credentials: true

}));
router.use(bodyParser.json());

//set email tranporter smtp
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: 'fromswiftlogix@gmail.com',
        pass: 'uslf ubwr wfkb suoy'
    }
});

const sendEmail = async (email, originCity, destinationCity, trackingid) => {

    try {
        //mail options
        const mailOptions = {
            from: '"SWIFTLOGIX" <fromswiftlogix@gmail.com>',
            to: email,
            subject: 'Schedule Shipment',
            html: `<p>Successfully Scheduled Shipment.</p>
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



// generate randomly tracking id for each shipment
let generateTrackingId = () => {
    const prefix = "SL";
    const length = 14 - prefix.length;
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let trackingID = prefix;

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        trackingID += characters[randomIndex];
    }

    return trackingID;
}


//schedule a function run every midnight check droped shipment not pick anyone or date left assign new delivery date
cron.schedule('00 00 * * *', async () => {
    try {
        const droppedShipments = await ScheduleShip.find({
            shipmentStatus: 'dropped'
        });

        const today = new Date();

        for (let shipment of droppedShipments) {
            const [day, month, year] = shipment.deliveryDate.split('-').map(Number);
            const currentDate = new Date(year, month - 1, day);
            currentDate.setHours(
                today.getHours(),
                today.getMinutes(),
                today.getSeconds(),
                today.getMilliseconds()
            );

            if (currentDate < today) {
                // Format to DD-MM-YYYY
                const day = String(today.getDate()).padStart(2, '0');
                const month = String(today.getMonth() + 1).padStart(2, '0');
                const year = today.getFullYear();
                const newDate = `${day}-${month}-${year}`;

                await ScheduleShip.updateOne(
                    { trackingid: shipment.trackingid },
                    { $set: { deliveryDate: newDate } }
                )
            }
        }
    } catch (error) {

    }
});

//schedule a function run every midnight check accepted shipment pick or not if deleivery date left than warning the rider and offer to another riders again
cron.schedule('00 00 * * *', async () => {
    try {
        const acceptedShipments = await ScheduleShip.find({
            shipmentStatus: 'accepted',
        });

        const today = new Date();

        for (const shipment of acceptedShipments) {
            const [day, month, year] = shipment.deliveryDate.split('-').map(Number);
            const currentDate = new Date(year, month - 1, day);
            currentDate.setHours(
                today.getHours(),
                today.getMinutes(),
                today.getSeconds(),
                today.getMilliseconds()
            );
            console.log(today)
            console.log(currentDate)
            if (currentDate < today) {
                // Format to DD-MM-YYYY
                console.log(shipment.receivername)
                const day = String(today.getDate()).padStart(2, '0');
                const month = String(today.getMonth() + 1).padStart(2, '0');
                const year = today.getFullYear();
                const newDate = `${day}-${month}-${year}`;

                const acceptShipmentDetail = await DeliverShipment.findOne({ trackingid: shipment.trackingid });
                const riderDetail = await Rider.findOne({ _id: acceptShipmentDetail.riderid });
                // const updatedStars = riderDetail.stars - 1;

                // await Rider.updateOne(
                //     {
                //         _id: acceptShipmentDetail.riderid
                //     },
                //     { $set: { stars: updatedStars } }
                // )

                await ScheduleShip.updateOne(
                    { trackingid: shipment.trackingid },
                    { $set: { shipmentStatus: 'dropped', deliveryDate: newDate, assigned: false } }
                );

                await DeliverShipment.deleteMany({
                    trackingid: shipment.trackingid,
                });

            }
        }
    } catch (error) {
        console.error('Error updating dropped shipments:', error);
    }

});


//endpoint where online payments handles/generate
router.post('/checkout', async (req, res) => {
    let totalPrice = req.body.packagePrice.totalPrice;
    let senderData = {
        sendername: null,
        sendercontact: null,
        senderemail: null,
        sendercnic: null
    }
    let receiverData = {
        receivername: null,
        receivercontact: null,
        receiveremail: null,
        receivercnic: null,
        receiverarea: null,
        receiverhouseno: null,
        receiveraddress: null
    }
    let packageData = {
        originCity: null,
        destinationCity: null,
        weight: null,
        pieces: null,
        pickupdate: null,
        pickuptime: null,
        insurance: null,
        pickupaddress: null,
        shipmentType: null,
        deliveryMethod: null,
        sensitivePackage: null,
        packageDescription: null
    }
    let packagePrice = {
        basePrice: null,
        weightCharges: null,
        distanceCharges: null,
        totalPrice: null,
    }

    senderData = req.body.senderFormData;
    receiverData = req.body.receiverFormData;
    packageData = req.body.packageFormData;
    packagePrice = req.body.packagePrice;
    const endpoint = req.body.endpoint;


    // Create an object containing all data
    const formData = { senderData, receiverData, packageData, packagePrice, endpoint };
    // Convert object to JSON and encode it
    const encodedData = encodeURIComponent(JSON.stringify(formData));

    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: 'pkr',
                    product_data: {
                        name: 'Shipment'
                    },
                    unit_amount: totalPrice * 100
                },
                quantity: 1
            }
        ],
        mode: 'payment',
        success_url: `${process.env.BASE_URL}/success-point?session_id={CHECKOUT_SESSION_ID}&data=${encodedData}`,
        cancel_url: `${process.env.BASE_URL}/failed-point?data=${encodedData}`
    })

    res.json({ url: session.url });

})

//handle here online payment faileds due some issues for logged in users
router.get('/failed-point', (req, res) => {
    const encodedData = req.query.data;
    // Decode and parse JSON data
    const formData = JSON.parse(decodeURIComponent(encodedData));
    const endpoint = formData.endpoint;

    res.redirect(`${process.env.CLIENT_URL}/${endpoint}?payment=failed&data=${encodedData}`)
})

//schedule point endpoint where all ships handle or save online payment shipments for loggedin users
router.get('/success-point', async (req, res) => {
    const sessionId = req.query.session_id;
    const encodedData = req.query.data;
    const payby = "sender";
    const paid = true;


    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status === 'paid') {
        if (!encodedData) {
            return res.redirect(`${process.env.CLIENT_URL}/customer-scheduleship?payment=failed&error=noData`);
        }

        // Decode and parse JSON data
        const formData = JSON.parse(decodeURIComponent(encodedData));


        let now = new Date();
        let datetime = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`
        let trackingID = generateTrackingId();
        const paymentMethod = 'Online';
        const shipmentStatus = 'scheduled';
        let senderData = {
            sendername: null,
            sendercontact: null,
            senderemail: null,
            sendercnic: null
        }
        let receiverData = {
            receivername: null,
            receivercontact: null,
            receiveremail: null,
            receivercnic: null,
            receiverarea: null,
            receiverhouseno: null,
            receiveraddress: null
        }
        let packageData = {
            originCity: null,
            destinationCity: null,
            weight: null,
            pieces: null,
            pickupdate: null,
            pickuptime: null,
            insurance: null,
            pickupaddress: null,
            shipmentType: null,
            deliveryMethod: null,
            sensitivePackage: null,
            packageDescription: null
        }
        let packagePrice = {
            basePrice: null,
            weightCharges: null,
            distanceCharges: null,
            totalPrice: null,
        }

        senderData = formData.senderData;
        receiverData = formData.receiverData;
        packageData = formData.packageData;
        packagePrice = formData.packagePrice;
        const endpoint = formData.endpoint;

        if (senderData && receiverData && packageData && packagePrice) {
            let newScheduleShip;
            if (packageData.deliveryMethod === 'dropOffShop') {
                newScheduleShip = new ScheduleShip({
                    customerid: req.session.userId,
                    trackingid: trackingID,
                    sendername: senderData.sendername,
                    senderemail: senderData.senderemail,
                    sendercontact: senderData.sendercontact,
                    sendercnic: senderData.sendercnic,
                    receivername: receiverData.receivername,
                    receiveremail: receiverData.receiveremail,
                    receivercontact: receiverData.receivercontact,
                    receivercnic: receiverData.receivercnic,
                    receiverarea: receiverData.receiverarea,
                    receiverhouseno: receiverData.receiverhouseno,
                    receiveraddress: receiverData.receiveraddress,
                    originCity: packageData.originCity,
                    destinationCity: packageData.destinationCity,
                    weight: packageData.weight,
                    pieces: packageData.pieces,
                    pickupdate: null,
                    pickuptime: null,
                    insurance: packageData.insurance,
                    orignalprice: packageData.orignalprice,
                    pickupaddress: null,
                    shipmentType: packageData.shipmentType,
                    deliveryMethod: packageData.deliveryMethod,
                    sensitivePackage: packageData.sensitivePackage,
                    packageDescription: packageData.packageDescription,
                    shipmentStatus: shipmentStatus,
                    basePrice: packagePrice.basePrice,
                    weightCharges: packagePrice.weightCharges,
                    distanceCharges: packagePrice.distanceCharges,
                    totalPrice: packagePrice.totalPrice,
                    paymentMethod: paymentMethod,
                    datetime: datetime,
                    assigned: false,
                    paid: paid,
                    payby: payby
                })

                await newScheduleShip.save();

            } else {
                newScheduleShip = new ScheduleShip({
                    customerid: req.session.userId,
                    trackingid: trackingID,
                    sendername: senderData.sendername,
                    senderemail: senderData.senderemail,
                    sendercontact: senderData.sendercontact,
                    sendercnic: senderData.sendercnic,
                    receivername: receiverData.receivername,
                    receiveremail: receiverData.receiveremail,
                    receivercontact: receiverData.receivercontact,
                    receivercnic: receiverData.receivercnic,
                    receiverarea: receiverData.receiverarea,
                    receiverhouseno: receiverData.receiverhouseno,
                    receiveraddress: receiverData.receiveraddress,
                    originCity: packageData.originCity,
                    destinationCity: packageData.destinationCity,
                    weight: packageData.weight,
                    pieces: packageData.pieces,
                    pickupdate: packageData.pickupdate,
                    pickuptime: packageData.pickuptime,
                    insurance: packageData.insurance,
                    orignalprice: packageData.orignalprice,
                    pickupaddress: packageData.pickupaddress,
                    shipmentType: packageData.shipmentType,
                    deliveryMethod: packageData.deliveryMethod,
                    sensitivePackage: packageData.sensitivePackage,
                    packageDescription: packageData.packageDescription,
                    shipmentStatus: shipmentStatus,
                    basePrice: packagePrice.basePrice,
                    weightCharges: packagePrice.weightCharges,
                    distanceCharges: packagePrice.distanceCharges,
                    totalPrice: packagePrice.totalPrice,
                    paymentMethod: paymentMethod,
                    datetime: datetime,
                    assigned: false,
                    paid: paid,
                    payby: payby
                })

                await newScheduleShip.save();
            }
            const trackingId = newScheduleShip.trackingid
            packageData.paid = paid;
            packageData.payby = payby
            // Create an object containing all data
            const formData = { senderData, receiverData, packageData, packagePrice, trackingId, datetime, paymentMethod };
            const encodedData = encodeURIComponent(JSON.stringify(formData))
            await sendEmail(senderData.senderemail, packageData.originCity, packageData.destinationCity, trackingId)

            res.redirect(`${process.env.CLIENT_URL}/${endpoint}?payment=success&data=${encodedData}`);
        } else {
            res.redirect(`${process.env.CLIENT_URL}/${endpoint}?payment=failed`);
        }

    }
})

//schedule point endpoint where all ships handle or save cash payment shipments
router.post('/scheduleaship-point', async (req, res) => {
    let now = new Date();
    let datetime = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`
    let trackingID = generateTrackingId();
    const paymentMethod = 'Cash';
    const shipmentStatus = 'scheduled';

    let senderData = {
        sendername: null,
        sendercontact: null,
        senderemail: null,
        sendercnic: null
    }
    let receiverData = {
        receivername: null,
        receivercontact: null,
        receiveremail: null,
        receivercnic: null,
        receiverarea: null,
        receiverhouseno: null,
        receiveraddress: null
    }
    let packageData = {
        originCity: null,
        destinationCity: null,
        weight: null,
        pieces: null,
        pickupdate: null,
        pickuptime: null,
        insurance: null,
        pickupaddress: null,
        shipmentType: null,
        deliveryMethod: null,
        sensitivePackage: null,
        packageDescription: null
    }
    let packagePrice = {
        basePrice: null,
        weightCharges: null,
        distanceCharges: null,
        totalPrice: null,
    }

    senderData = req.body.senderFormData;
    receiverData = req.body.receiverFormData;
    packageData = req.body.packageFormData;
    packagePrice = req.body.packagePrice;


    if (senderData && receiverData && packageData && packagePrice) {
        let newScheduleShip;
        if (packageData.deliveryMethod === 'dropOffShop') {
            newScheduleShip = new ScheduleShip({
                customerid: req.session.userId,
                trackingid: trackingID,
                sendername: senderData.sendername,
                senderemail: senderData.senderemail,
                sendercontact: senderData.sendercontact,
                sendercnic: senderData.sendercnic,
                receivername: receiverData.receivername,
                receiveremail: receiverData.receiveremail,
                receivercontact: receiverData.receivercontact,
                receivercnic: receiverData.receivercnic,
                receiverarea: receiverData.receiverarea,
                receiverhouseno: receiverData.receiverhouseno,
                receiveraddress: receiverData.receiveraddress,
                originCity: packageData.originCity,
                destinationCity: packageData.destinationCity,
                weight: packageData.weight,
                pieces: packageData.pieces,
                pickupdate: null,
                pickuptime: null,
                insurance: packageData.insurance,
                orignalprice: packageData.orignalprice,
                pickupaddress: null,
                shipmentType: packageData.shipmentType,
                deliveryMethod: packageData.deliveryMethod,
                sensitivePackage: packageData.sensitivePackage,
                packageDescription: packageData.packageDescription,
                shipmentStatus: shipmentStatus,
                basePrice: packagePrice.basePrice,
                weightCharges: packagePrice.weightCharges,
                distanceCharges: packagePrice.distanceCharges,
                totalPrice: packagePrice.totalPrice,
                paymentMethod: paymentMethod,
                datetime: datetime,
                assigned: false,
                paid: false,
                payby: packageData.payby
            })

            await newScheduleShip.save();

        } else {
            newScheduleShip = new ScheduleShip({
                customerid: req.session.userId,
                trackingid: trackingID,
                sendername: senderData.sendername,
                senderemail: senderData.senderemail,
                sendercontact: senderData.sendercontact,
                sendercnic: senderData.sendercnic,
                receivername: receiverData.receivername,
                receiveremail: receiverData.receiveremail,
                receivercontact: receiverData.receivercontact,
                receivercnic: receiverData.receivercnic,
                receiverarea: receiverData.receiverarea,
                receiverhouseno: receiverData.receiverhouseno,
                receiveraddress: receiverData.receiveraddress,
                originCity: packageData.originCity,
                destinationCity: packageData.destinationCity,
                weight: packageData.weight,
                pieces: packageData.pieces,
                pickupdate: packageData.pickupdate,
                pickuptime: packageData.pickuptime,
                insurance: packageData.insurance,
                orignalprice: packageData.orignalprice,
                pickupaddress: packageData.pickupaddress,
                shipmentType: packageData.shipmentType,
                deliveryMethod: packageData.deliveryMethod,
                sensitivePackage: packageData.sensitivePackage,
                packageDescription: packageData.packageDescription,
                shipmentStatus: shipmentStatus,
                basePrice: packagePrice.basePrice,
                weightCharges: packagePrice.weightCharges,
                distanceCharges: packagePrice.distanceCharges,
                totalPrice: packagePrice.totalPrice,
                paymentMethod: paymentMethod,
                datetime: datetime,
                assigned: false,
                paid: false,
                payby: packageData.payby
            })

            await newScheduleShip.save();
        }

        //barcode generate
        const barcodeData = newScheduleShip.trackingid;
        try {
            const barcodeImage = await bwipjs.toBuffer({
                bcid: 'code128',
                text: barcodeData,
                scale: 2.5,
                height: 10,
                includetext: true,
                textxalign: 'center',
            });

            //QR Code generate
            const qrcodeData = newScheduleShip.trackingid;
            let qrcode = await QRCode.toDataURL(qrcodeData)

            await sendEmail(senderData.senderemail, packageData.originCity, packageData.destinationCity, trackingID)

            res.json({
                success: true,
                message: 'Shipment scheduled successfully.',
                barcode: `data:image/png;base64,${barcodeImage.toString('base64')}`,
                qrcode: qrcode,
                trackingid: newScheduleShip.trackingid,
                scheduletime: datetime,
                paymentmethod: paymentMethod,
                paid: false
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error generating barcode.', error });
        }

    } else {
        res.status(400).json({ success: false, message: 'Invalid data provided.' });
    }
})

//schedule point endpoint where all ships handle or save wallet payment shipments
router.post('/wallet-payment', async (req, res) => {
    const user = req.session.userId;
    let now = new Date();
    let datetime = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`
    let trackingID = generateTrackingId();
    const paymentMethod = 'Wallet';
    const shipmentStatus = 'scheduled';
    const paymentPoints = 250;
    let senderData = {
        sendername: null,
        sendercontact: null,
        senderemail: null,
        sendercnic: null
    }
    let receiverData = {
        receivername: null,
        receivercontact: null,
        receiveremail: null,
        receivercnic: null,
        receiverarea: null,
        receiverhouseno: null,
        receiveraddress: null
    }
    let packageData = {
        originCity: null,
        destinationCity: null,
        weight: null,
        pieces: null,
        pickupdate: null,
        pickuptime: null,
        insurance: null,
        pickupaddress: null,
        shipmentType: null,
        deliveryMethod: null,
        sensitivePackage: null,
        packageDescription: null
    }
    let packagePrice = {
        basePrice: null,
        weightCharges: null,
        distanceCharges: null,
        totalPrice: null,
    }


    senderData = req.body.senderFormData;
    receiverData = req.body.receiverFormData;
    packageData = req.body.packageFormData;
    packagePrice = req.body.packagePrice;
    const payby = "sender";

    const walletResult = await Wallet.findOne({
        customerid: user,
    })

    if (!(walletResult.points >= paymentPoints)) {
        return res.json({ success: false, message: 'Insufficient Points' })
    }

    const remainingPoints = walletResult.points - paymentPoints;

    const walletTransaction = await CustomerWalletTransactions({
        customerid: user,
        transactionAmount: paymentPoints,
        transactionType: 'Deducted',
        datetime: datetime,
    })

    await walletTransaction.save();

    const updateWallet = await Wallet.updateOne(
        {
            customerid: user
        },
        {
            $set: { points: remainingPoints }
        }
    )

    if (senderData && receiverData && packageData && packagePrice) {
        let newScheduleShip;
        if (packageData.deliveryMethod === 'dropOffShop') {
            newScheduleShip = new ScheduleShip({
                customerid: req.session.userId,
                trackingid: trackingID,
                sendername: senderData.sendername,
                senderemail: senderData.senderemail,
                sendercontact: senderData.sendercontact,
                sendercnic: senderData.sendercnic,
                receivername: receiverData.receivername,
                receiveremail: receiverData.receiveremail,
                receivercontact: receiverData.receivercontact,
                receivercnic: receiverData.receivercnic,
                receiverarea: receiverData.receiverarea,
                receiverhouseno: receiverData.receiverhouseno,
                receiveraddress: receiverData.receiveraddress,
                originCity: packageData.originCity,
                destinationCity: packageData.destinationCity,
                weight: packageData.weight,
                pieces: packageData.pieces,
                pickupdate: null,
                pickuptime: null,
                insurance: packageData.insurance,
                orignalprice: packageData.orignalprice,
                pickupaddress: null,
                shipmentType: packageData.shipmentType,
                deliveryMethod: packageData.deliveryMethod,
                sensitivePackage: packageData.sensitivePackage,
                packageDescription: packageData.packageDescription,
                shipmentStatus: shipmentStatus,
                basePrice: packagePrice.basePrice,
                weightCharges: packagePrice.weightCharges,
                distanceCharges: packagePrice.distanceCharges,
                totalPrice: packagePrice.totalPrice,
                paymentMethod: paymentMethod,
                datetime: datetime,
                assigned: false,
                paid: true,
                payby: payby
            })

            await newScheduleShip.save();

        } else {
            newScheduleShip = new ScheduleShip({
                customerid: req.session.userId,
                trackingid: trackingID,
                sendername: senderData.sendername,
                senderemail: senderData.senderemail,
                sendercontact: senderData.sendercontact,
                sendercnic: senderData.sendercnic,
                receivername: receiverData.receivername,
                receiveremail: receiverData.receiveremail,
                receivercontact: receiverData.receivercontact,
                receivercnic: receiverData.receivercnic,
                receiverarea: receiverData.receiverarea,
                receiverhouseno: receiverData.receiverhouseno,
                receiveraddress: receiverData.receiveraddress,
                originCity: packageData.originCity,
                destinationCity: packageData.destinationCity,
                weight: packageData.weight,
                pieces: packageData.pieces,
                pickupdate: packageData.pickupdate,
                pickuptime: packageData.pickuptime,
                insurance: packageData.insurance,
                orignalprice: packageData.orignalprice,
                pickupaddress: packageData.pickupaddress,
                shipmentType: packageData.shipmentType,
                deliveryMethod: packageData.deliveryMethod,
                sensitivePackage: packageData.sensitivePackage,
                packageDescription: packageData.packageDescription,
                shipmentStatus: shipmentStatus,
                basePrice: packagePrice.basePrice,
                weightCharges: packagePrice.weightCharges,
                distanceCharges: packagePrice.distanceCharges,
                totalPrice: packagePrice.totalPrice,
                paymentMethod: paymentMethod,
                datetime: datetime,
                assigned: false,
                paid: true,
                payby: payby
            })

            await newScheduleShip.save();
        }

        //barcode generate
        const barcodeData = newScheduleShip.trackingid;
        try {
            const barcodeImage = await bwipjs.toBuffer({
                bcid: 'code128',
                text: barcodeData,
                scale: 2.5,
                height: 10,
                includetext: true,
                textxalign: 'center',
            });

            //QR Code generate
            const qrcodeData = newScheduleShip.trackingid;
            let qrcode = await QRCode.toDataURL(qrcodeData)


            await sendEmail(senderData.senderemail, packageData.originCity, packageData.destinationCity, trackingID)
            res.json({
                success: true,
                message: 'Shipment scheduled successfully.',
                barcode: `data:image/png;base64,${barcodeImage.toString('base64')}`,
                qrcode: qrcode,
                trackingid: newScheduleShip.trackingid,
                scheduletime: datetime,
                paymentmethod: paymentMethod,
                payby: payby,
                paid: true
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error generating barcode.', error });
        }

    } else {
        res.status(400).json({ success: false, message: 'Invalid data provided.' });
    }
})


//generate barcode and qrcode after online payments
router.post('/bar-qrcode', async (req, res) => {
    const trackingId = req.body.trackingId;
    //barcode generate
    const barcodeData = trackingId;
    try {
        const barcodeImage = await bwipjs.toBuffer({
            bcid: 'code128',
            text: barcodeData,
            scale: 2.5,
            height: 10,
            includetext: true,
            textxalign: 'center',
        });

        //QR Code generate
        const qrcodeData = trackingId;
        let qrcode = await QRCode.toDataURL(qrcodeData)

        res.json({
            success: true,
            message: 'Shipment scheduled successfully.',
            barcode: `data:image/png;base64,${barcodeImage.toString('base64')}`,
            qrcode: qrcode,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error generating barcode.', error });
    }
})

//reprint barcode and qrcode
router.post('/regenrate-bar-qrcode', async (req, res) => {
    const allShipments = req.body.shipments;

    if (!Array.isArray(allShipments) || allShipments.length === 0) {
        return res.status(400).json({ success: false, message: 'Invalid shipment data' });
    }

    try {
        const bar_qr_codeDataArray = await Promise.all(allShipments.map(async (shipment) => {
            const trackingId = shipment.trackingid;

            if (!trackingId) {
                return {
                    success: false,
                    message: 'Missing tracking ID',
                    barcode: null,
                    qrcode: null
                };
            }

            try {
                // Generate Barcode
                const barcodeImage = await bwipjs.toBuffer({
                    bcid: 'code128',
                    text: trackingId,
                    scale: 2.5,
                    height: 10,
                    includetext: true,
                    textxalign: 'center',
                });

                // Generate QR Code
                const qrcode = await QRCode.toDataURL(trackingId);

                return {
                    trackingId,
                    success: true,
                    message: 'Barcode & QR Code generated successfully',
                    barcode: `data:image/png;base64,${barcodeImage.toString('base64')}`,
                    qrcode: qrcode
                };
            } catch (error) {
                return {
                    trackingId,
                    success: false,
                    message: 'Error generating barcode for this tracking ID',
                    barcode: null,
                    qrcode: null,
                    error: error.message
                };
            }
        }));

        res.json({ bar_qr_codeDataArray });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error while generating barcodes.', error });
    }
})

router.post('/get-shipments', async (req, res) => {
    try {
        const customerid = req.session.userId;
        const selectedCard = req.body.selectedCard;
        let shipments = []

        if (selectedCard === 'scheduled') {
            shipments = await ScheduleShip.find({
                customerid: customerid,
                shipmentStatus: { $in: ["scheduled", "dropped"] }
            });
        } else {
            shipments = await ScheduleShip.find({
                customerid: customerid,
                shipmentStatus: selectedCard
            });
        }

        res.json({ success: true, shipments: shipments });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
})

router.post('/reprint-label', async (req, res) => {
    try {
        const reprintlabel = req.body.reprintLabel;

        const shipments = await ScheduleShip.find(
            {
                trackingid: reprintlabel
            }
        )

        res.json({ success: true, shipments: shipments });
    } catch (error) {
        console.error('Error fetching shipments:', error);
        res.status(500).json({ success: false, message: "Server error" });
    }

})


router.post('/get-city-shipments', async (req, res) => {
    try {
        const city = req.body.city;
        const selectedCard = req.body.selectedCard;
        let shipments = []
        if (selectedCard === 'scheduled') {
            shipments = await ScheduleShip.find({
                originCity: city,
                shipmentStatus: { $in: ["scheduled", "dropped"] }
            });

            return res.json({ success: true, shipments: shipments, showRider: false });
        } else {

            shipments = await ScheduleShip.find({
                originCity: city,
                shipmentStatus: selectedCard
            });

            const deliverShipments = await DeliverShipment.find({
                originCity: city,
                deliveryStatus: selectedCard,
            });


            const riderIds = deliverShipments.map(shipment => shipment.riderid);

            const riders = await Rider.find({
                '_id': { $in: riderIds }
            });

            const shipmentsAlongRider = deliverShipments.map(deliverShipment => {
                const rider = riders.find(r => r._id.toString() === deliverShipment.riderid.toString());
                const shipment = shipments.find(s => s._id.toString() === deliverShipment.shipmentid.toString());
                return { shipment, rider };
            });

            return res.json({ success: true, shipments: shipmentsAlongRider, showRider: true });

        }

        // return res.json({ success: true, shipments: shipments });
    } catch (error) {
        console.error('Error fetching shipments:', error);
        res.status(500).json({ success: false, message: "Server error" });
    }
})

//genrate Express delivery dates
const getExpressDate = () => {
    const now = new Date();
    const currentHour = now.getHours();

    const dateToUse = currentHour < 22 ? now : new Date(now.setDate(now.getDate() + 1));

    // Format to DD-MM-YYYY
    const day = String(dateToUse.getDate()).padStart(2, '0');
    const month = String(dateToUse.getMonth() + 1).padStart(2, '0');
    const year = dateToUse.getFullYear();

    return `${day}-${month}-${year}`;
}

//genrate Ground delivery dates
const getGroundDate = () => {
    const now = new Date();
    const dateToUse = new Date(now.setDate(now.getDate() + 2));

    // Format to DD-MM-YYYY
    const day = String(dateToUse.getDate()).padStart(2, '0');
    const month = String(dateToUse.getMonth() + 1).padStart(2, '0');
    const year = dateToUse.getFullYear();

    return `${day}-${month}-${year}`;
}


router.post('/dropped-shipment', async (req, res) => {
    const trackingId = req.body.trackingId.trackingId;
    const shipmentType = req.body.packageFormData.shipmentType;

    try {
        let deliveryDate = null;

        if (shipmentType === 'Ground') {
            deliveryDate = getGroundDate();
        } else if (shipmentType === 'Express') {
            deliveryDate = getExpressDate();
        }

        const result = await ScheduleShip.findOneAndUpdate(
            { trackingid: trackingId },
            { $set: { shipmentStatus: 'dropped', deliveryDate: deliveryDate } },
            { new: true }
        );
        9
        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Shipment Status Not Updated'
            })
        }

        return res.status(200).json({
            success: true,
            message: 'Shipment Status Updated'
        })
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }

})

router.post('/get-shipment-pickbyrider', async (req, res) => {
    const deliveryMethod = req.body.deliveryMethod;
    const date = req.body.date;
    const time = req.body.time;

    try {
        let result = null
        if (deliveryMethod) {
            result = await ScheduleShip.find({
                shipmentStatus: 'scheduled',
                deliveryMethod: deliveryMethod,
            })
        }
        if (deliveryMethod && date) {
            result = await ScheduleShip.find({
                shipmentStatus: 'scheduled',
                deliveryMethod: deliveryMethod,
                pickupdate: date
            })
        }
        if (deliveryMethod && date && time) {
            result = await ScheduleShip.find({
                shipmentStatus: 'scheduled',
                deliveryMethod: deliveryMethod,
                pickupdate: date,
                pickuptime: time
            })
        }


        if (result.length <= 0) {
            return res.status(404).json({ success: false, message: 'picked by rider' });
        }

        res.status(200).json({ success: true, shipments: result });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
})



export const ScheduleaShip = router;
