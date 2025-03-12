import * as React from 'react';
import { useState } from 'react';
import { View, Image, StyleSheet, Text, TextInput, Alert, Button } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";

const clearOnboardingFlag = async () => {
  try {
    await AsyncStorage.removeItem('onboardingComplete');
    await AsyncStorage.removeItem("userName");
    await AsyncStorage.removeItem("userEmail");
    console.log('Onboarding flag cleared');
  } catch (e) {
    console.error('Error clearing onboarding flag', e);
  }
};
clearOnboardingFlag();

const OnboardingScreen = ({navigation}) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const isEmailValid = email => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };
  const isButtonPressable = name && isEmailValid(email);

  const completeOnboarding = async () => {

    try {
      await AsyncStorage.setItem("onboardingComplete", "true");
      await AsyncStorage.setItem("FromHome", "false");
      await AsyncStorage.setItem("userName", name); // Save name
      await AsyncStorage.setItem("userEmail", email); // Save email
      await AsyncStorage.removeItem("lastSavedState")
      navigation.replace("Profile"); // Navigate to Profile after onboarding
    } catch (e) {
      console.error("Failed to save onboarding status.", e);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
      <Image
          style={styles.logo} 
          source={require("../assets/LEMON.png")}
        />
        <Text style={styles.textHeader}>LITTLE LEMON</Text>
      </View>

      <Text style={styles.textStyle}>Let us get to know you</Text>

      <TextInput 
        style={styles.inputStyle}
        placeholder='Type your name'
        value={name}
        onChangeText={setName}
      />
      <TextInput 
        style={styles.inputStyle}
        placeholder='Type your email'
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        textContentType="emailAddress"
      />
      <Button title="Complete Onboarding" 
      onPress={completeOnboarding} 
      color={isButtonPressable ? "#006600" : "#A9A9A9"} 
      disabled={!isButtonPressable} />
    </View>
  );
};

const styles = StyleSheet.create({
  textHeader:{
    fontSize: 20,
    fontWeight: 'bold',
    color: "#136f00"
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  textStyle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  logo: {
    width: 60,
    height: 60,
    marginVertical: 16,
  },
  inputStyle: {
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 8,
    marginBottom: 16,
  },
});

export default OnboardingScreen;
