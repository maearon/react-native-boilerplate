import { Tabs } from 'expo-router';
import React, { useState } from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuthStore } from '@/stores/authStore';
import { router } from 'expo-router';
import Menu from './menu';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { loggedIn } = useAuthStore();
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              position: 'absolute',
            },
            default: {},
          }),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          }}
        />

        <Tabs.Screen
          name="users"
          options={{
            href: loggedIn ? undefined : null,
            title: 'Users',
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="person.2.fill" color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="menu"
          options={{
            href: loggedIn || !loggedIn ? undefined : null, // fallback safe
            title: loggedIn ? 'Menu' : 'Login',
            tabBarIcon: ({ color }) => (
              <IconSymbol
                size={28}
                name={loggedIn ? 'line.3.horizontal' : 'person.crop.circle'}
                color={color}
              />
            ),
            tabBarButton: (props) =>
              loggedIn ? (
                <HapticTab {...props} onPress={() => setMenuVisible(true)} />
              ) : (
                <HapticTab {...props} onPress={() => router.push('/Login')} />
              ),
          }}
        />

        {/* Luôn ẩn các route phụ này */}
        {[
          'About',
          'AccountActivations',
          'AccountActivationsNew',
          'Contact',
          'NotFound',
          'PasswordResets',
          'PasswordResetsNew',
          'ShowFollow',
          'Signup',
          'explore',
          'UserSettings',
          'UserProfile',
          'Login',
        ].map((name) => (
          <Tabs.Screen key={name} name={name} options={{ href: null }} />
        ))}
      </Tabs>

      {/* Menu modal, outside Tabs */}
      <Menu visible={menuVisible} onClose={() => setMenuVisible(false)} />
    </>
  );
}
