import React from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "../context/AppContext";
import { CITIES_LIST } from "../constants/tour-data";
import { FONTS } from "../constants/fonts";

interface StationModalProps {
  visible: boolean;
  onClose: () => void;
}

export function StationModal({ visible, onClose }: StationModalProps) {
  const { supervisor, updateCityStation } = useApp();

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.title}>Select Active Tour Station</Text>
              <Text style={styles.subtitle}>Suzuki Express 2026 • 15 Caravan Stops</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={18} color="#71717A" />
            </TouchableOpacity>
          </View>

          <ScrollView style={{ maxHeight: 380 }} showsVerticalScrollIndicator={false}>
            {CITIES_LIST.map((loc) => {
              const isActive = supervisor?.assignedCity === loc.city;
              return (
                <TouchableOpacity
                  key={loc.city}
                  style={[styles.cityCard, isActive && styles.cityCardActive]}
                  onPress={() => {
                    updateCityStation(loc.city, loc.dealer, loc.venue);
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                      <Text style={[styles.cityName, isActive && styles.cityNameActive]}>
                        {loc.city}
                      </Text>
                      <View style={styles.regionTag}>
                        <Text style={styles.regionTagText}>{loc.region}</Text>
                      </View>
                    </View>
                    <Text style={styles.dealerName} numberOfLines={1}>
                      {loc.dealer}
                    </Text>
                    <Text style={styles.venueName} numberOfLines={1}>
                      📍 {loc.venue}
                    </Text>
                  </View>
                  {isActive && (
                    <Ionicons name="checkmark" size={18} color="#09090B" />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

interface ProfileModalProps {
  visible: boolean;
  onClose: () => void;
}

export function ProfileModal({ visible, onClose }: ProfileModalProps) {
  const { supervisor, logout, todayStats } = useApp();

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.centerOverlay}>
        <View style={styles.profileContainer}>
          <View style={styles.profileHeader}>
            <View style={styles.bigAvatar}>
              <Text style={styles.bigAvatarText}>
                {supervisor?.name
                  ? supervisor.name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)
                  : "GA"}
              </Text>
            </View>
            <Text style={styles.profileName}>{supervisor?.name || "Gohar Ali"}</Text>
            <Text style={styles.profileRole}>{supervisor?.role || "On-Ground Lead Supervisor"}</Text>
            <View style={styles.empBadge}>
              <Text style={styles.empBadgeText}>{supervisor?.employeeId || "PSMC-SUP-108"}</Text>
            </View>
          </View>

          {/* Stats Summary */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>{todayStats.totalInterceptions}</Text>
              <Text style={styles.statLabel}>Interceptions</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statNum}>{todayStats.totalSurveys}</Text>
              <Text style={styles.statLabel}>Surveys</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statNum}>100%</Text>
              <Text style={styles.statLabel}>Synced</Text>
            </View>
          </View>

          {/* Details */}
          <View style={styles.detailsBlock}>
            <Text style={styles.detailText}>🏢 {supervisor?.assignedDealer}</Text>
            <Text style={styles.detailText}>📍 {supervisor?.stationVenue}</Text>
            <Text style={styles.detailText}>✉️ {supervisor?.email}</Text>
          </View>

          {/* Actions */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.signOutBtn}
              onPress={() => {
                onClose();
                logout();
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="log-out-outline" size={16} color="#DC2626" />
              <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.doneBtn} onPress={onClose} activeOpacity={0.8}>
              <Text style={styles.doneBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "flex-end",
  },
  sheetContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: "80%",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F4F4F5",
  },
  title: {
    fontFamily: FONTS.semiBold,
    fontSize: 15,
    color: "#09090B",
  },
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: "#71717A",
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
  cityCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 6,
    backgroundColor: "#FAFAFA",
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "#E4E4E7",
  },
  cityCardActive: {
    backgroundColor: "#F4F4F5",
    borderColor: "#18181B",
  },
  cityName: {
    fontFamily: FONTS.semiBold,
    fontSize: 13,
    color: "#09090B",
  },
  cityNameActive: {
    fontFamily: FONTS.bold,
    color: "#09090B",
  },
  regionTag: {
    backgroundColor: "#E4E4E7",
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  regionTagText: {
    fontFamily: FONTS.bold,
    fontSize: 9,
    color: "#71717A",
  },
  dealerName: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: "#3F3F46",
    marginTop: 2,
  },
  venueName: {
    fontFamily: FONTS.regular,
    fontSize: 10,
    color: "#71717A",
    marginTop: 2,
  },

  centerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "center",
    padding: 20,
  },
  profileContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E4E4E7",
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 14,
  },
  bigAvatar: {
    width: 50,
    height: 50,
    borderRadius: 6,
    backgroundColor: "#18181B",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  bigAvatarText: {
    fontFamily: FONTS.bold,
    color: "#FFFFFF",
    fontSize: 18,
  },
  profileName: {
    fontFamily: FONTS.semiBold,
    fontSize: 16,
    color: "#09090B",
  },
  profileRole: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: "#71717A",
    marginTop: 1,
  },
  empBadge: {
    backgroundColor: "#F4F4F5",
    borderWidth: 1,
    borderColor: "#E4E4E7",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 6,
  },
  empBadgeText: {
    fontFamily: FONTS.semiBold,
    color: "#18181B",
    fontSize: 10,
  },
  statsRow: {
    flexDirection: "row",
    backgroundColor: "#FAFAFA",
    borderRadius: 6,
    padding: 10,
    borderWidth: 1,
    borderColor: "#E4E4E7",
    marginBottom: 12,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
  },
  statNum: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: "#09090B",
  },
  statLabel: {
    fontFamily: FONTS.medium,
    fontSize: 9,
    color: "#71717A",
    marginTop: 1,
  },
  statDivider: {
    width: 1,
    backgroundColor: "#E4E4E7",
  },
  detailsBlock: {
    backgroundColor: "#FAFAFA",
    borderRadius: 6,
    padding: 10,
    borderWidth: 1,
    borderColor: "#E4E4E7",
    marginBottom: 14,
    gap: 6,
  },
  detailText: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: "#3F3F46",
  },
  actionRow: {
    flexDirection: "row",
    gap: 8,
  },
  signOutBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    height: 38,
    borderRadius: 6,
  },
  signOutText: {
    fontFamily: FONTS.semiBold,
    color: "#DC2626",
    fontSize: 11,
  },
  doneBtn: {
    flex: 1,
    backgroundColor: "#18181B",
    alignItems: "center",
    justifyContent: "center",
    height: 38,
    borderRadius: 6,
  },
  doneBtnText: {
    fontFamily: FONTS.semiBold,
    color: "#FFFFFF",
    fontSize: 12,
  },
});
