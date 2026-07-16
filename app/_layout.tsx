import "../global.css";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <Stack initialRouteName="(tabs)">
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="sign-up" options={{ headerShown: false }} />
        <Stack.Screen name="otpscreen" options={{ headerShown: false }} />
        <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen name="addPet" options={{ headerShown: false }} />
        <Stack.Screen name="service-listing" options={{ headerShown: false }} />
        <Stack.Screen name="nearby-ngos" options={{ headerShown: false }} />
        <Stack.Screen name="booking" options={{ headerShown: false }} />
        <Stack.Screen name="edit-page" options={{ headerShown: false }} />
        <Stack.Screen name="pet-profile" options={{ headerShown: false }} />
        <Stack.Screen name="edit-pet" options={{ headerShown: false }} />
        <Stack.Screen
          name="screens/add-vaccine-record"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="screens/add-allergy"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="screens/add-hobby"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="screens/start-walk"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
