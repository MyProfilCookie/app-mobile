import { Link, useLocalSearchParams } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'

const SubscriptionDetail = () => {
    const { id } = useLocalSearchParams<{ id: string }>()
  return (
    <View>
      <Text>SubscriptionDetails: {id}</Text>
      <Link href="/">Retour</Link>
    </View>
  )
}

export default SubscriptionDetail   