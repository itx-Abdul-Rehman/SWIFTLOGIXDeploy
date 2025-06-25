import mongoose from "mongoose";

const insuranceClaimModel = new mongoose.Schema({
    trackingid: { type: String, required: true },
    email: { type: String, required: true },
    description: { type: String, required: true },
    shipmentValueProof: { type: String, required: true },
    otherSupportingDocument: { type: String, required: true },
    city: { type: String, required: true },
    datetime: { type: String, required: true },
    claimStatus: { type: String, required: true },
});

export const insuranceClaim = mongoose.model('insuranceclaim', insuranceClaimModel);