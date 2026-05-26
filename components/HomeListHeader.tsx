import { useCallback, useEffect, useMemo, useRef } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import dayjs from "dayjs";

import ListHeading from "@/components/ListHeading";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";
import UserAvatar from "@/components/UserAvatar";
import { HOME_BALANCE } from "@/constants/data";
import { icons } from "@/constants/icons";
import type { ClerkUserWithImage } from "@/lib/profile-image";
import { subscriptionsToUpcoming } from "@/lib/subscription-create";
import { getClerkUserDisplayName } from "@/lib/user-display";
import { formatCurrency } from "@/lib/utils";
import { useSubscriptionStore } from "@/stores/subscription-store";

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
  onBalanceCardBottom?: (bottomY: number) => void;
  onRegisterMeasure?: (measure: () => Promise<void>) => void;
};

export default function HomeListHeader({
  user,
  onAddPress,
  onBalanceCardBottom,
  onRegisterMeasure,
}: Props) {
  const balanceCardRef = useRef<View>(null);

  const measureBalanceCardBottom = useCallback(() => {
    return new Promise<void>((resolve) => {
      if (!balanceCardRef.current) {
        resolve();
        return;
      }
      balanceCardRef.current.measureInWindow((_x, y, _w, height) => {
        onBalanceCardBottom?.(y + height);
        resolve();
      });
    });
  }, [onBalanceCardBottom]);

  useEffect(() => {
    onRegisterMeasure?.(measureBalanceCardBottom);
  }, [onRegisterMeasure, measureBalanceCardBottom]);
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

      <View
        ref={balanceCardRef}
        className="home-balance-card"
        onLayout={measureBalanceCardBottom}
      >
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
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={upcomingSubscriptions.length > 0}
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
