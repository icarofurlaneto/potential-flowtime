import { onCall, HttpsError, onRequest } from "firebase-functions/v2/https";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import Stripe from "stripe";

// Initialize Firebase Admin
initializeApp();
const db = getFirestore();

// Helper to get Stripe instance lazily
let stripeInstance: Stripe | null = null;
const getStripe = () => {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) {
    console.error("CRITICAL: STRIPE_SECRET_KEY is missing from secrets.");
    throw new Error("STRIPE_SECRET_KEY is not defined.");
  }
  if (!stripeInstance) {
    stripeInstance = new Stripe(apiKey, {
      apiVersion: "2025-02-24.acacia",
    });
  }
  return stripeInstance;
};

export const createCheckoutSession = onCall(
  { 
    secrets: ["STRIPE_SECRET_KEY"],
    cors: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://flowtimer-54d6c.web.app",
      "https://flowtimer-54d6c.firebaseapp.com",
      "https://flowtimepro.vercel.app/", 
    ],
    maxInstances: 10 
  },
  async (request) => {
    // 1. Check Authentication
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "User must be logged in.");
    }

    const userId = request.auth.uid;
    const userEmail = request.auth.token.email;

    // 2. Check if user is already premium or has a customer ID
    const userDoc = await db.collection("users").doc(userId).get();
    const userData = userDoc.data();
    
    if (userData?.isPremium === true) {
      throw new HttpsError("already-exists", "User is already a premium member.");
    }
    
    const existingCustomerId = userData?.stripeCustomerId;

    // 3. Validate environment
    const priceId = process.env.STRIPE_PRICE_ID;
    if (!priceId) {
      console.error("CRITICAL: STRIPE_PRICE_ID is missing.");
      throw new HttpsError("internal", "Price ID missing.");
    }

    try {
      const stripe = getStripe();
      const baseUrl = (process.env.CLIENT_URL || "http://localhost:5173").replace(/\/$/, "");

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "subscription",
        line_items: [{ price: priceId, quantity: 1 }],
        customer: existingCustomerId, // Reuse customer if exists
        customer_email: existingCustomerId ? undefined : userEmail, // Only email if new
        metadata: { userId },
        success_url: `${baseUrl}/?success=true`,
        cancel_url: `${baseUrl}/?canceled=true`,
      });

      return { url: session.url };
    } catch (error: any) {
      console.error("Stripe Checkout Error:", error);
      throw new HttpsError("internal", error.message || "Failed to create checkout session.");
    }
  }
);

export const stripeWebhook = onRequest(
  { secrets: ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET"] },
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
    
    try {
      const stripe = getStripe();
      const event = stripe.webhooks.constructEvent(req.rawBody, sig as string, endpointSecret);

              if (event.type === "checkout.session.completed") {

                const session = event.data.object as Stripe.Checkout.Session;

                const userId = session.metadata?.userId;

                const customerId = session.customer as string;

          

                if (userId) {

                  await db.collection("users").doc(userId).set({ 

                    isPremium: true,

                    stripeCustomerId: customerId // Save this to link stripe events back to this user

                  }, { merge: true });

                  console.log(`✅ User ${userId} upgraded to Premium.`);

                }

              }

      

          if (event.type === "customer.subscription.deleted") {

            const subscription = event.data.object as Stripe.Subscription;

            // In subscriptions, we need to find the user by their Stripe Customer ID 

            // or store the userId in the subscription metadata.

            // For now, let's look for the user document that has this stripe customer ID.

            const customerId = subscription.customer as string;

            const userSnapshot = await db.collection("users").where("stripeCustomerId", "==", customerId).limit(1).get();

            

            if (!userSnapshot.empty) {

              const userDoc = userSnapshot.docs[0];

              await userDoc.ref.update({ isPremium: false });

              console.log(`❌ User ${userDoc.id} Premium revoked (Subscription deleted).`);

            }

          }

      

          res.json({ received: true });
    } catch (err: any) {
      console.error("Webhook Error:", err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }
);
