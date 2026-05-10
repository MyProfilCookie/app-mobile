import { formatCurrency } from "@/lib/utils"
import type { ImageSourcePropType } from "react-native"
import { Image, Text, View } from "react-native"



const UpcomingSubscriptionCard = ({data}: { data: { name: string, price: number, daysLeft: number, id: string, icon: ImageSourcePropType}}) => {
  return (
   <View className="upcoming-card">
        <View className="upcoming-row">
            <Image source={data.icon} alt="icon" className="upcoming-icon" />
            <View>
                <Text className="upcoming-price">{formatCurrency(data.price)}</Text>
                <Text className="upcoming-meta" numberOfLines={1}>
                    {data.daysLeft > 1 ? `${data.daysLeft} jours` : "Aujourd'hui"}
                </Text>
            </View>
        </View>
        <Text className="upcoming-name" numberOfLines={1}>{data.name}</Text>
    </View>
  )
}

export default UpcomingSubscriptionCard
