import { Text, TouchableOpacity, View } from "react-native"


const ListHeading = ({title, showViewAll}:{title:string, showViewAll?:boolean   }) => {
  return (
    <View className="list-head">
     <Text className="list-title">{title}</Text>

     <TouchableOpacity className="list-action" >
        <Text className="list-action-text">Voir tout</Text>
     </TouchableOpacity>
    </View>
  )
}

export default ListHeading