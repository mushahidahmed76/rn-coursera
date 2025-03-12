import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProfileScreen from "../screens/ProfileScreen";
import OnboardingScreen from "../screens/OnboardingScreen";
import HomeScreen from "../screens/HomeScreen";
import SplashScreen from "../screens/SplashScreen"; 
const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);

  // Check AsyncStorage for onboarding completion flag
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const onboardingComplete = await AsyncStorage.getItem("onboardingComplete");
        setIsOnboardingComplete(onboardingComplete === "true");
      } catch (e) {
        console.error("Failed to load onboarding status.", e);
      } finally {
        setIsLoading(false); // Stop showing Splash Screen once check is complete
      }
    };
    checkOnboardingStatus();
  }, []);
  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator>
      {isOnboardingComplete ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }}/>
        </>
      ) : (
        <>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }}/>
        </>
      )}
    </Stack.Navigator>
  );
};
export default RootNavigator;
