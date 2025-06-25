import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { NavLink } from "react-router-dom";
import SwiftBot from "./SwiftBot";
import OfflineOnline from "./OfflineOnline";
import FadeInSection from "./FadeInSection"; // make sure this exists

const InsurancePolicy = () => {
    return (
        <>
            <SwiftBot />
            <Navbar />
            <OfflineOnline />

            <FadeInSection>
                <div className="w-full bg-[#009688] text-white flex justify-center items-center p-6 sm:p-8">
                    <div className="text-3xl sm:text-4xl md:text-5xl font-semibold text-center">
                        Shipment Insurance Policy
                    </div>
                </div>
            </FadeInSection>

            <div className="min-h-screen px-4 sm:px-8 py-6">
                <FadeInSection delay={0.1}>
                    <div className="max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-2xl shadow-lg space-y-8">
                        <FadeInSection delay={0.2}>
                            <p className="text-gray-700 text-lg leading-relaxed">
                                At <strong>SwiftLogix</strong>, we understand the value of your shipment. That’s why we offer a comprehensive <strong>Insurance Policy</strong> designed to protect your goods against unforeseen incidents like <strong>loss, damage, or theft</strong> during transit.
                            </p>
                        </FadeInSection>

                        <FadeInSection delay={0.2}>
                            <section>
                                <h2 className="text-2xl font-semibold mb-2 text-gray-800">What’s Covered?</h2>
                                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                                    <li>Shipment <strong>loss</strong> during transit</li>
                                    <li>Shipment <strong>damage</strong> due to handling or accidents</li>
                                    <li>Shipment <strong>theft</strong> or <strong>misplacement</strong></li>
                                </ul>
                            </section>
                        </FadeInSection>

                        <FadeInSection delay={0.2}>
                            <section>
                                <h2 className="text-2xl font-semibold mb-2 text-gray-800">Insurance Cost</h2>
                                <p className="text-gray-700 mb-2">
                                    The insurance premium is <strong>2% of your shipment's declared original value</strong>.
                                </p>
                                <p className="text-gray-700 italic">Example:</p>
                                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                                    <li>Declared Value: Rs.500</li>
                                    <li>Insurance Cost: Rs.10</li>
                                    <li>Total Refund if covered: Rs.500</li>
                                </ul>
                            </section>
                        </FadeInSection>

                        <FadeInSection delay={0.2}>
                            <section>
                                <h2 className="text-2xl font-semibold mb-2 text-gray-800">Refund Policy</h2>
                                <p className="text-gray-700 mb-2">
                                    If your insured shipment is <strong>lost, stolen, or damaged</strong>, SwiftLogix will:
                                </p>
                                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                                    <li>Refund the <strong>full declared value</strong> of your shipment (100%)</li>
                                    <li>Process the refund within <strong>7–14 business days</strong> after submit claim</li>
                                </ul>
                            </section>
                        </FadeInSection>

                        <FadeInSection delay={0.2}>
                            <section>
                                <h2 className="text-2xl font-semibold mb-2 text-gray-800">How to Insure Your Shipment</h2>
                                <ol className="list-decimal pl-6 text-gray-700 space-y-1">
                                    <li>Select the <strong>“Insurance”</strong> option during Schedule Shipment.</li>
                                    <li>Enter your shipment’s <strong>original value</strong> (invoice or receipt may be required).</li>
                                    <li>The system will calculate and add the <strong>2% insurance fee</strong> to your total.</li>
                                </ol>
                            </section>
                        </FadeInSection>

                        <FadeInSection delay={0.2}>
                            <section>
                                <h2 className="text-2xl font-semibold mb-2 text-gray-800">Important Notes</h2>
                                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                                    <li>Claims must be submitted within <strong>7 days</strong> of the scheduled delivery date.</li>
                                    <li>Proof of value (e.g., invoice or receipt) is required for claims.</li>
                                    <li>Insurance does <strong>not cover</strong> delays, prohibited items, or incorrect address issues.</li>
                                </ul>
                            </section>
                        </FadeInSection>

                        <FadeInSection delay={0.2}>
                            <section>
                                <h2 className="text-2xl font-semibold mb-2 text-gray-800">Claim Process</h2>
                                <p className="text-gray-700 mb-2">
                                    To file a claim, visit:{" "}
                                    <NavLink
                                        className="text-blue-600 underline hover:text-blue-800 transition"
                                        to={`/file-claim`}
                                    >
                                        Insurance Claim
                                    </NavLink>
                                </p>
                                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                                    <li>Tracking number</li>
                                    <li>Description of the issue</li>
                                    <li>Proof of shipment value</li>
                                    <li>Any supporting photos or documents</li>
                                </ul>
                            </section>
                        </FadeInSection>

                        <FadeInSection delay={0.2}>
                            <p className="text-gray-700 text-center pt-6 border-t">
                                We’re committed to delivering your items safely—and ensuring peace of mind if anything goes wrong.
                            </p>
                        </FadeInSection>
                    </div>
                </FadeInSection>
            </div>

            <Footer />
        </>
    );
};

export default InsurancePolicy;
