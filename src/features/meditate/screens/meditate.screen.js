import React, { useState, useEffect } from "react";
import {StatusBar, StyleSheet, Button, SafeAreaView, Text, View, Alert, TouchableOpacity} from "react-native";
import { Audio } from 'expo-av';
import {auth, db} from "../../../../firebase";
import {doc, getDoc} from "firebase/firestore";


export const MeditateScreen = ({ navigation }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [loopCount, setLoopCount] = useState(0);
  const [sound, setSound] = useState(null);
  const [freeUseLimit, setFreeUseLimit] = useState(false);
  useEffect(() => {
    const setupAudioMode = async () => {
      try {
        await Audio.setAudioModeAsync({
          staysActiveInBackground: true,
          interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_MIX_WITH_OTHERS,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
          playThroughEarpieceAndroid: true,
        });
      } catch (error) {
        console.log('Error setting audio mode:', error);
      }
    };

    setupAudioMode();
  }, []);

  useEffect( () => {

    console.log(loopCount); // This will log the updated value of playCount whenever it changes
    if (loopCount > 5) {
      Alert.alert(
          'Free Use Limit Reached',
          'You have used up your free usage. Subscribe to Premium for unlimited use!',
          [{text: 'OK', onPress: () => console.log('OK Pressed')}],
          {cancelable: false}
      );
      setFreeUseLimit(true);
      handleStopAudio();
    }
  }, [loopCount]);


  const getPermissions = async () => {
    if (Platform.OS === 'ios') {
      const { status } = await Audio.requestPermissionsAsync();
      return status === 'granted';
    }
    return true;
  };
  const handlePlayAudio = async () => {

    console.log("checkdatabase");
    console.log("Here is the auth: ", auth.currentUser.uid);
    const docRef = doc(db, 'customers', auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Premium Subscription: ", docSnap.data().isActive);
      if (docSnap.data().isActive == true) {
        await handlePlayAudioPremium();
      } else {
        if (!freeUseLimit)
        {
          await handlePlayAudioNonPremium();
        } else {
          Alert.alert(
              'Free Use Limit Reached',
              'You have used up your free usage. Subscribe to Premium for unlimited use!',
              [{text: 'OK', onPress: () => console.log('OK Pressed')}],
              {cancelable: false}
          );
        }
      }
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such user to play audio, something is wrong");
    }

  }
  const handlePlayAudioNonPremium = async () => {
    try {
      if (!sound) {
        const { sound: newSound } = await Audio.Sound.createAsync(
            require('./../../../../assets/Phocus.m4a'),
            { isLooping: true }
        );
        newSound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
        await newSound.playAsync();
        setSound(newSound);
      } else {
        await sound.playAsync();
      }
      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const onPlaybackStatusUpdate = (playbackStatus) => {
    if (playbackStatus.didJustFinish) {
      setLoopCount(prevCount => prevCount + 1);
    }
  };

  const handlePlayAudioPremium = async () => {
    try {
      if (!sound) {
        const { sound: newSound } = await Audio.Sound.createAsync(
            require('./../../../../assets/Phocus.m4a'),
            { isLooping: true }
        );
        setSound(newSound);
      }
      await sound.playAsync();
      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const handleStopAudio = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };

  return (
      <View style={[styles.container, { backgroundColor: 'black' }]}>
        <Text style={[styles.text, { color: 'limegreen' }]}>Welcome to the Meditate Screen.  Here you will hear Beta Frequencies to enable alertness and awareness for optimal meditation.</Text>
        {!isPlaying ? (
            <TouchableOpacity style={styles.button} onPress={handlePlayAudio}>
              <Text style={styles.buttonText}>Start Audio</Text>
            </TouchableOpacity>
        ) : (
            <TouchableOpacity style={styles.button} onPress={handleStopAudio}>
              <Text style={styles.buttonText}>Stop Audio</Text>
            </TouchableOpacity>
        )}
        <Text style={styles.playCountText}>Play Count: {loopCount}</Text>
      </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'limegreen',
    width: 200,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: 'black',
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center',
  },
  playCountText: {
    color: 'limegreen',
    fontSize: 18,
    marginTop: 20,
  },
  Text: {
    color: 'black',
    fontSize: 18,
    marginTop: 20,
  },
  text: {
    textAlign: 'center',
  },
});

