import { useAuth } from "@clerk/expo";
import { PricingTable } from "@clerk/expo/web";
import { Redirect, type Href } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PricingPageWeb() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href={"/(auth)/sign-in" as Href} />;
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
