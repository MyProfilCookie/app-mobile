import { styled } from "nativewind";
import { useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";

import ListHeading from "@/components/ListHeading";
import SubscriptionCard from "@/components/SubscriptionCard";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";
import { HOME_BALANCE, HOME_SUBSCRIPTIONS, HOME_USER, UPCOMING_SUBSCRIPTIONS } from "@/constants/data";
import { icons } from "@/constants/icons";
import images from "@/constants/images";
import { formatCurrency } from "@/lib/utils";
import dayjs from "dayjs";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string | null>(null);

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <FlatList 
        data={HOME_SUBSCRIPTIONS}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => (
          <SubscriptionCard 
            {...item} 
            expanded={expandedSubscriptionId === item.id}
            onPress={() => setExpandedSubscriptionId((currentId) => currentId === item.id ? null : item.id)}  
          />
        )}
        extraData={expandedSubscriptionId}
        ListHeaderComponent={() => (
          <View>
            <View className="home-header">
              <View className="home-user">
                <Image source={images.avatar} alt="Avatar" className="home-avatar" />
                <Text className="home-user-name">{HOME_USER.name}</Text>
              </View>
              <TouchableOpacity className="items-center justify-center rounded-full border border-black/10 bg-background p-3">
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
                  {dayjs(HOME_BALANCE.nextRenewalDate).format('DD MMM')}
                </Text>
              </View>
            </View>

            <ListHeading title="Les dépenses à venir" />
            
            <FlatList 
              data={UPCOMING_SUBSCRIPTIONS}
              keyExtractor={(item) => item.id}
              renderItem={({item}) => (
                <UpcomingSubscriptionCard {...item} />
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
              ListEmptyComponent={() => (
                <Text className="home-empty-state">Aucune depense</Text>
              )}
              contentContainerClassName="gap-4"
            />

            <ListHeading title="Prochains renouvellements" />
            <View className="h-4" />
          </View>
        )}
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
