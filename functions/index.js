/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
/*
const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const {subscribeRequest} = require("./subscribe");
const stripeClient = require("stripe")(functions.config().stripe.key);

*/

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started
/*
exports.subscribe = functions.https.onRequest((request, response) => {
    subscribeRequest(request, response, stripeClient);
});
*/
 exports.helloWorld = onRequest((request, response) => {
   logger.info("Hello logs, logs have been updated, so has the message!", {structuredData: true});
   response.send("Hello from Firebaseeeeeeee!");
 });
