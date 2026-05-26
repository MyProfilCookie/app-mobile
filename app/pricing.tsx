import { useAuth } from "@clerk/expo";
import { Redirect, type Href } from "expo-router";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PricingPage() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href={"/(auth)/sign-in" as Href} />;
  }

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="font-sans-bold text-xl text-foreground">Tarifs</Text>
      <Text className="mt-2 font-sans-regular text-muted-foreground">
        La table des prix Clerk est disponible sur la version web. Lancez{" "}
        <Text className="font-sans-semibold">npx expo start --web</Text>.
      </Text>
    </SafeAreaView>
  );
}
