
import { styled } from "nativewind";
import { useState } from "react";
import { FlatList, Image, Text, View } from "react-native";


import ListHeading from "@/components/ListHeading";
import SubscriptionCard from "@/components/SubscriptionCard";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";
import { HOME_BALANCE, HOME_SUBSCRIPTIONS, HOME_USER, UPCOMING_SUBSCRIPTIONS } from "@/constants/data";
import { icons } from "@/constants/icons";
import images from "@/constants/images";
import { formatCurrency } from "@/lib/utils";
import dayjs from "dayjs";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";


const SafeAreaView = styled(RNSafeAreaView)
 
export default function App() {
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string | null>(null)
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <View className="">
        <ListHeading title="Les dépenses à venir" />
      <View className="home-header">
       <View className="home-user">
        <Image source={images.avatar} alt="Avatar" className="home-avatar" />
        <Text className="home-user-name">{HOME_USER.name}</Text>
       </View>
       <Image source={icons.add} className="home-add-icon" />
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
      </View>

       <View className="flex-1">
          <ListHeading title="Prochains renouvellements" />

          <FlatList 
          ListHeaderComponent={({style}) => (
            <View className="h-4" />
          )}
            data={HOME_SUBSCRIPTIONS}
            keyExtractor={(item) => item.id}
            renderItem={({item}) => (
            <SubscriptionCard {...item} 
            expanded={expandedSubscriptionId === item.id}
          onPress={() => setExpandedSubscriptionId((currentId) => currentId === 
            item.id 
            ? null 
          : item.id
        )  
      }  
        />
        )   
        }
        extraData={ expandedSubscriptionId}
        ItemSeparatorComponent={() => <View className="h-4" />}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-20"
        ListEmptyComponent={() => (
          <Text className="home-empty-state">Aucun abonnement</Text>
        )}
      />
      
      </View>

      
    </SafeAreaView>
  );
}
