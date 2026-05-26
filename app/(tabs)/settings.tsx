import { useClerk, useUser } from "@clerk/expo";
import { styled } from "nativewind";
import { usePostHog } from "posthog-react-native";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

import UserAvatar from "@/components/UserAvatar";
import { getClerkUserDisplayName } from "@/lib/user-display";

const SafeAreaView = styled(RNSafeAreaView);

function AccountRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View className="gap-1 border-b border-border py-3 last:border-b-0">
      <Text className="font-sans-medium text-xs text-muted-foreground">
        {label}
      </Text>
      <Text className="font-sans-regular text-sm text-foreground">{value}</Text>
    </View>
  );
}

const Settings = () => {
  const { signOut } = useClerk();
  const { user } = useUser();
  const posthog = usePostHog();

  const displayName = getClerkUserDisplayName(user);
  const email = user?.primaryEmailAddress?.emailAddress;
  const firstName = user?.firstName?.trim();
  const lastName = user?.lastName?.trim();
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const handleSignOut = async () => {
    try {
      posthog.capture("user_signed_out");
      posthog.reset();
      await signOut();
    } catch (error) {
      console.error("Sign-out failed:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="mb-6 font-sans-bold text-2xl text-foreground">Compte</Text>

      <View className="mb-6 flex-row items-center gap-4 rounded-2xl border border-border bg-card p-4">
        <UserAvatar user={user} className="size-16 rounded-full" />
        <View className="flex-1">
          <Text className="font-sans-bold text-lg text-foreground">
            {displayName}
          </Text>
          {email ? (
            <Text className="font-sans-regular text-sm text-muted-foreground">
              {email}
            </Text>
          ) : null}
        </View>
      </View>

      <View className="mb-6 rounded-2xl border border-border bg-card px-4">
        {firstName ? <AccountRow label="Prénom" value={firstName} /> : null}
        {lastName ? <AccountRow label="Nom" value={lastName} /> : null}
        {email ? <AccountRow label="E-mail" value={email} /> : null}
        {user?.id ? (
          <AccountRow label="ID du compte" value={user.id} />
        ) : null}
        {memberSince ? (
          <AccountRow label="Membre depuis" value={memberSince} />
        ) : null}
      </View>

      <Pressable
        className="items-center rounded-xl border border-destructive/30 bg-card px-4 py-3.5"
        onPress={handleSignOut}
      >
        <Text className="font-sans-semibold text-base text-destructive">
          Se déconnecter
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default Settings;
