import { useAuth } from "@clerk/expo";
import { type Href, Redirect, Stack } from "expo-router";

import LoadingScreen from "@/components/LoadingScreen";
import "../../global.css";

export default function AuthLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return <LoadingScreen />;
  }

  if (isSignedIn) {
    return <Redirect href={"/(tabs)" as Href} />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
    </Stack>
  );
}
