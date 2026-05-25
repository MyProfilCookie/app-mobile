import { useAuth } from "@clerk/expo";
import { useRouter, type Href } from "expo-router";
import { useEffect } from "react";

import LoadingScreen from "@/components/LoadingScreen";

export default function Index() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn) {
      router.replace("/(tabs)" as Href);
    } else {
      router.replace("/(auth)/sign-in" as Href);
    }
  }, [isLoaded, isSignedIn, router]);

  return <LoadingScreen />;
}
