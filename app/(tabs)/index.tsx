import { useUser } from "@clerk/expo";
import { styled } from "nativewind";
import { useCallback, useState } from "react";
import { usePostHog } from "posthog-react-native";
import { FlatList, Text, View } from "react-native";

import HomeListHeader from "@/components/HomeListHeader";
import SubscriptionCard from "@/components/SubscriptionCard";
import { HOME_SUBSCRIPTIONS } from "@/constants/data";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  const { user } = useUser();
  const posthog = usePostHog();
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<
    string | null
  >(null);

  const renderHeader = useCallback(
    () => <HomeListHeader user={user} />,
    [user?.id, user?.imageUrl, user?.hasImage, user?.firstName, user?.lastName]
  );

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <FlatList
        data={HOME_SUBSCRIPTIONS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedSubscriptionId === item.id}
            onPress={() => {
              const isExpanding = expandedSubscriptionId !== item.id;
              setExpandedSubscriptionId((currentId) =>
                currentId === item.id ? null : item.id
              );
              posthog.capture(
                isExpanding
                  ? "subscription_card_expanded"
                  : "subscription_card_collapsed",
                { subscription_id: item.id, subscription_name: item.name }
              );
            }}
          />
        )}
        extraData={[expandedSubscriptionId, user?.imageUrl, user?.hasImage]}
        ListHeaderComponent={renderHeader}
        ItemSeparatorComponent={() => <View className="h-4" />}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-30"
        ListEmptyComponent={() => (
          <Text className="home-empty-state">Aucun abonnement</Text>
        )}
      />
    </SafeAreaView>
  );
}
