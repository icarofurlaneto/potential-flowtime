import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '../firebase';

export const paymentService = {
  async startCheckout() {
    if (!app) {
      alert("Firebase is not configured. Please check your .env file.");
      return;
    }
    
    // Explicitly set region to us-central1 (default for firebase functions)
    const functions = getFunctions(app, 'us-central1');
    const createCheckoutSession = httpsCallable(functions, 'createCheckoutSession');
    
    try {
      console.log("Starting checkout session...");
      const result = await createCheckoutSession();
      const { url } = result.data as { url: string };
      
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("No URL returned from checkout session.");
      }
    } catch (error) {
      // Detailed error logging
      const err = error as { code?: string; message?: string; details?: unknown };
      console.error("Checkout failed details:", {
        code: err.code,
        message: err.message,
        details: err.details
      });
      throw error;
    }
  }
};
