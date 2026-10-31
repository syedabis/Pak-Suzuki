import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  StatusBar as RNStatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApp } from "../context/AppContext";
import { FONTS } from "../constants/fonts";

interface TopNavBarProps {
  onOpenStationModal?: () => void;
  onOpenProfileModal: () => void;
}

export function TopNavBar({ onOpenProfileModal }: TopNavBarProps) {
  const { supervisor } = useApp();
  const insets = useSafeAreaInsets();

  // Ensure safe distance below Android clock, punch-hole camera, or iOS notch
  const safeTopPadding =
    Platform.OS === "android"
      ? (RNStatusBar.currentHeight ? RNStatusBar.currentHeight + 8 : 42)
      : Math.max(insets.top, 16) + 6;

  return (
    <View style={[styles.container, { paddingTop: safeTopPadding }]}>
      {/* Official Website Pak Suzuki Logo */}
      <View style={styles.logoWrapper}>
        <Image
          source={require("../../assets/images/suzuki-logo.png")}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>

      {/* Right Controls: Role Badge + Avatar */}
      <View style={styles.rightSection}>
        {supervisor?.role && (
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText} numberOfLines={1}>
              {supervisor.role.replace(" Access Only", "").replace(" Access", "")}
            </Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.avatarButton}
          onPress={onOpenProfileModal}
          activeOpacity={0.7}
        >
          <Text style={styles.avatarText}>
            {supervisor?.name
              ? supervisor.name
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2)
              : "GA"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#E4E4E7",
  },
  logoWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  logoImage: {
    width: 95,
    height: 28,
  },
  portalTag: {
    backgroundColor: "#F4F4F5",
    borderWidth: 1,
    borderColor: "#E4E4E7",
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  portalTagText: {
    fontFamily: FONTS.bold,
    fontSize: 9,
    color: "#71717A",
    letterSpacing: 0.3,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexShrink: 1,
  },
  stationButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderColor: "#E4E4E7",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    gap: 5,
    maxWidth: 140,
    flexShrink: 1,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
  },
  stationText: {
    fontFamily: FONTS.semiBold,
    color: "#09090B",
    fontSize: 11,
    flexShrink: 1,
  },
  avatarButton: {
    width: 30,
    height: 30,
    borderRadius: 6,
    backgroundColor: "#F4F4F5",
    borderWidth: 1,
    borderColor: "#E4E4E7",
    alignItems: "center",
    justifyContent: "center",
  },
  roleBadge: {
    backgroundColor: "#F4F4F5",
    borderWidth: 1,
    borderColor: "#E4E4E7",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 5,
    maxWidth: 130,
  },
  roleBadgeText: {
    fontFamily: FONTS.semiBold,
    fontSize: 10,
    color: "#18181B",
  },
  avatarText: {
    fontFamily: FONTS.bold,
    color: "#09090B",
    fontSize: 11,
  },
});
