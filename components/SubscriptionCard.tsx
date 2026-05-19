import { formatCurrency, formatSubscriptionDateTime } from '@/lib/utils'
import clsx from 'clsx'
import React from 'react'
import { Image, Pressable, Text, View } from 'react-native'

function SubscriptionCard({name, price,currency, icon, billing, color, category, plan, renewalDate, onPress, expanded, paymentMethod, startDate, status}: SubscriptionCardProps) {
  return (
    <Pressable onPress={onPress} className={clsx('sub-card ', expanded ? 'sub-card-expanded' : 'bg-card')}
    style={!expanded && color ? {
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

      {expanded && (
        <View className='sub-body'>
             <View className='sub-row'>
                <View className="sub-row-copy">
                    <Text className='sub-label'>Paiement</Text>
                    <Text className='sub-value' numberOfLines={1} ellipsizeMode='tail'>{paymentMethod?.trim() || plan?.trim()}</Text>
                </View>
            </View>
            <View className='sub-row'>
                <View className="sub-row-copy">
                    <Text className='sub-label'>Catégorie</Text>
                    <Text className='sub-value' numberOfLines={1} ellipsizeMode='tail'>{category?.trim() || "-"}</Text>
                </View>
            </View>
            <View className='sub-row'>
                <View className="sub-row-copy">
                    <Text className='sub-label'>Plan</Text>
                    <Text className='sub-value' numberOfLines={1} ellipsizeMode='tail'>{plan?.trim() || "-"}</Text>
                </View>
            </View>
            <View className='sub-row'>
                <View className="sub-row-copy">
                    <Text className='sub-label'>Départ</Text>
                    <Text className='sub-value' numberOfLines={1} ellipsizeMode='tail'>{startDate ? formatSubscriptionDateTime(startDate, 'DD MMM') : "-"}</Text>
                </View>
            </View>
            <View className='sub-row'>
                <View className="sub-row-copy">
                    <Text className='sub-label'>Prochain renouvellement</Text>
                    <Text className='sub-value'numberOfLines={1} ellipsizeMode='tail'>{formatSubscriptionDateTime(renewalDate, 'DD MMM')}</Text>
                </View>
            </View>
            <View className='sub-row'>
                <View className="sub-row-copy">
                    <Text className='sub-label'>Statut</Text>
                    <Text className='sub-value'numberOfLines={1} ellipsizeMode='tail'>{status === "active" ? "Actif" : "Inactif"}</Text>
                </View>
            </View>
        </View>
             
      )}

    </Pressable>
  )
}

export default SubscriptionCard