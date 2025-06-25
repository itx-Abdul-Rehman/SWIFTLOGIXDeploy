import * as dotenv from "dotenv";
dotenv.config();

import e, { query } from 'express'
import cors from 'cors'
import bodyParser from 'body-parser';
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding.js'
import haversine from 'haversine-distance'
const geocoder = mbxGeocoding({ accessToken: process.env.MAP_TOKEN });
const router = e.Router();

router.use(cors())
router.use(bodyParser.json())

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


router.post('/calculate-point', async (req, res) => {
    const { originCity, destinationCity, insurance, orignalprice } = req.body;

    if (!originCity || !destinationCity) {
        return res.sendStatus(400).send('Orign and Destination city required')
    }

    try {
        const originCityCoordinates = await findOriginCityCordinates(originCity);
        const destinationCityCoordinates = await findDestinationCityCordinates(destinationCity);

        const distanceInMeters = haversine(originCityCoordinates, destinationCityCoordinates, { unit: 'km' });
        const distanceInKM = distanceInMeters / 1000;

        let basePrice = 0, weightCharges = 0, distanceCharges = 0, totalPrice = 0, insuranceCharges = 0;
        const service = req.body.shipmentType;
        const weight = req.body.weight;



        if (insurance === 'no') {
            insuranceCharges = 0;
            if (service === "Ground") {
                basePrice = 100;
                weightCharges = Math.floor(weight * 50);
                distanceCharges = Math.floor(distanceInKM * 1);
                totalPrice = basePrice + weightCharges + distanceCharges + insuranceCharges;
            } else {
                basePrice = 250;
                weightCharges = Math.floor(weight * 75);
                distanceCharges = Math.floor(distanceInKM * 1.5);
                totalPrice = basePrice + weightCharges + distanceCharges + insuranceCharges;
            }
        } else {
            insuranceCharges = (orignalprice * 0.02)
            if (service === "Ground") {
                basePrice = 100;
                weightCharges = Math.floor(weight * 50);
                distanceCharges = Math.floor(distanceInKM * 1);
                totalPrice = basePrice + weightCharges + distanceCharges + insuranceCharges;
            } else {
                basePrice = 250;
                weightCharges = Math.floor(weight * 75);
                distanceCharges = Math.floor(distanceInKM * 1.5);
                totalPrice = basePrice + weightCharges + distanceCharges + insuranceCharges;
            }
        }



        res.json({ service, basePrice, weightCharges, distanceCharges, totalPrice, insurance });
    } catch (error) {
        res.sendStatus(400).send('Error calculating distance');
    }

})

export const RateCalculator = router;