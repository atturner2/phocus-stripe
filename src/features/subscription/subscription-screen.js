import {Text, Button, View, Modal,  Alert,
    ScrollView,
    StyleSheet,
    TextInput} from 'react-native';

import stripe from 'react-native-stripe-api';
import { auth, app, db, functions} from "../../../firebase";
import * as Linking from 'expo-linking'; // If you are using expo
import React, {useEffect, useState} from 'react';
import {doc, setDoc, addDoc, collection, onSnapshot, getDoc} from "firebase/firestore";
import {useStripe,  initStripe, CardField, CardForm} from '@stripe/stripe-react-native';
import { getFunctions, httpsCallable, connectFunctionsEmulator } from 'firebase/functions';
import { LoadingComponent } from "../Loading/loading-component";

const apiKey = 'pk_test_51LAxFUFeFoS9xrDyWQFVec7a8mwMMbleChpSxUjkSGdGf12dzjwCNYco79CM2ALo1UBtLFNXB6IcIkwstVXgHJbM00A8KqAafS';  // Your Stripe publishable key
const client = new stripe(apiKey);
export const SubscriptionScreen = ({navigation}) => {
    const [isActive, setIsActive] = useState(true);
    const [isPaymentFailed, setIsPaymentFailed] = useState(false)
    const [isLoading, setIsLoading] = useState(false);
    const [cardHolderName, setCardHolderName] = useState('');
    // This is to hold the cardholder's name
    const [firstTimeCustomer, setFirstTimeCustomer] = useState(true);

    useEffect(() => {
        Linking.addEventListener('url', handleUrl);

        // Clean up event listener on component unmount
        return () => {
            //Linking.eventlistener;
            console.log("Should be removing eventlistener")
        };
    }, []);

    useEffect( () => {
        const fetchUserInfo = async () => {
            const docRef = doc(db, 'customers', auth.currentUser.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                console.log("Here is the user: ", docSnap.data().customerId);
                if (docSnap.data().customerId) {
                    console.log("has a customer ID");
                    setFirstTimeCustomer(false);
                } else {
                    setFirstTimeCustomer(true);
                    console.log("brand new user, no customer ID");
                }
                if(docSnap.data().isActive === "Active") {
                    setIsActive(true);
                    console.log("User has a current subscription");
                } else {
                    setIsActive(false);
                    console.log("User does not have a current subscription");
                }
            } else {
                console.log("Some issue getting the user");
            }


        };

        fetchUserInfo();
    });

        const editPaymentInformation = async () => {

            // Function to be called when the button is pressed
            // Get the card details from the user
            const cardNumber = '4242424242424242';  // these are test details
            const expMonth = 12;
            const expYear = 24;
            const cvc = '123';

            // Create a Stripe token with the card details
            const token = await client.createToken({
                number: cardNumber,
                exp_month: expMonth,
                exp_year: expYear,
                cvc: cvc,
            });
            const functions = getFunctions(app);

            const createPortalLink = httpsCallable(functions, 'ext-firestore-stripe-payments-createPortalLink');
            console.log("Creates the link");
            try {
                console.log("In the try for the link");
                const {data} = await createPortalLink({returnUrl: "https://phocus"});
                console.log("here is data returnurl: ", data.url.returnUrl);  // "Hello from new firebase function Firebase!"

                if (data && data.url) {
                    console.log("Here inside the if statement")
                    Linking.openURL(data.url);
                }
            } catch (error) {
                console.error('Error calling link function', error);
            }
        };


        const [modal1Visible, setModal1Visible] = useState(false);
        const [modal2Visible, setModal2Visible] = useState(false);

        const {createToken} = useStripe();


        function handleUrl(event) {
            let {path, queryParams} = Linking.parse(event.url);

            if (path === 'success') {
                Alert.alert("Success!");

                // Handle successful checkout here
                setModal1Visible(!modal1Visible);
            } else if (path === 'cancel') {
                Alert.alert("Failure!");

                setModal1Visible(!modal1Visible);
            }
        }

        const cancelPhocusPremium = async () => {
            setIsLoading(true);
            const cancelPhocusPremium = httpsCallable(functions, "cancelPhocusPremium");
            const uid = auth.currentUser.uid

            const params = {
                // Your parameters here
                uid: uid,
            };
            try {
                const subscriptionResponse = await cancelPhocusPremium(params);
                console.log("Successfully cancelled the subscription ", subscriptionResponse);
                setModal2Visible(!modal2Visible)
                Alert.alert(
                    "Premium Subscription Cancelled", // Title of the alert
                    "You have successfully cancelled your premium subscription. You can resubscribe anytime.", // Message of the alert
                    [
                        { text: "OK", onPress: () => console.log("OK Pressed") }
                    ],
                    { cancelable: true } // Allows the user to cancel the alert by tapping outside of it
                );
            } catch (error) {
                console.log("Error calling Cancel Stripe Subscription", error.message);
            }
            setIsLoading(false);
        }
        const resubscribeWithOldPaymentMethod = async () => {
            console.log("resubscribing with old payment method!");
            const uid = auth.currentUser.uid
            const params = {
                // Your parameters here
                uid: uid,
            };
            const reactivateSubscription = httpsCallable(functions, "reactivateExistingSubscription");
            try {
                const subscriptionResponse = await reactivateSubscription(params);
                console.log("Stripe Subscription Successfully Created!! ", subscriptionResponse);
                setModal1Visible(!modal1Visible)
                Alert.alert(
                    "Premium Subscription Reactivated", // Title of the alert
                    "You have successfully Reactivated your premium subscription.", // Message of the alert
                    [
                        { text: "OK", onPress: () => console.log("OK Pressed") }
                    ],
                    { cancelable: true } // Allows the user to cancel the alert by tapping outside of it
                );
            } catch (error) {
                console.log("Error calling Create Stripe Subscription", error.message);
            }
        }
        const firstPhocusSubscription = async () => {

            setIsLoading(true);
            const cardNumber = '4242424242424242';  // these are test details
            const expMonth = 12;
            const expYear = 2024;
            const cvc = '123';


            // Create a Stripe token with the card details
            const hardCodedToken = await client.createToken({
                number: cardNumber,
                exp_month: expMonth,
                exp_year: expYear,
                cvc: cvc,
                name: cardHolderName,
            });
            if (hardCodedToken.error == null) {
                console.log("valid hardcoded token")
            } else {
                console.log("ERROR IN THE HARDCODED TOKEN");
            }


            console.log("hardcoded token: ", hardCodedToken);

            await initStripe({
                publishableKey: 'pk_test_51LAxFUFeFoS9xrDyWQFVec7a8mwMMbleChpSxUjkSGdGf12dzjwCNYco79CM2ALo1UBtLFNXB6IcIkwstVXgHJbM00A8KqAafS',
            });
            const uid = auth.currentUser.uid
            console.log("Here is cardholder name: ", cardHolderName);
            try {
                const inputToken = await createToken({
                    type: 'Card',
                    name: cardHolderName,
                });
                if (inputToken.error == null) {
                    console.log("valid input token, here is the token: ", inputToken.token)
                } else {
                    console.error("ERROR IN THE INPUT TOKEN: ", inputToken.error);
                }
                const params = {
                    // Your parameters here
                    token: inputToken.token,
                    uid: uid,
                };

                const createFirstStripeSubscription = httpsCallable(functions, "createFirstStripeSubscription");
                try {
                    const subscriptionResponse = await createFirstStripeSubscription(params);
                    console.log("Stripe Subscription Successfully Created!! ", subscriptionResponse);
                } catch (error) {
                    console.log("Error calling Create Stripe Subscription", error.message);
                }
                setIsLoading(false);
            } catch (error) {
                console.log("there was an error creating the stripe token: ", error);
            }
        }


        const createDoc = async () => {
            const successUrl = 'https://dashboard.stripe.com/test/customers/cus_NxGmdSi2xlOpMW';
            const cancelUrl = 'google.com';
            const uid = auth.currentUser.uid; // current user's uid
            const priceId = "price_1N2M67FeFoS9xrDytg6E1v7d";
            // Add a new document to the 'checkout_sessions' collection
            try {
                const docRef = collection(db, 'customers', uid, 'checkout_sessions');
                const payload = {
                    price: priceId,  // your actual price ID
                    success_url: successUrl, // You need to set this url
                    cancel_url: cancelUrl, // You need to set this url
                    mode: 'subscription',
                }

                const newDoc = await addDoc(docRef, payload);
                console.log("must be something with snap");

                docRef.onSnapshot((snap) => {
                    const {error, url} = snap.data("checkout_sessions");
                    if (error) {
                        // Show an error to your customer and
                        // inspect your Cloud Function logs in the Firebase console.
                        alert(`An error occured: ${error.message}`);
                    }
                    if (url) {
                        // We have a Stripe Checkout URL, let's redirect.
                        window.location.assign(url);
                    }
                });
            } catch (error) {
                console.log("There error is down here");
                console.error("Error creating checkout session: ", error.message);
            }
        }
//Scenario 1: brand new user, should only see the initial sign up link
//Scenario 2: Current Premium Subscriber, should see "Edit existing Payment" and "Cancel my Premium Subscription"
//Scenario 3: previous premium subscriber should be able to reactivate their subscription.  I say we just
    //use the same modal and have an if in there that offers to let them use a previous payment method
    // if they are NOT a brand new customer. This would be another backend cloud function to be added.
        return (
            <>
                {!isLoading ? (
                    <>
                        <Button title="Go back" onPress={() => navigation.goBack()}/>
                        <View style={{marginTop: 22}}>
                            <Modal
                                animationType="slide"
                                transparent={false}
                                visible={modal1Visible}
                                onRequestClose={() => {
                                    setModal1Visible(!modal1Visible);
                                }}
                            >
                                <View style={{marginTop: 22}}>
                                    <View>

                                        <CardField
                                            postalCodeEnabled={true}
                                            placeholder={{
                                                number: '4242 4242 4242 4242',
                                            }}
                                            cardStyle={{
                                                backgroundColor: '#FFFFFF',
                                                textColor: 'black', // The color of the entered text
                                                placeholderColor: 'black', // The color of the placeholder text
                                            }}
                                            style={styles.cardField}
                                        />
                                        <TextInput
                                            placeholder="Cardholder's Name"
                                            value={cardHolderName}
                                            onChangeText={text => setCardHolderName(text)}
                                        />
                                        <Button onPress={firstPhocusSubscription} title="Sign up with entered payment method"/>
                                    </View>
                                </View>
                                {!firstTimeCustomer ? (
                                    <View>
                                        <Button
                                            onPress={resubscribeWithOldPaymentMethod}
                                            title="Resubscribe With Existing Payment Method"
                                        />
                                    </View>
                                    ) : (<></>)
                                }
                                <View>
                                    <Button
                                        onPress={() => setModal1Visible(!modal1Visible)}
                                        title="Close"
                                    />
                                </View>
                            </Modal>
                            <Modal
                                animationType="slide"
                                transparent={false}
                                visible={modal2Visible}
                                onRequestClose={() => {
                                    setModal2Visible(!modal2Visible);
                                }}
                            >
                                <View style={{marginTop: 22}}>
                                    <View>
                                        <Text>Are you sure you want to cancel your Phocus Premium Subscription?</Text>
                                        <Button onPress={cancelPhocusPremium} title="Cancel Phocus Premium"/>
                                        <Button
                                            onPress={() => setModal2Visible(!modal2Visible)}
                                            title="Close"
                                        />
                                    </View>
                                </View>
                            </Modal>
                            {!isActive ? (
                            <Button
                                onPress={() => setModal1Visible(true)}
                                title="Sign up for Phocus Premium"
                            /> ) : (
                                    <>
                                        <Button title="Edit Existing Payment Information" onPress={editPaymentInformation}></Button>
                                        <Button onPress={() => setModal2Visible(true)}
                                        title="Cancel my Phocus Premium Subscription"
                                    />
                                </>
                            )}
                        </View>
                    </>
                ) : (
                    <LoadingComponent></LoadingComponent>
                )}
            </>
        )
    };

const styles = StyleSheet.create({
    cardField: {
        width: '100%',
        height: 50,
        marginVertical: 30,
        textColor: '#000000',

    },
    cardFieldInput: {
        borderWidth: 1,
        backgroundColor: '#FFFFFF',
        borderColor: '#000000',
        borderRadius: 8,
        fontSize: 14,
        placeholderColor: '#999999',
        textColor: '#000000',

    },
    cardForm: {
        alignItems:'center',
        width: '90%',
        height: 170,
        marginVertical: 30,
        marginLeft: '5%',
        marginRight: '5%',
        textColor: '#000000',
    },


});




