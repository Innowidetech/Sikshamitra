import React, { useState } from 'react';
import { SectionHeader } from './common/SectionHeader';
import { loadRazorpayScript, initializeRazorpayPayment } from './utils/razorpay';

const PaymentForm = ({ onNext, onBack, onSubmit }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Load Razorpay script
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error('Razorpay SDK failed to load');
      }

      // Initialize payment options
      const options = {
        key: 'rzp_test_N2JZTugUiv8bEs', // Replace with your Razorpay key
        currency: 'INR',
        amount: 50000, // Amount in paise (500 INR)
        name: 'Shiksha Mitra',
        description: 'Education Fee Payment',
        image: 'your-logo-url', // Replace with your logo URL
        prefill: {
          name: 'Student Name',
          email: 'student@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#1982C4'
        },
        handler: async (response) => {
          // Send the payment data (paymentId, orderId, signature) to your backend for verification
          const paymentData = {
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature
          };

          // Call backend to verify the payment
          await onSubmit(paymentData);

          // Move to next step after successful payment
          onNext();
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-6 w-full md:mt-10 lg:mt-16 grid xl:max-w-5xl mx-auto" style={{ fontFamily: 'Poppins' }}>
      <SectionHeader title="PAYMENT DETAILS" />
      
      <div className="md:max-w-xl lg:max-w-3xl xl:max-w-5xl space-y-6">
        <div className="border rounded-lg p-6 bg-white shadow-sm">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-semibold text-[#1982C4]">Education Fee Payment</h2>
            <p className="text-gray-600">Amount: ₹500.00</p>
            <div className="flex justify-center space-x-4">
              <img 
                src="https://razorpay.com/assets/razorpay-logo.svg"
                alt="Razorpay"
                className="h-8"
              />
            </div>
            <p className="text-sm text-gray-500">Secure payment powered by Razorpay</p>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 border border-[#1982C4] rounded-md hover:bg-gray-50"
          >
            Back
          </button>
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className={`px-6 py-2 bg-[#1982C4] text-white rounded-md ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isProcessing ? 'Processing...' : 'Pay Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
