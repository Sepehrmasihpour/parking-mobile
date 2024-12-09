import { Tabs } from "expo-router";
import React, { useContext } from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AuthContext } from "../_layout"; // Import AuthContext from the parent layout

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isSignedIn } = useContext(AuthContext);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      {/* Home tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      {/* Explore tab with wallet icon */}
      <Tabs.Screen
        name="balance"
        options={{
          title: "Balance",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="balance" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
