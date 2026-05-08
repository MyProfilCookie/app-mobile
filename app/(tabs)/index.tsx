
import { Link } from "expo-router";
import { styled } from "nativewind";
import { Text } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView)
 
export default function App() {
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="text-7xl font-sans-extrabold">
        Accueil
      </Text>
      <Link href="/onboarding" className="mt-4 font-sans-bold rounded bg-primary p-4 text-white">Aller sur le Dashboard</Link>
      <Link href="/(auth)/sign-in" className="mt-4 font-sans-bold rounded bg-primary p-4 text-white">Se connecter</Link>
      <Link href="/(auth)/sign-up" className="mt-4 font-sans-bold rounded bg-primary p-4 text-white">Créer un compte</Link>
      
    </SafeAreaView>
  );
}
