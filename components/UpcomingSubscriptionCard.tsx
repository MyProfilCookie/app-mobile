import { formatCurrency } from "@/lib/utils"
import type { ImageSourcePropType } from "react-native"
import { Image, Text, View } from "react-native"



const UpcomingSubscriptionCard = ({ name, price, daysLeft, id, icon }: { name: string, price: number, daysLeft: number, id: string, icon: ImageSourcePropType}) => {
  return (
   <View className="upcoming-card">
        <View className="upcoming-row">
            <Image source={icon} alt="icon" className="upcoming-icon" />
            <View>
                <Text className="upcoming-price">{formatCurrency(price)}</Text>
                <Text className="upcoming-meta" numberOfLines={1}>
                    {daysLeft > 1 ? `${daysLeft} jours` : "Aujourd'hui"}
                </Text>
            </View>
        </View>
        <Text className="upcoming-name" numberOfLines={2}>
          {name}
        </Text>
    </View>
  )
}

export default UpcomingSubscriptionCard
