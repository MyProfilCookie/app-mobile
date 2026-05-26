import { useUser } from "@clerk/expo";
import { styled } from "nativewind";
import { useCallback, useRef, useState } from "react";
import { usePostHog } from "posthog-react-native";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

import CreateSubscriptionModal from "@/components/CreateSubscriptionModal";
import HomeListHeader from "@/components/HomeListHeader";
import SubscriptionCard from "@/components/SubscriptionCard";
import { useSubscriptionStore } from "@/stores/subscription-store";

const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  const { user } = useUser();
  const posthog = usePostHog();
  const subscriptions = useSubscriptionStore((s) => s.subscriptions);
  const addSubscription = useSubscriptionStore((s) => s.addSubscription);
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<
    string | null
  >(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [sheetTopY, setSheetTopY] = useState<number | null>(null);
  const listRef = useRef<FlatList<Subscription>>(null);
  const measureBalanceCardRef = useRef<(() => Promise<void>) | null>(null);

  const openCreateModal = useCallback(() => {
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
    requestAnimationFrame(() => {
      void (async () => {
        await measureBalanceCardRef.current?.();
        setIsModalVisible(true);
      })();
    });
  }, []);

  const handleBalanceCardBottom = useCallback((bottomY: number) => {
    setSheetTopY(bottomY);
  }, []);

  const handleRegisterMeasure = useCallback((measure: () => Promise<void>) => {
    measureBalanceCardRef.current = measure;
  }, []);

  const renderHeader = useCallback(
    () => (
      <HomeListHeader
        user={user}
        onAddPress={openCreateModal}
        onBalanceCardBottom={handleBalanceCardBottom}
        onRegisterMeasure={handleRegisterMeasure}
      />
    ),
    [
      user?.id,
      user?.imageUrl,
      user?.hasImage,
      user?.firstName,
      user?.lastName,
      openCreateModal,
      handleBalanceCardBottom,
      handleRegisterMeasure,
    ]
  );

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <FlatList
        ref={listRef}
        data={subscriptions}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
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
        extraData={[
          expandedSubscriptionId,
          subscriptions.length,
          user?.imageUrl,
          user?.hasImage,
        ]}
        ListHeaderComponent={renderHeader}
        ItemSeparatorComponent={() => <View className="h-4" />}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-30"
        ListEmptyComponent={() => (
          <Text className="home-empty-state">Aucun abonnement</Text>
        )}
      />

      <CreateSubscriptionModal
        visible={isModalVisible}
        sheetTopY={sheetTopY}
        onClose={() => setIsModalVisible(false)}
        onSubmit={addSubscription}
      />
    </SafeAreaView>
  );
}
