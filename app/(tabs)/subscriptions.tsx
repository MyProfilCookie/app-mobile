import { Ionicons } from "@expo/vector-icons";
import { styled } from "nativewind";
import { usePostHog } from "posthog-react-native";
import { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

import SubscriptionCard from "@/components/SubscriptionCard";
import { useSubscriptionStore } from "@/stores/subscription-store";
import { formatCurrency } from "@/lib/utils";

const SafeAreaView = styled(RNSafeAreaView);

/** Recherche sur nom, catégorie et plan (pas carte bancaire / statut technique). */
function matchesQuery(subscription: Subscription, query: string): boolean {
  const fields = [subscription.name, subscription.category, subscription.plan]
    .filter(Boolean)
    .map((value) => value.toLowerCase());

  return fields.some((field) => field.includes(query));
}

const Subscriptions = () => {
  const posthog = usePostHog();
  const subscriptions = useSubscriptionStore((s) => s.subscriptions);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<
    string | null
  >(null);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredSubscriptions = useMemo(() => {
    if (!normalizedQuery) return subscriptions;
    return subscriptions.filter((s) => matchesQuery(s, normalizedQuery));
  }, [normalizedQuery, subscriptions]);

  const activeCount = filteredSubscriptions.filter(
    (s) => s.status === "active"
  ).length;

  const monthlyTotal = filteredSubscriptions
    .filter((s) => s.status === "active")
    .filter((s) => s.billing === "Monthly" || s.billing === "Mensuel")
    .reduce((sum, s) => sum + s.price, 0);

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="font-sans-bold text-2xl text-foreground">Abonnements</Text>
      <Text className="mt-1 font-sans-regular text-sm text-muted-foreground">
        {filteredSubscriptions.length} abonnement
        {filteredSubscriptions.length > 1 ? "s" : ""} · {activeCount} actif
        {activeCount > 1 ? "s" : ""}
        {monthlyTotal > 0 ? ` · ${formatCurrency(monthlyTotal)}/mois` : ""}
      </Text>

      <View className="sub-search">
        <Ionicons name="search" size={20} color="rgba(0,0,0,0.45)" />
        <TextInput
          className="sub-search-input"
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Rechercher un abonnement…"
          placeholderTextColor="rgba(0,0,0,0.4)"
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
          returnKeyType="search"
        />
        {searchQuery.length > 0 ? (
          <Pressable
            className="sub-search-clear"
            onPress={() => setSearchQuery("")}
            accessibilityLabel="Effacer la recherche"
          >
            <Text className="sub-search-clear-text">Effacer</Text>
          </Pressable>
        ) : null}
      </View>

      <Text className="mb-3 mt-4 font-sans-semibold text-lg text-foreground">
        {normalizedQuery ? "Résultats" : "Tous vos abonnements"}
      </Text>

      <FlatList
        className="flex-1"
        data={filteredSubscriptions}
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
                {
                  subscription_id: item.id,
                  subscription_name: item.name,
                  screen: "subscriptions",
                }
              );
            }}
          />
        )}
        extraData={expandedSubscriptionId}
        ItemSeparatorComponent={ListSeparator}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-30"
        ListEmptyComponent={
          <Text className="home-empty-state">
            {normalizedQuery
              ? `Aucun résultat pour « ${searchQuery.trim()} »`
              : "Aucun abonnement"}
          </Text>
        }
      />
    </SafeAreaView>
  );
};

function ListSeparator() {
  return <View className="h-4" />;
}

export default Subscriptions;
