import { useAuth } from "@clerk/expo";
import { PricingTable } from "@clerk/expo/web";
import { Redirect, type Href } from "expo-router";
import { Platform, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PricingPage() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href={"/(auth)/sign-in" as Href} />;
  }

  if (Platform.OS !== "web") {
    return (
      <SafeAreaView className="flex-1 bg-background p-5">
        <Text className="font-sans-bold text-xl text-foreground">
          Tarifs
        </Text>
        <Text className="mt-2 font-sans-regular text-muted-foreground">
          La table des prix Clerk est disponible sur la version web. Lancez{" "}
          <Text className="font-sans-semibold">npx expo start --web</Text> ou
          utilisez le bouton premium dans Réglages sur mobile.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="mb-4 font-sans-bold text-2xl text-foreground">
        Choisissez un plan
      </Text>
      <View className="flex-1">
        <PricingTable />
      </View>
    </SafeAreaView>
  );
}
