import { useAuth, useClerk } from "@clerk/expo";
import { Link, type Href } from "expo-router";
import { Platform, Pressable, Text, View } from "react-native";

const planId = process.env.EXPO_PUBLIC_CLERK_PLAN_ID;
const planSlug = process.env.EXPO_PUBLIC_CLERK_PLAN_SLUG ?? "pro";

export default function ClerkUpgradeSection() {
  const { isSignedIn, isLoaded, has } = useAuth();
  const clerk = useClerk();

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  const hasPremium =
    typeof has === "function" ? has({ plan: planSlug }) : false;

  const startNativeCheckout = async () => {
    if (!planId) return;
    const billing = (
      clerk as {
        billing?: {
          startCheckout: (p: {
            planId: string;
            planPeriod: "month" | "annual";
          }) => Promise<unknown>;
        };
      }
    ).billing;

    if (!billing?.startCheckout) {
      throw new Error(
        "Activez Clerk Billing dans le Dashboard (Billing → Settings)."
      );
    }

    await billing.startCheckout({ planId, planPeriod: "month" });
  };

  return (
    <View className="mb-6">
      <Text className="mb-2 font-sans-semibold text-lg text-foreground">
        Abonnement
      </Text>
      {hasPremium ? (
        <Text className="font-sans-regular text-sm text-success">
          Vous avez accès au plan {planSlug}.
        </Text>
      ) : (
        <>
          <Text className="mb-3 font-sans-regular text-sm text-muted-foreground">
            Passez au premium pour débloquer toutes les fonctionnalités (Clerk
            Billing, comme dans le cours JS Mastery).
          </Text>
          {Platform.OS === "web" ? (
            <Link href={"/pricing" as Href} asChild>
              <Pressable className="items-center rounded-xl bg-accent px-4 py-3.5">
                <Text className="font-sans-semibold text-base text-background">
                  Voir les offres
                </Text>
              </Pressable>
            </Link>
          ) : (
            <Pressable
              className="items-center rounded-xl bg-accent px-4 py-3.5"
              onPress={() => startNativeCheckout().catch(console.error)}
            >
              <Text className="font-sans-semibold text-base text-background">
                {planId ? "Passer au premium" : "Configurer EXPO_PUBLIC_CLERK_PLAN_ID"}
              </Text>
            </Pressable>
          )}
        </>
      )}
    </View>
  );
}
