// Razorpay utility functions
export const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };
  
  export const initializeRazorpayPayment = (options: any) => {
    return new Promise((resolve, reject) => {
      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.success', (response: any) => resolve(response));
      rzp.on('payment.error', (error: any) => reject(error));
      rzp.open();
    });
  };