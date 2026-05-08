// Test CodeRabbit
import "@/global.css";
import { Link } from "expo-router";
import { styled } from "nativewind";
import { Text } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView)
 
export default function App() {
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="text-xl font-bold text-blue-500">
        Welcome to Nativewind!
      </Text>
      <Link href="/onboarding" className="mt-4 rounded bg-primary p-4 text-white">Aller sur le Dashboard</Link>
      <Link href="/(auth)/sign-in" className="mt-4 rounded bg-primary p-4 text-white">Se connecter</Link>
      <Link href="/(auth)/sign-up" className="mt-4 rounded bg-primary p-4 text-white">Créer un compte</Link>
      <Link href="/(tabs)/subscriptions" className="mt-4 rounded bg-primary p-4 text-white">Voir les abonnements</Link>
      
    </SafeAreaView>
  );
}
