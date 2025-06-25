import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import SwiftBot from "./SwiftBot";
import OfflineOnline from "./OfflineOnline";
import FadeInSection from "./FadeInSection";

const PaymentMethods = () => {
  return (
    <>
      <SwiftBot />
      <Navbar />
      <OfflineOnline />

      <FadeInSection>
        <div className="w-full bg-[#009688] text-white flex justify-center items-center p-6 sm:p-8">
          <div className="text-3xl sm:text-4xl md:text-5xl font-semibold text-center">
            Payment Methods
          </div>
        </div>
      </FadeInSection>

      <div className="min-h-screen px-4 sm:px-8 py-6">
        <FadeInSection delay={0.1}>
          <div className="max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-2xl shadow-lg space-y-8">
            <FadeInSection delay={0.2}>
              <p className="text-gray-700 text-lg leading-relaxed">
                At <strong>SwiftLogix</strong>, we offer multiple convenient
                payment options to make your shipment experience smooth and
                flexible. Choose the method that works best for you.
              </p>
            </FadeInSection>

            <FadeInSection delay={0.3}>
              <section>
                <h2 className="text-2xl font-semibold mb-2 text-gray-800">
                  Available Payment Methods
                </h2>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>
                    <strong>Cash Payment</strong>
                    <br />
                    Pay in cash at the time of pickup or delivery. Ideal for
                    those who prefer traditional transactions.
                  </li>
                  <li>
                    <strong>Online Payment</strong>
                    <br />
                    Use your <strong>credit or debit card</strong> through our
                    secure online payment gateway.
                  </li>
                  <li>
                    <strong>SwiftLogix Wallet</strong>
                    <br />
                    An exclusive reward-based wallet for registered customers.
                    Earn and redeem points for shipments.
                  </li>
                </ul>
              </section>
            </FadeInSection>

            <FadeInSection delay={0.2}>
              <section>
                <h2 className="text-2xl font-semibold mb-2 text-gray-800">
                  SwiftLogix Wallet
                </h2>
                <p className="text-gray-700 mb-2">
                  The <strong>SwiftLogix Wallet</strong> is a loyalty-based
                  digital wallet available only to{" "}
                  <strong>registered customers</strong>. Here's how it works:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>
                    For every <strong>completed shipment</strong>, customers
                    earn <strong>50 points</strong>.
                  </li>
                  <li>
                    Points are added automatically after successful delivery.
                  </li>
                  <li>
                    When you accumulate <strong>250 points</strong>, you can
                    redeem them to fully pay for your next shipment.
                  </li>
                  <li>
                    Points can only be used by logged-in customers with active
                    accounts.
                  </li>
                </ul>
                <p className="text-gray-700 mt-2">
                  <strong>Note:</strong> Wallet access and usage are restricted
                  to verified users with active accounts.
                </p>
              </section>
            </FadeInSection>

            <FadeInSection delay={0.2}>
              <p className="text-gray-700 text-center pt-6 border-t">
                Your convenience is our priority. Choose the payment method that
                suits you best.
              </p>
            </FadeInSection>
          </div>
        </FadeInSection>
      </div>

      <Footer />
    </>
  );
};

export default PaymentMethods;
