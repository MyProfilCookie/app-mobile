import { useAuth } from "@clerk/expo";
import { styled } from "nativewind";
import { useEffect } from "react";
import { usePostHog } from "posthog-react-native";
import { Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const planSlug = process.env.EXPO_PUBLIC_CLERK_PLAN_SLUG ?? "pro";

const Insights = () => {
  const { isLoaded, has } = useAuth();
  const posthog = usePostHog();
  const hasPremium =
    isLoaded && typeof has === "function" ? has({ plan: planSlug }) : false;

  useEffect(() => {
    if (isLoaded && !hasPremium) {
      posthog.capture("insights_premium_upsell_viewed", { plan: planSlug });
    }
  }, [isLoaded, hasPremium, posthog]);

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="mb-4 font-sans-bold text-2xl text-foreground">
        Insights
      </Text>

      {hasPremium ? (
        <View className="rounded-2xl border border-accent/30 bg-accent/10 p-4">
          <Text className="font-sans-semibold text-foreground">
            Statistiques avancées
          </Text>
          <Text className="mt-2 font-sans-regular text-sm text-muted-foreground">
            Vous avez accès au plan {planSlug}.
          </Text>
        </View>
      ) : (
        <View className="rounded-2xl border border-border bg-card p-4">
          <Text className="font-sans-semibold text-foreground">
            Contenu premium
          </Text>
          <Text className="mt-2 font-sans-regular text-sm text-muted-foreground">
            Abonnez-vous au plan {planSlug} dans Réglages pour débloquer cette
            section.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Insights;
