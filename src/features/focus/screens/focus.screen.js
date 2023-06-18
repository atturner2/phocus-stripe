import React, {useEffect, useState} from "react";
import {StatusBar, StyleSheet, Button, SafeAreaView, Text, View, Alert} from "react-native";
import { Audio } from 'expo-av';
import {auth, db} from "../../../../firebase";
import {doc, getDoc} from "firebase/firestore";

export const FocusScreen = ({ navigation }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [loopCount, setLoopCount] = useState(0);
  const [sound, setSound] = useState(null);
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



  const getPermissions = async () => {
    if (Platform.OS === 'ios') {
      const { status } = await Audio.requestPermissionsAsync();
      return status === 'granted';
    }
    return true;
  };

  useEffect(() => {
    // Load the sound file
    const mySound = new Sound('path_to_your_audio_file.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('Failed to load the sound', error);
        return;
      }
      setSound(mySound);
    });

    // Make sure to release the sound resource when the component unmounts
    return () => {
      mySound.release();
    };
  }, []);


  useEffect(() => {
    if (loopCount >= 5) {
      stopSound();
      Alert.alert(
          'Alert',
          'The audio file has looped 5 times.',
          [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
          { cancelable: false }
      );
    }
  }, [loopCount]);

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
        console.log("Calling audio NON premium");
        await handlePlayAudioNonPremium();
      }
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such user to play audio, something is wrong");
    }

  }
  const handlePlayAudioNonPremium = async () => {
    if (!sound) return;

    sound.setNumberOfLoops(-1); // Infinite loop
    sound.play((success) => {
      if (success) {
        setLoopCount(loopCount + 1);
      } else {
        console.log('Playback failed');
      }
    });
    setIsPlaying(true);
  };

  const onPlaybackStatusUpdate = (playbackStatus) => {
      console.log("Beginning of call loopcount: ", loopCount);
      if (playbackStatus.didJustFinish) {
        setLoopCount(loopCount + 1);
        console.log("inside of if LoopCount: ", loopCount);

      }
      console.log("outside of if loopCount: ", loopCount);

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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {!isPlaying ? (
            <Button title="Start Audio" onPress={handlePlayAudio} />
        ) : (
            <Button title="Stop Audio" onPress={handleStopAudio} />
        )}
        <Text>Play Count: {loopCount}</Text>
      </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
  },
  search: {
    padding: 16,
  },
  list: {
    flex: 1,
    padding: 16,
    backgroundColor: "blue",
  },
});
