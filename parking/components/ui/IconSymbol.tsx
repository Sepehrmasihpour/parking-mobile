import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { OpaqueColorValue, StyleProp, ViewStyle } from "react-native";

// Add your SFSymbol to MaterialIcons mappings here.
const MAPPING = {
  "house.fill": "home",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  balance: "account-balance-wallet", // Fixed mapping for wallet icon
  key: "key",
} as const;

// Use the keys of the MAPPING object as the IconSymbolName type
export type IconSymbolName = keyof typeof MAPPING;

/**
 * An icon component that uses native SFSymbols on iOS, and MaterialIcons on Android and web.
 *
 * Icon `name`s are based on SFSymbols and require man ual mapping to MaterialIcons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<ViewStyle>;
}) {
  const mappedName = MAPPING[name];
  if (!mappedName) {
    console.warn(`IconSymbol: No mapping found for name "${name}"`);
    return null;
  }
  return (
    <MaterialIcons color={color} size={size} name={mappedName} style={style} />
  );
}
