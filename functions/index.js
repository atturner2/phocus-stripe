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
const Stripe = require("stripe");
//const failedPaymentSecret = require(functions.config().failedsubscriptionpayment.secret);
const cors = require("cors")({origin: true});
const admin = require('firebase-admin');
admin.initializeApp();

const {user} = require("firebase-functions/v1/auth");
const url = require('url');

const customersRef = admin.firestore().collection('customers');
const failedSubscriptionsRef = admin.firestore().collection('failedSubscriptions');

exports.addIsActiveField = functions.firestore
    .document('customers/{uid}')
    .onCreate((snap, context) => {
      // Add isActive field and set to false
      return snap.ref.set({
        isActive: "inActive"
      }, { merge: true }); // Using merge: true to avoid overwriting existing data
    });
//inActive, Active, or paymentFailed

exports.handleFailedPaymentTest = functions.https.onRequest((req, res) => {
console.log("here is the failed paymenttester");
});

exports.handleFailedPayment = functions.https.onRequest(async (req, res) => {
  const stripeSecretKey = functions.config().stripe;
  const stripeClient = new Stripe(stripeSecretKey.secret);
  const sig = req.headers["stripe-signature"];

  const event = req.body;

  if (event.type === "invoice.payment_failed") {
    const invoice = event.data.object;
    console.log("Here is the invoice: ", invoice)
    // Handle the failed payment (e.g. notify the user, update database, etc.)

//first we record the time of the failed payment
    const currentTime = Math.floor(Date.now() / 1000); // Current time in Unix timestamp (seconds)
    console.log("Here is the current time: ", currentTime);
    console.log("Here is the customer id from the response: ", invoice.customer);
//then we send the user an email saying their payment failed
    try {
      const stripeCustomerId = invoice.customer;
      const userQuerySnapshot = await customersRef.where('stripeId', '==', "cus_OD7omQzCxDSzLZ").get();
      console.log("user query snapshot: ", userQuerySnapshot);
      const userDoc = userQuerySnapshot.docs[0];
      const userData = userDoc.data();
      console.log("Here is the user data! ", userData);
      console.log("Here is the uid: ", userData.customerId)
      //setIsActive to "paymentFailed"

      /*
      const userRecordRef = await admin.firestore().collection('customers').doc("cus_O47npKPafC9tXj");
      const userRecord = await userRecordRef.get();
      console.log("Here is the userrecordref: ", userRecordRef);
      console.log("Here is the userrecord: ", userRecord)
      */
      await customersRef.where('stripeId', '==', userData.customerId).update({
        isActive: "paymentFailed"
      })

    } catch (error) {
      console.error("Error cancelling Subscription: ", error);

    }
//then we set THE flag to have a warning flash in the app whenever they open it that they can't get rid
    //we do this by setting the isActive to paymentFailed
//of UNLESS they either update payment OR cancel their premium subscription
// then we add their user to the database of failed subscriptions in Firebase and call the handler for that
//then we write a function that goes through that database and cancels the subscriptions that aren't fixed. Note
//so when payment methods succeed we have to turn that flag off or else they get the warning AND get charged and then
// they get super mad


    // Return a response to acknowledge receipt of the event
    res.json({received: true});
  } else {
    res.status(400).end();
  }
});

exports.cancelPhocusPremium = functions.https.onCall(async (data, context) => {
  console.log("Here is the data we get here, should be enough to cancel the subscription. ", data);
  const uid = data.uid;
  const stripeSecretKey = functions.config().stripe;
  const stripeClient = new Stripe(stripeSecretKey.secret);
 try {

   const userRecordRef = await admin.firestore().collection('customers').doc(uid);
   const userRecord = await userRecordRef.get();
   if (!userRecord.exists || (!userRecord.data().isActive === "Active")) {
     return "User does not have an active stripe subscription to cancel";
   }
   // Retrieve Stripe subscription ID
   const stripeSubscriptionId = userRecord.get("subscriptionId");
   console.log("Here is the userRecord: ", userRecord);

   await stripeClient.subscriptions.del(stripeSubscriptionId);

   await userRecordRef.update({
     isActive: "inActive"
   });

 } catch (error) {
   console.error("Error cancelling Subscription: ", error);
   return "Error cancelling Subscription";
 }
});

exports.reactivateExistingSubscription = functions.https.onCall(async (data, context) => {
  const uid = data.uid;
  const userRecord = await admin.firestore().collection('customers').doc(uid).get();
  const stripeId = userRecord.get("stripeId");
  const stripeSecretKey = functions.config().stripe;
  const stripeClient = new Stripe(stripeSecretKey.secret);
  const subscription = await stripeClient.subscriptions.create({
    customer: stripeId,
    items: [{ price: "price_1N2M67FeFoS9xrDytg6E1v7d" }],
    expand: ['latest_invoice.payment_intent'],
  });

  await admin.firestore().collection('customers').doc(uid).update({
    customerId: uid,
    subscriptionId: subscription.id,
    planId: 'price_1N2M67FeFoS9xrDytg6E1v7d',
    isActive: "Active",
    // Add any additional subscription details you want to store
  });
});

// const admin = require('firebase-admin');
exports.createFirstStripeSubscription = functions.https.onCall(async (data, context) => {
  const uid = data.uid;
  const stripeSecretKey = functions.config().stripe;
  const stripeClient = Stripe(stripeSecretKey.secret);
  console.log("Here is my stripeSecretKey from line 161: ", stripeSecretKey.secret);
  const userRecord = await admin.firestore().collection('customers').doc(uid).get();
  //const tokenInfo = await stripeClient.tokens.retrieve(data.token.id);
  //const isAlreadySubscribed = userRecord.get("isActive");
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
    isActive: "Active",
    // Add any additional subscription details you want to store
  });

  return "Successfully created the Stripe subscription with the entered payment method.";
});
