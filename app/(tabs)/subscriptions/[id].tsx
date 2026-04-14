import { Link, useLocalSearchParams } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'

const SubscriptionDetail = () => {
    const { id } = useLocalSearchParams()
  return (
    <View>
      <Text>SubscriptionDetail: {id}</Text>
      <Link href="/">Retour</Link>
    </View>
  )
}

export default SubscriptionDetail   