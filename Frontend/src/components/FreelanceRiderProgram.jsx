import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { NavLink } from "react-router-dom";
import SwiftBot from "./SwiftBot";
import OfflineOnline from "./OfflineOnline";
import FadeInSection from "./FadeInSection"; // Make sure this file exists

const FreelanceRiderProgram = () => {
    return (
        <>
            <SwiftBot />
            <Navbar />
            <OfflineOnline />

            <FadeInSection>
                <div className="w-full bg-[#009688] text-white flex justify-center items-center p-6 sm:p-8">
                    <div className="text-3xl sm:text-4xl md:text-5xl font-semibold text-center">
                        Freelance Rider Program
                    </div>
                </div>
            </FadeInSection>

            <div className="min-h-screen px-4 sm:px-8 py-6">
                <FadeInSection delay={0.1}>
                    <div className="max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-2xl shadow-lg space-y-8">
                        <FadeInSection delay={0.2}>
                            <p className="text-gray-700 text-lg leading-relaxed">
                                Become a <strong>SwiftLogix Partner</strong> by registering as a freelance rider. Deliver packages, earn rewards, and get paid — all on your own schedule.
                            </p>
                        </FadeInSection>

                        <FadeInSection delay={0.2}>
                            <section>
                                <h2 className="text-2xl font-semibold mb-2 text-gray-800">How It Works</h2>
                                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                    <li>Register online to become a freelance delivery rider.</li>
                                    <li>Accept available deliveries from the SwiftLogix rider dashboard.</li>
                                    <li>Pick up shipments from the origin city's SwiftLogix shop/office/franchise.</li>
                                    <li>Deliver the package to the destination city’s SwiftLogix shop/office/franchise.</li>
                                </ul>
                            </section>
                        </FadeInSection>

                        <FadeInSection delay={0.2}>
                            <section>
                                <h2 className="text-2xl font-semibold mb-2 text-gray-800">Completion & Rewards</h2>
                                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                    <li>Once a shipment is delivered successfully, it is marked as <strong>completed</strong>.</li>
                                    <li>You earn <strong>points</strong> for every successful delivery, added to your SwiftLogix Wallet.</li>
                                    <li>Points can be redeemed for money.</li>
                                </ul>
                            </section>
                        </FadeInSection>

                        <FadeInSection delay={0.2}>
                            <section>
                                <h2 className="text-2xl font-semibold mb-2 text-gray-800">Wallet & Withdrawal</h2>
                                <ol className="list-decimal pl-6 text-gray-700 space-y-1">
                                    <li>Log in to your SwiftLogix rider account.</li>
                                    <li>Open your <strong>Wallet</strong> to view your earned points.</li>
                                    <li>Select the amount of points you want to withdraw.</li>
                                    <li>Select a withdrawal method: <strong>Online/Card</strong> or <strong>Cash</strong>.</li>
                                    <li>
                                        If choosing <strong>Cash</strong>, save the withdrawal confirmation/screenshot and visit your nearest SwiftLogix shop/franchise to collect the cash.
                                    </li>
                                </ol>
                                <p className="text-gray-700 mt-2">
                                    <strong>Note:</strong> Redemption rates and withdrawal limits may vary.
                                </p>
                            </section>
                        </FadeInSection>

                        <FadeInSection delay={0.2}>
                            <section>
                                <h2 className="text-2xl font-semibold mb-2 text-gray-800">Start Earning Today</h2>
                                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                    <li>No prior experience needed.</li>
                                    <li>Real-time delivery updates and earnings tracking.</li>
                                </ul>
                                <p className="text-gray-700 mt-2">
                                    <NavLink to="/rider-signup" className="text-blue-600 underline hover:text-blue-800">
                                        Register now
                                    </NavLink>{" "}
                                    and become a SwiftLogix partner rider.
                                </p>
                            </section>
                        </FadeInSection>

                        <FadeInSection delay={0.2}>
                            <p className="text-gray-700 text-center pt-6 border-t">
                                Help us deliver across cities — and grow with SwiftLogix.
                            </p>
                        </FadeInSection>
                    </div>
                </FadeInSection>
            </div>

            <Footer />
        </>
    );
};

export default FreelanceRiderProgram;
