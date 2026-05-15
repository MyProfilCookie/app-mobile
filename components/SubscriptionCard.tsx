import { formatCurrency, formatSubscriptionDateTime } from '@/lib/utils'
import clsx from 'clsx'
import React from 'react'
import { Image, Text, View } from 'react-native'

function SubscriptionCard({name, price,currency, icon, billing, color, category, plan, renewalDate }: SubscriptionCardProps) {
  return (
    <View className={clsx('sub-card bg-card')}
    style={color ? {
        backgroundColor: color,
    } : undefined}
    >
      <View className='sub-head'>
        <View className="sub-main">
            <Image source={icon} className='sub-icon' />
            <View className='sub-copy'>
                <Text numberOfLines={1} className='sub-title'>
                    {name}
                </Text>
                <Text numberOfLines={1} ellipsizeMode='tail' className='sub-meta'>{category ?.trim() || plan?.trim() || formatSubscriptionDateTime(renewalDate, 'DD MMM')}</Text>
            </View>
        </View>
        <View className='sub-price-box'>
            <Text className='sub-price'>
                {formatCurrency(price, currency)}
            </Text>
            <Text className='sub-billing'>{billing}</Text>
        </View>
      </View>
    </View>
  )
}

export default SubscriptionCard