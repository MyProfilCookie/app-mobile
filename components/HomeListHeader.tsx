import { useMemo } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";

import ListHeading from "@/components/ListHeading";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";
import UserAvatar from "@/components/UserAvatar";
import { HOME_BALANCE } from "@/constants/data";
import { subscriptionsToUpcoming } from "@/lib/subscription-create";
import { useSubscriptionStore } from "@/stores/subscription-store";
import { icons } from "@/constants/icons";
import { getClerkUserDisplayName } from "@/lib/user-display";
import type { ClerkUserWithImage } from "@/lib/profile-image";
import { formatCurrency } from "@/lib/utils";
import dayjs from "dayjs";

type Props = {
  user:
    | (ClerkUserWithImage & {
        firstName?: string | null;
        lastName?: string | null;
        fullName?: string | null;
        primaryEmailAddress?: { emailAddress?: string } | null;
      })
    | null
    | undefined;
  onAddPress: () => void;
};

export default function HomeListHeader({ user, onAddPress }: Props) {
  const subscriptions = useSubscriptionStore((s) => s.subscriptions);
  const upcomingSubscriptions = useMemo(
    () => subscriptionsToUpcoming(subscriptions),
    [subscriptions]
  );
  const displayName = getClerkUserDisplayName(user);

  return (
    <View>
      <View className="home-header">
        <View className="home-user">
          <UserAvatar user={user} className="home-avatar" />
          <Text className="home-user-name" numberOfLines={1}>
            {displayName}
          </Text>
        </View>
        <TouchableOpacity
          accessibilityLabel="Ajouter un abonnement"
          className="items-center justify-center rounded-full border border-black/10 bg-background p-3"
          onPress={onAddPress}
        >
          <Image source={icons.add} className="size-6" />
        </TouchableOpacity>
      </View>

      <View className="home-balance-card">
        <Text className="home-balance-label">Total Depenses</Text>
        <View className="home-balance-row">
          <Text className="home-balance-amount">
            {formatCurrency(HOME_BALANCE.amount)}
          </Text>
          <Text className="home-balance-date">
            {dayjs(HOME_BALANCE.nextRenewalDate).format("DD MMM")}
          </Text>
        </View>
      </View>

      <ListHeading title="Les dépenses à venir" />

      <FlatList
        data={upcomingSubscriptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <UpcomingSubscriptionCard {...item} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        ListEmptyComponent={() => (
          <Text className="home-empty-state">Aucune depense</Text>
        )}
        contentContainerClassName="gap-3 pr-1"
      />

      <ListHeading title="Prochains renouvellements" />
      <View className="h-4" />
    </View>
  );
}
