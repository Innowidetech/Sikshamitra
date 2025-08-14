import React, { useState } from "react";
import { SectionHeader } from "./studentdashboard/common/SectionHeader";
import { loadRazorpayScript } from "./studentdashboard/utils/razorpay";

const PaymentForm = ({ onNext, onBack, onSubmit }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardOwner, setCardOwner] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [setDefault, setSetDefault] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) throw new Error("Razorpay SDK failed to load");

      const options = {
        key: "rzp_test_N2JZTugUiv8bEs",
        currency: "INR",
        amount: 50000,
        name: "Shiksha Mitra",
        description: "Education Fee Payment",
        image: "your-logo-url",
        prefill: {
          name: cardOwner || "Student Name",
          email: "student@example.com",
          contact: "9999999999",
        },
        theme: { color: "#1982C4" },
        handler: async (response) => {
          const paymentData = {
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
          };
          await onSubmit(paymentData);
          onNext();
        },
        modal: { ondismiss: () => setIsProcessing(false) },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ fontFamily: "Poppins" }}>
      {/* Banner Header */}
      <div className="w-full bg-[#FF9F1C] px-4 sm:px-8 md:px-12 flex flex-col md:flex-row items-center md:justify-between gap-4 shadow-md">
        <h1 className="text-white text-lg sm:text-xl md:text-3xl font-semibold text-center md:ml-8">
          Online Application Form
        </h1>
        <img
          src="src/assets/entrance-banner.png"
          alt="Entrance Exam"
          className="h-28 sm:h-32 md:h-40 object-contain"
        />
      </div>

      <div className="p-4 sm:p-6 w-full md:mt-10 lg:mt-16 grid xl:max-w-5xl mx-auto">
        <SectionHeader title="PAYMENT DETAILS" />

        <form
          onSubmit={handlePayment}
          className="space-y-6 w-full max-w-full md:max-w-3xl lg:max-w-5xl"
        >
          {/* Card Container */}
          <div className="bg-[#E9F4FB] border rounded-lg p-4 sm:p-6 shadow-sm">
            {/* Top Row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <input type="radio" checked readOnly />
                <span className="font-medium text-gray-700 text-sm sm:text-base">
                  Add new card
                </span>
              </div>
              <div className="flex items-center gap-2">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png"
                  alt="MasterCard"
                  className="h-5 sm:h-6"
                />
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png"
                  alt="Visa"
                  className="h-5 sm:h-6"
                />
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/5/59/Troy_logo.svg"
                  alt="Troy"
                  className="h-5 sm:h-6"
                />
              </div>
            </div>

            {/* Card Number */}
            <div className="mb-4">
              <label className="block text-xs sm:text-sm text-gray-600">
                Card number
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="Enter the 16-digit card number"
                  className="w-full border rounded-md px-3 py-2 text-sm sm:text-base pr-10"
                />
                <span className="absolute right-3 top-2.5 text-gray-400">💳</span>
              </div>
            </div>

            {/* Card Owner */}
            <div className="mb-4">
              <label className="block text-xs sm:text-sm text-gray-600">
                Card owner
              </label>
              <input
                type="text"
                value={cardOwner}
                onChange={(e) => setCardOwner(e.target.value)}
                placeholder="Enter the name on the card"
                className="w-full border rounded-md px-3 py-2 text-sm sm:text-base"
              />
            </div>

            {/* Expiry & CVV */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs sm:text-sm text-gray-600">
                  Expiry date
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength="2"
                    value={expiryMonth}
                    onChange={(e) => setExpiryMonth(e.target.value)}
                    placeholder="MM"
                    className="w-full border rounded-md px-3 py-2 text-sm sm:text-base"
                  />
                  <input
                    type="text"
                    maxLength="2"
                    value={expiryYear}
                    onChange={(e) => setExpiryYear(e.target.value)}
                    placeholder="YY"
                    className="w-full border rounded-md px-3 py-2 text-sm sm:text-base"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs sm:text-sm text-gray-600">
                  CVV2
                </label>
                <input
                  type="password"
                  maxLength="3"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  placeholder="Security code"
                  className="w-full border rounded-md px-3 py-2 text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Set Default */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={setDefault}
                onChange={(e) => setSetDefault(e.target.checked)}
              />
              <label className="text-xs sm:text-sm text-gray-600">
                Set as default
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-6">
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm sm:text-base"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className={`px-4 py-2 bg-[#1982C4] text-white rounded-md text-sm sm:text-base ${
                isProcessing ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isProcessing ? "Processing..." : "Proceed"}
            </button>
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm sm:text-base"
            >
              Skip
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
