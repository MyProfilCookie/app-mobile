import "@/global.css";
import { ClerkProvider } from "@clerk/expo";
import { useFonts } from "expo-font";
import { SplashScreen, Stack, useGlobalSearchParams, usePathname } from "expo-router";
import { useEffect, useRef } from "react";
import { PostHogProvider } from "posthog-react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import LoadingScreen from "@/components/LoadingScreen";
import { tokenCache } from "@/lib/cache";
import { posthog } from "@/lib/posthog";

void SplashScreen.preventAutoHideAsync().catch(() => {
  /* Expo Go / rechargement : pas de splash natif à ce stade */
});

function getPublishableKey(): string {
  const key = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!key) {
    throw new Error(
      "Ajoutez EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY dans votre fichier .env"
    );
  }
  return key;
}

export default function RootLayout() {
  const pathname = usePathname();
  const params = useGlobalSearchParams();
  const previousPathname = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (previousPathname.current !== pathname) {
      posthog.screen(pathname, {
        previous_screen: previousPathname.current ?? null,
        ...params,
      });
      previousPathname.current = pathname;
    }
  }, [pathname, params]);

  const [fontsLoaded, fontError] = useFonts({
    "sans-regular": require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
    "sans-semibold": require("../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    "sans-bold": require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
    "sans-extrabold": require("../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
    "sans-light": require("../assets/fonts/PlusJakartaSans-Light.ttf"),
    "sans-medium": require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
  });

  const splashHidden = useRef(false);

  useEffect(() => {
    if (!fontsLoaded && !fontError) return;
    if (splashHidden.current) return;
    splashHidden.current = true;
    void SplashScreen.hideAsync().catch(() => {
      /* iOS / Fast Refresh : hide sans VC enregistré — ignorer */
    });
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return (
      <SafeAreaProvider>
        <LoadingScreen />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <PostHogProvider
        client={posthog}
        autocapture={{
          captureScreens: false,
          captureTouches: true,
          propsToCapture: ["testID"],
        }}
      >
        <ClerkProvider publishableKey={getPublishableKey()} tokenCache={tokenCache}>
          <Stack screenOptions={{ headerShown: false }} />
        </ClerkProvider>
      </PostHogProvider>
    </SafeAreaProvider>
  );
}
