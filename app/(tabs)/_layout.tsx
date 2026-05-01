import { Tabs } from 'expo-router'
import React from 'react'

const TabLayout = () => {
  return (
    <Tabs>
        <Tabs.Screen name="index" />
        <Tabs.Screen name="subscriptions" />
        <Tabs.Screen name="insights" />
        <Tabs.Screen name="settings" />
    </Tabs>
  )
}

export default TabLayout