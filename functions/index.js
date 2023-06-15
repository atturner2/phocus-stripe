/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");
// const {onCall} = require("firebase-functions/v2/https");
// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started
const functions = require("firebase-functions");
const stripeClient = require("stripe")(functions.config().stripe.secret);
const cors = require("cors")({origin: true});
const admin = require('firebase-admin');
const {user} = require("firebase-functions/v1/auth");
const url = require('url');



admin.initializeApp();

exports.addIsActiveField = functions.firestore
    .document('customers/{uid}')
    .onCreate((snap, context) => {
      // Add isActive field and set to false
      return snap.ref.set({
        isActive: false
      }, { merge: true }); // Using merge: true to avoid overwriting existing data
    });

exports.cancelPhocusPremium = functions.https.onCall(async (data, context) => {
  console.log("Here is the data we get here, should be enough to cancel the subscription. ", data);
  const uid = data.uid;
 try {

   const userRecordRef = await admin.firestore().collection('customers').doc(uid);
   const userRecord = await userRecordRef.get();
   if (!userRecord.exists || !userRecord.data().isActive) {
     return "User does not have an active stripe subscription to cancel";
   }
   // Retrieve Stripe subscription ID
   const stripeSubscriptionId = userRecord.get("subscriptionId");
   console.log("Here is the userRecord: ", userRecord);
   console.log("")

   await stripeClient.subscriptions.del(stripeSubscriptionId);

   await userRecordRef.update({
     isActive: false
   })

 } catch (error) {
   console.error("Error cancelling Subscription: ", error);
   return "Error cancelling Subscription";
 }
});
// const admin = require('firebase-admin');
exports.createFirstStripeSubscription = functions.https.onCall(async (data, context) => {

  const uid = data.uid;

  const userRecord = await admin.firestore().collection('customers').doc(uid).get();
  const tokenInfo = await stripeClient.tokens.retrieve(data.token.id);

  const stripeId = userRecord.get("stripeId");

  // Do something with token and uid...

  //first create the Stripe payment method
  const paymentMethod = await stripeClient.paymentMethods.create({
    type: 'card',
    card: { token: data.token.id },
  });
  console.log("Successfully got the payment method:");
  console.log("Here is the stripe id: ", stripeId);
  //now attach the stripe payment method to that user, ahrdcoded for now
  await stripeClient.paymentMethods.attach(paymentMethod.id, {
    customer: stripeId,
  });
  console.log("Successfully attached the payment method:");

  //make that payment the default for the customer
  await stripeClient.customers.update(stripeId, {
    invoice_settings: {
      default_payment_method: paymentMethod.id,
    },
  });
  console.log("successfully made the payment method default");
  // Create a premium subscription for the customer
  const subscription = await stripeClient.subscriptions.create({
    customer: stripeId,
    items: [{ price: "price_1N2M67FeFoS9xrDytg6E1v7d" }],
    expand: ['latest_invoice.payment_intent'],
  });
  console.log("successfully made the subscription.");



  await admin.firestore().collection('customers').doc(uid).update({
    customerId: uid,
    subscriptionId: subscription.id,
    planId: 'price_1N2M67FeFoS9xrDytg6E1v7d',
    isActive: true,
    // Add any additional subscription details you want to store
  });

  return "Test call!";
});

/*
  const urlParts = url.parse(request.url, true);
  const query = urlParts.query;

  // Extract the token and uid
  const token = query.token;
  const uid = query.uid;
  console.log("here is the uid form the request:", request.url);
  console.log("here is the uid: ,", uid);
  */

exports.testCallCallable = functions.https.onCall(async (data, context) => {
  const token = data.token.id;
  const uid = data.uid;
  console.log("here is the uid: ", uid);
  console.log("Here is the token string we're sending: ", token);
  const userRecord = await admin.firestore().collection('customers').doc(uid).get();
  //console.log("Here is the user!", userRecord);
  const stripeId = userRecord.get("stripeId");
  //console.log("here is the uid form the token:", request.token);
  console.log("Here is the stripeId which we don't currently use: ", stripeId);

  // Do something with token and uid...

  //first create the Stripe payment method
  const paymentMethod = await stripeClient.paymentMethods.create({
    type: 'card',
    card: { token: token },
  });
  console.log("Successfully created a payment method")
  //now attach the stripe payment method to that user, ahrdcoded for now
  await stripeClient.paymentMethods.attach(paymentMethod.id, {
    customer: stripeId,
  });
  console.log("successfully attached the stripe payment method to the customer");
  //make that payment the default for the customer
  await stripeClient.customers.update(stripeId, {
    invoice_settings: {
      default_payment_method: paymentMethod.id,
    },
  });
  // Create a premium subscription for the customer
  console.log("successfully updated the deafult payment method for the customer");

  const subscription = await stripeClient.subscriptions.create({
    customer: stripeId,
    items: [{ price: "price_1N2M67FeFoS9xrDytg6E1v7d" }],
    expand: ['latest_invoice.payment_intent'],
  });



  await admin.firestore().collection('subscriptions').doc(uid).set({
    customerId: uid,
    subscriptionId: subscription.id,
    planId: 'price_1N2M67FeFoS9xrDytg6E1v7d',
    // Add any additional subscription details you want to store
  });

  return "Test call!";
});
