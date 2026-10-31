import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TopNavBar } from "../components/TopNavBar";
import { StationModal, ProfileModal } from "../components/Modals";
import { InterceptionTab } from "./InterceptionTab";
import { KCarrySurveyTab } from "./KCarrySurveyTab";
import { MasterSheetTab } from "./MasterSheetTab";
import { FeedTab } from "./FeedTab";
import { useApp } from "../context/AppContext";
import { FONTS } from "../constants/fonts";

export type TabKey = "intercept" | "survey" | "master" | "feed";

export function MainAppScreen() {
  const {
    interceptions,
    surveys,
    masterSheets,
    isKCarryOnly,
    isInterceptionOnly,
    isMasterSheetOnly,
    isViewOnly,
  } = useApp();

  const getInitialTab = (): TabKey => {
    if (isKCarryOnly) return "survey";
    if (isMasterSheetOnly) return "master";
    if (isInterceptionOnly) return "intercept";
    if (isViewOnly) return "feed";
    return "intercept";
  };

  const [activeTab, setActiveTab] = useState<TabKey>(getInitialTab());
  const [stationModalOpen, setStationModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const insets = useSafeAreaInsets();

  React.useEffect(() => {
    if (isKCarryOnly) setActiveTab("survey");
    else if (isMasterSheetOnly) setActiveTab("master");
    else if (isInterceptionOnly) setActiveTab("intercept");
  }, [isKCarryOnly, isMasterSheetOnly, isInterceptionOnly]);

  const totalRecords = interceptions.length + surveys.length + masterSheets.length;

  const showInterceptTab = !isKCarryOnly && !isMasterSheetOnly;
  const showSurveyTab = !isInterceptionOnly && !isMasterSheetOnly;
  const showMasterTab = !isInterceptionOnly && !isKCarryOnly;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Top Persistent Dashboard Header */}
      <TopNavBar
        onOpenStationModal={() => setStationModalOpen(true)}
        onOpenProfileModal={() => setProfileModalOpen(true)}
      />

      {/* Screen Body */}
      <View style={styles.body}>
        {activeTab === "intercept" && <InterceptionTab />}
        {activeTab === "survey" && <KCarrySurveyTab />}
        {activeTab === "master" && <MasterSheetTab />}
        {activeTab === "feed" && <FeedTab />}
      </View>

      {/* Bottom Dashboard Navigation Bar */}
      <View style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, 8) + 4 }]}>
        {/* Tab 1: Interception */}
        {showInterceptTab && (
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab("intercept")}
            activeOpacity={0.7}
          >
            <View style={styles.iconWrapper}>
              <Ionicons
                name={activeTab === "intercept" ? "flash" : "flash-outline"}
                size={19}
                color={activeTab === "intercept" ? "#09090B" : "#71717A"}
              />
              {interceptions.length > 0 && (
                <View style={styles.tabBadge}>
                  <Text style={styles.tabBadgeText}>{interceptions.length}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.tabLabel, activeTab === "intercept" && styles.tabLabelActive]}>
              Interceptions
            </Text>
          </TouchableOpacity>
        )}

        {/* Tab 2: K-Carry Survey */}
        {showSurveyTab && (
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab("survey")}
            activeOpacity={0.7}
          >
            <View style={styles.iconWrapper}>
              <Ionicons
                name={activeTab === "survey" ? "sparkles" : "sparkles-outline"}
                size={19}
                color={activeTab === "survey" ? "#09090B" : "#71717A"}
              />
            </View>
            <Text style={[styles.tabLabel, activeTab === "survey" && styles.tabLabelActive]}>
              K-Carry
            </Text>
          </TouchableOpacity>
        )}

        {/* Tab 3: Master Sheet */}
        {showMasterTab && (
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab("master")}
            activeOpacity={0.7}
          >
            <View style={styles.iconWrapper}>
              <Ionicons
                name={activeTab === "master" ? "document-text" : "document-text-outline"}
                size={19}
                color={activeTab === "master" ? "#09090B" : "#71717A"}
              />
            </View>
            <Text style={[styles.tabLabel, activeTab === "master" && styles.tabLabelActive]}>
              Master Sheet
            </Text>
          </TouchableOpacity>
        )}

        {/* Tab 4: Submissions Feed */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab("feed")}
          activeOpacity={0.7}
        >
          <View style={styles.iconWrapper}>
            <Ionicons
              name={activeTab === "feed" ? "list" : "list-outline"}
              size={19}
              color={activeTab === "feed" ? "#09090B" : "#71717A"}
            />
            {totalRecords > 0 && (
              <View style={[styles.tabBadge, { backgroundColor: "#71717A" }]}>
                <Text style={styles.tabBadgeText}>{totalRecords}</Text>
              </View>
            )}
          </View>
          <Text style={[styles.tabLabel, activeTab === "feed" && styles.tabLabelActive]}>
            Feed
          </Text>
        </TouchableOpacity>
      </View>

      {/* Station Switcher Modal */}
      <StationModal
        visible={stationModalOpen}
        onClose={() => setStationModalOpen(false)}
      />

      {/* Supervisor Profile Modal */}
      <ProfileModal
        visible={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  body: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E4E4E7",
    paddingTop: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    width: 26,
    height: 22,
  },
  tabBadge: {
    position: "absolute",
    top: -4,
    right: -10,
    backgroundColor: "#18181B",
    borderRadius: 8,
    paddingHorizontal: 4,
    minWidth: 14,
    height: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  tabBadgeText: {
    fontFamily: FONTS.bold,
    color: "#FFFFFF",
    fontSize: 9,
  },
  tabLabel: {
    fontFamily: FONTS.medium,
    fontSize: 10,
    color: "#71717A",
    marginTop: 4,
  },
  tabLabelActive: {
    fontFamily: FONTS.bold,
    color: "#09090B",
  },
});
