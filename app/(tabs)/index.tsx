
import { styled } from "nativewind";
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
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
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

      <View className="">
        <ListHeading title="Dernieres depenses" />
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

       <View className="">
        <ListHeading title="Prochains renouvellements" />
        <SubscriptionCard {...HOME_SUBSCRIPTIONS[0]} />  
      </View>

      
    </SafeAreaView>
  );
}
