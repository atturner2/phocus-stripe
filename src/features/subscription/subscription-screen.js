import {Text, Button, View, Modal,  Alert,
    ScrollView,
    StyleSheet,
    TextInput} from 'react-native';
import stripe from 'react-native-stripe-api';
import { auth, app, db, functions} from "../../../firebase";
import * as Linking from 'expo-linking'; // If you are using expo
import React, {useEffect, useState} from 'react';
import { doc, setDoc, addDoc, collection, onSnapshot} from "firebase/firestore";
import {useStripe,  initStripe, CardForm} from '@stripe/stripe-react-native';



import { getFunctions, httpsCallable, connectFunctionsEmulator } from 'firebase/functions';



const apiKey = 'pk_test_51LAxFUFeFoS9xrDyWQFVec7a8mwMMbleChpSxUjkSGdGf12dzjwCNYco79CM2ALo1UBtLFNXB6IcIkwstVXgHJbM00A8KqAafS';  // Your Stripe publishable key
const client = new stripe(apiKey);
export const SubscriptionScreen = ({navigation}) => {

    const [cardHolderName, setCardHolderName] = useState('');
    // This is to hold the cardholder's name

    useEffect(() => {
        Linking.addEventListener('url', handleUrl);

        // Clean up event listener on component unmount
        return () => {
            //Linking.eventlistener;
            console.log("Should be removing eventlistener")
        };
    }, []);
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




    const checkDatabase = async () => {
        console.log("checkdatabase");
        console.log("Here is the auth: ", auth.currentUser.uid);
        const docRef = doc(db, 'customers', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
        } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
        }
    };

    /*
    async function createSubscription(priceId, successUrl, cancelUrl) {
        const createCheckoutSession = httpsCallable(functions, 'createCheckoutSession');
        //createCheckoutSession({ priceId: priceId, successUrl: successUrl, cancelUrl: cancelUrl })

        createCheckoutSession({ priceId: priceId, })
            .then((result) => {
                // The checkout session has been created and we have the session ID.
                const sessionId = result.data.sessionId;
                const url = result.data.url;
                console.log("Session ID: ", sessionId);
                console.log("URL: ", url);

                // TODO: Redirect user to the checkout session.
            })
            .catch((error) => {
                console.log("Error: ", error);
            });
    }; */

    const [modal1Visible, setModal1Visible] = useState(false);
    const [modal2Visible, setModal2Visible] = useState(false);

    const { createToken } = useStripe();






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
        const cancelPhocusPremium = httpsCallable(functions, "cancelPhocusPremium");
        const uid = auth.currentUser.uid

        const params = {
            // Your parameters here
            uid: uid,
        };
        try {
            const subscriptionResponse = await cancelPhocusPremium(params);
            console.log("Successfully cancelled the subscription ", subscriptionResponse);
        } catch(error) {
            console.log("Error calling Cancel Stripe Subscription", error.message);
        }
    }
    const testCloudFunction = async () => {


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
            if(hardCodedToken.error == null) {
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
            if(inputToken.error == null) {
                console.log("valid input token, here is the token: ", inputToken.token)
            } else {
                console.error("ERROR IN THE INPUT TOKEN: ", inputToken.error);
            }
            //console.log("Here is the input token: ", inputToken);
            const params = {
                // Your parameters here
                token: inputToken.token,
                uid: uid,
            };

            const createFirstStripeSubscription = httpsCallable(functions, "createFirstStripeSubscription");
            try {
                const subscriptionResponse = await createFirstStripeSubscription(params);
                console.log("Stripe Subscription Successfully Created!! ", subscriptionResponse);
            } catch(error) {
                console.log("Error calling Create Stripe Subscription", error.message);
            }
        } catch(error) {
            console.log("there was an error creating the stripe token: ", error);
        }

      /*
        fetch(url, {
            method: 'POST', // or 'GET', 'PUT', etc.
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(parameters),
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                // Handle the response here
            })
            .catch((error) => {
                console.log("still throws an error");
                console.error(error);
                // Handle the error here
            }); */


/*

        const params = {
            stripeToken: token,
            uid: uid,
        };
        console.log("Here is functions: ", Object.keys(functions));
        const testCall = httpsCallable(functions, 'testCall');
        try {
            const test = await testCall({params});
            console.log("Test: ", test);
        } catch(error) {
            console.log("Error", error.message);
        }
        const createCheckoutSession = httpsCallable(functions, 'createStripeSubscription');


        createCheckoutSession({params}).then((result) => {
            console.log("the error isnt in thelinking or isnt in here")
            // Use the checkout session url from the result to redirect the user
            // Linking.openURL(result.data.url);
        }).catch((error) => {
            // Handle any errors
            console.log("function call throws error");
            console.error(error);
        });
        */


    }





    const createDoc = async () => {
        const successUrl = 'https://dashboard.stripe.com/test/customers/cus_NxGmdSi2xlOpMW';
        const cancelUrl = 'google.com';
        const uid = auth.currentUser.uid; // current user's uid
        const priceId = "price_1N2M67FeFoS9xrDytg6E1v7d";
            // Add a new document to the 'checkout_sessions' collection
           // const checkoutSessionsCollection = collection(db, `customers/${uid}/checkout_sessions`);
        try {
            /*
            const docRef = await addDoc(collection(db,'customers',uid,'checkout_sessions'), {
                    price: priceId,  // your actual price ID
                    success_url: successUrl, // You need to set this url
                    cancel_url: cancelUrl, // You need to set this url
                    mode: 'subscription',
                }); */

            const docRef = collection(db, 'customers',uid,'checkout_sessions');
            const payload = {
                price: priceId,  // your actual price ID
                success_url: successUrl, // You need to set this url
                cancel_url: cancelUrl, // You need to set this url
                mode: 'subscription',
            }

            const newDoc = await addDoc(docRef, payload);
            //console.log("Here is the doc", newDoc);
          //  console.log("Here is the docRef: ", docRef(""));
            console.log("must be something with snap");
// Wait for the CheckoutSession to get attached by the extension

            docRef.onSnapshot((snap) => {
                const { error, url } = snap.data("checkout_sessions");
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
            /*
            const docRef = await addDoc(checkoutSessionsCollection, {
                price: priceId,
                success_url: successUrl, // You need to set this url
                cancel_url: cancelUrl, // You need to set this url
                mode: 'subscription',
                quantity: 1,
            });

            console.log("Checkout session created with ID: ", docRef);
            docRef.onSnapshot((snap) => {
                const { error, url } = snap.data();
                if (error) {
                    // Show an error to your customer and
                    // inspect your Cloud Function logs in the Firebase console.
                    alert(`An error occured: ${error.message}`);
                }
                if (url) {
                    // We have a Stripe Checkout URL, let's redirect.
                    window.location.assign(url);
                }
            }); */
        } catch (error) {
            console.log("There error is down here");
            console.error("Error creating checkout session: ", error.message);
        }





// Wait for the CheckoutSession to get attached by the extension


        /*
        const checkoutSessionRef = doc(db, 'customers', uid, 'checkout_sessions');
        try {
            await setDoc(checkoutSessionRef, {
                price: 'price_1N7pGQFeFoS9xrDyYMTbAkkH' // your price id

            });
        } catch (e) {
            console.log("Error adding document: ", e);
        } */
    }


    return (
        <>
            <Text>This is the subscriptionscreen </Text>
            <Button title="Go back" onPress={() => navigation.goBack()} />
            <Button title="Edit Subscription or Payment Information" onPress={editPaymentInformation}></Button>
            <Button title="Check Database" onPress={checkDatabase}/>
            <Button title="Enter Card Information" onPress={() => setModal1Visible(modal1Visible)}/>

            <View style={{ marginTop: 22 }}>
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

                            <CardForm style={styles.cardForm}/>
                            <TextInput
                                placeholder="Cardholder's Name"
                                value={cardHolderName}
                                onChangeText={text => setCardHolderName(text)}
                            />
                            <Button onPress={testCloudFunction} title="Pay" />
                            <Button
                                onPress={() => setModal1Visible(!modal1Visible)}
                                title="Close"
                            />
                        </View>
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
                            <Button onPress={cancelPhocusPremium} title="Cancel Phocus Premium" />
                            <Button
                                onPress={() => setModal2Visible(!modal2Visible)}
                                title="Close"
                            />
                        </View>
                    </View>
                </Modal>

                <Button
                    onPress={() => setModal1Visible(true)}
                    title="Sign up for Phocus Premium"
                />
                <Button
                    onPress={() => setModal2Visible(true)}
                    title="Cancel my Phocus Premium Subscription"
                />
            </View>
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
    CardFieldInput: {
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




