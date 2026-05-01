import "@/global.css";
import { Link } from "expo-router";
import { Text, View } from "react-native";
 
export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-blue-500">
        Welcome to Nativewind!
      </Text>
      <Link href="/onboarding" className="mt-4 rounded bg-primary p-4 text-white">Aller sur le Dashboard</Link>
      <Link href="/(auth)/sign-in" className="mt-4 rounded bg-primary p-4 text-white">Se connecter</Link>
      <Link href="/(auth)/sign-up" className="mt-4 rounded bg-primary p-4 text-white">Créer un compte</Link>
      <Link href="/(tabs)/subscriptions" className="mt-4 rounded bg-primary p-4 text-white">Voir les abonnements</Link>
      {/* <Link href="/(tabs)/subscriptions/1" className="mt-4 rounded bg-primary p-4 text-white">Voir un abonnement</Link> */}
      
    </View>
  );
}
