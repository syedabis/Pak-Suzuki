import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "../context/AppContext";
import { FONTS } from "../constants/fonts";

export function FeedTab() {
  const { interceptions, surveys } = useApp();
  const [activeSegment, setActiveSegment] = useState<"All" | "Interceptions" | "Surveys">("All");

  return (
    <View style={styles.container}>
      {/* Top Filter Segmented Bar */}
      <View style={styles.topBar}>
        <View style={styles.segmentContainer}>
          <TouchableOpacity
            style={[styles.segmentBtn, activeSegment === "All" && styles.segmentBtnActive]}
            onPress={() => setActiveSegment("All")}
            activeOpacity={0.7}
          >
            <Text style={[styles.segmentBtnText, activeSegment === "All" && styles.segmentBtnTextActive]}>
              All ({interceptions.length + surveys.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.segmentBtn, activeSegment === "Interceptions" && styles.segmentBtnActive]}
            onPress={() => setActiveSegment("Interceptions")}
            activeOpacity={0.7}
          >
            <Ionicons
              name="flash"
              size={12}
              color={activeSegment === "Interceptions" ? "#FFFFFF" : "#71717A"}
              style={{ marginRight: 4 }}
            />
            <Text
              style={[
                styles.segmentBtnText,
                activeSegment === "Interceptions" && styles.segmentBtnTextActive,
              ]}
            >
              Interceptions ({interceptions.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.segmentBtn, activeSegment === "Surveys" && styles.segmentBtnActive]}
            onPress={() => setActiveSegment("Surveys")}
            activeOpacity={0.7}
          >
            <Ionicons
              name="sparkles"
              size={12}
              color={activeSegment === "Surveys" ? "#FFFFFF" : "#71717A"}
              style={{ marginRight: 4 }}
            />
            <Text
              style={[
                styles.segmentBtnText,
                activeSegment === "Surveys" && styles.segmentBtnTextActive,
              ]}
            >
              K-Carry ({surveys.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* SECTION 1: Live Interception Log Feed (Table) */}
        {(activeSegment === "All" || activeSegment === "Interceptions") && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Ionicons name="megaphone-outline" size={16} color="#09090B" />
                  <Text style={styles.cardTitle}>Live Interception Log Feed</Text>
                </View>
                <View style={styles.countTag}>
                  <Text style={styles.countTagText}>{interceptions.length} Entries</Text>
                </View>
              </View>
            </View>

            {/* Table Content */}
            <View style={styles.table}>
              {/* Table Header Row */}
              <View style={styles.tableHeaderRow}>
                <Text style={[styles.th, { flex: 1.4 }]}>CUSTOMER</Text>
                <Text style={[styles.th, { flex: 1.2 }]}>CONTACT</Text>
                <Text style={[styles.th, { flex: 1.4 }]}>CHANNEL</Text>
                <Text style={[styles.th, { flex: 1 }]}>CITY</Text>
              </View>

              {/* Table Data Rows */}
              {interceptions.length === 0 ? (
                <View style={styles.emptyBox}>
                  <Text style={styles.emptyText}>No customer interceptions logged yet.</Text>
                </View>
              ) : (
                interceptions.map((row, idx) => (
                  <View key={row.id || idx} style={styles.tableRow}>
                    {/* Customer */}
                    <View style={{ flex: 1.4 }}>
                      <Text style={styles.tdBold} numberOfLines={1}>
                        {row.name}
                      </Text>
                      <Text style={styles.tdSub}>
                        {row.gender}, {row.age} yrs
                      </Text>
                    </View>

                    {/* Contact */}
                    <View style={{ flex: 1.2 }}>
                      <Text style={styles.td}>{row.contactNo}</Text>
                    </View>

                    {/* Channel */}
                    <View style={{ flex: 1.4 }}>
                      <View style={styles.channelBadge}>
                        <Text style={styles.channelBadgeText} numberOfLines={1}>
                          {row.channel}
                        </Text>
                      </View>
                    </View>

                    {/* City */}
                    <View style={{ flex: 1 }}>
                      <Text style={styles.td}>{row.city}</Text>
                    </View>
                  </View>
                ))
              )}
            </View>
          </View>
        )}

        {/* SECTION 2: Recent K-Carry Survey Records */}
        {(activeSegment === "All" || activeSegment === "Surveys") && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Ionicons name="sparkles-outline" size={16} color="#09090B" />
                  <Text style={styles.cardTitle}>Recent K-Carry Survey Records</Text>
                </View>
                <View style={styles.countTag}>
                  <Text style={styles.countTagText}>{surveys.length} Records</Text>
                </View>
              </View>
            </View>

            <View style={styles.cardBody}>
              {surveys.length === 0 ? (
                <View style={styles.emptyBox}>
                  <Text style={styles.emptyText}>No K-Carry surveys recorded yet.</Text>
                </View>
              ) : (
                surveys.map((s) => (
                  <View key={s.id} style={styles.surveyRow}>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                        <Text style={styles.surveyName}>{s.respondentName}</Text>
                        <View
                          style={[
                            styles.statusTag,
                            { backgroundColor: s.leadStatus === "Hot" ? "#FEF2F2" : "#F4F4F5" },
                          ]}
                        >
                          <Text
                            style={[
                              styles.statusTagText,
                              { color: s.leadStatus === "Hot" ? "#DC2626" : "#18181B" },
                            ]}
                          >
                            {s.leadStatus}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.surveyMeta}>
                        {s.mainOccupation} • Uses: {s.currentVehicle}
                      </Text>
                      <Text style={styles.surveySub}>
                        Replacement: {s.suitableReplacementForRavi} • Price: {s.reasonablePriceRange}
                      </Text>
                    </View>
                    <View style={styles.syncedChip}>
                      <Text style={styles.syncedChipText}>Synced</Text>
                    </View>
                  </View>
                ))
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  topBar: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E4E4E7",
  },
  segmentContainer: {
    flexDirection: "row",
    backgroundColor: "#F4F4F5",
    borderRadius: 8,
    padding: 3,
    gap: 4,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 7,
    borderRadius: 6,
  },
  segmentBtnActive: {
    backgroundColor: "#18181B",
  },
  segmentBtnText: {
    fontFamily: FONTS.medium,
    fontSize: 11,
    color: "#71717A",
  },
  segmentBtnTextActive: {
    fontFamily: FONTS.semiBold,
    color: "#FFFFFF",
  },
  content: {
    padding: 14,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E4E4E7",
    marginBottom: 14,
    overflow: "hidden",
  },
  cardHeader: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F4F4F5",
    backgroundColor: "#FAFAFA",
  },
  cardTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: 13,
    color: "#09090B",
  },
  cardBody: {
    padding: 14,
  },
  countTag: {
    backgroundColor: "#F4F4F5",
    borderWidth: 1,
    borderColor: "#E4E4E7",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  countTagText: {
    fontFamily: FONTS.semiBold,
    fontSize: 10,
    color: "#71717A",
  },
  table: {
    width: "100%",
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#FAFAFA",
    borderBottomWidth: 1,
    borderBottomColor: "#E4E4E7",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  th: {
    fontFamily: FONTS.semiBold,
    fontSize: 10,
    color: "#71717A",
    letterSpacing: 0.3,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F4F4F5",
  },
  tdBold: {
    fontFamily: FONTS.semiBold,
    fontSize: 11,
    color: "#09090B",
  },
  tdSub: {
    fontFamily: FONTS.regular,
    fontSize: 9,
    color: "#71717A",
    marginTop: 1,
  },
  td: {
    fontFamily: FONTS.regular,
    fontSize: 10,
    color: "#3F3F46",
  },
  channelBadge: {
    backgroundColor: "#F4F4F5",
    borderWidth: 1,
    borderColor: "#E4E4E7",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  channelBadgeText: {
    fontFamily: FONTS.medium,
    fontSize: 9,
    color: "#18181B",
  },
  surveyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F4F4F5",
  },
  surveyName: {
    fontFamily: FONTS.semiBold,
    fontSize: 12,
    color: "#09090B",
  },
  surveyMeta: {
    fontFamily: FONTS.regular,
    fontSize: 10,
    color: "#71717A",
    marginTop: 2,
  },
  surveySub: {
    fontFamily: FONTS.regular,
    fontSize: 9,
    color: "#A1A1AA",
    marginTop: 1,
  },
  statusTag: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  statusTagText: {
    fontFamily: FONTS.bold,
    fontSize: 9,
  },
  syncedChip: {
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  syncedChipText: {
    fontFamily: FONTS.semiBold,
    fontSize: 9,
    color: "#059669",
  },
  emptyBox: {
    paddingVertical: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: "#A1A1AA",
  },
});
