
import { styled } from "nativewind";
import { Image, Text, View } from "react-native";


import ListHeading from "@/components/ListHeading";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";
import { HOME_BALANCE, HOME_USER, UPCOMING_SUBSCRIPTIONS } from "@/constants/data";
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
         {UPCOMING_SUBSCRIPTIONS.map((subscription) => (
          <UpcomingSubscriptionCard  key={subscription.id} data={subscription} />
        ))}
      </View>

       <View className="">
        <ListHeading title="Prochains renouvellements" />
      </View>

      
    </SafeAreaView>
  );
}
