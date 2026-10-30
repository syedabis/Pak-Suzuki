import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "../context/AppContext";
import { FONTS } from "../constants/fonts";

function formatChannel(channel: string) {
  if (!channel) return "Direct";
  if (channel.toLowerCase().includes("rickshaw")) return "Auto Rickshaw";
  if (channel.toLowerCase().includes("recorded")) return "Recorded Call";
  if (channel.toLowerCase().includes("street")) return "Street Banner";
  return channel;
}

export function FeedTab() {
  const { interceptions, surveys, masterSheets } = useApp();
  const [activeSegment, setActiveSegment] = useState<"All" | "MasterSheets" | "Interceptions" | "Surveys">("All");

  const totalCount = masterSheets.length + interceptions.length + surveys.length;

  return (
    <View style={styles.container}>
      {/* Top Filter Segmented Tabs */}
      <View style={styles.topBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.segmentedContainer}>
          <TouchableOpacity
            style={[styles.segmentTab, activeSegment === "All" && styles.segmentTabActive]}
            onPress={() => setActiveSegment("All")}
            activeOpacity={0.7}
          >
            <Text style={[styles.segmentTabText, activeSegment === "All" && styles.segmentTabTextActive]}>
              All ({totalCount})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.segmentTab, activeSegment === "MasterSheets" && styles.segmentTabActive]}
            onPress={() => setActiveSegment("MasterSheets")}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.segmentTabText,
                activeSegment === "MasterSheets" && styles.segmentTabTextActive,
              ]}
            >
              Master Sheets ({masterSheets.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.segmentTab, activeSegment === "Interceptions" && styles.segmentTabActive]}
            onPress={() => setActiveSegment("Interceptions")}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.segmentTabText,
                activeSegment === "Interceptions" && styles.segmentTabTextActive,
              ]}
            >
              Visitors ({interceptions.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.segmentTab, activeSegment === "Surveys" && styles.segmentTabActive]}
            onPress={() => setActiveSegment("Surveys")}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.segmentTabText,
                activeSegment === "Surveys" && styles.segmentTabTextActive,
              ]}
            >
              K-Carry ({surveys.length})
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* SECTION 1: Master Inquiry Sheets */}
        {(activeSegment === "All" || activeSegment === "MasterSheets") && (
          <View style={styles.card}>
            {/* Card Title Header */}
            <View style={styles.cardHeader}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
                  <Ionicons name="document-text-outline" size={16} color="#09090B" />
                  <Text style={styles.cardTitle}>Daily Master Inquiry Sheets</Text>
                </View>
                <View style={styles.countTag}>
                  <Text style={styles.countTagText}>{masterSheets.length} Sheets</Text>
                </View>
              </View>
            </View>

            <View style={styles.cardBody}>
              {masterSheets.length === 0 ? (
                <View style={styles.emptyBox}>
                  <Text style={styles.emptyText}>No master sheets submitted yet.</Text>
                </View>
              ) : (
                masterSheets.map((ms, idx) => (
                  <View
                    key={ms.id || idx}
                    style={[
                      styles.masterSheetCard,
                      idx === masterSheets.length - 1 && { borderBottomWidth: 0 },
                    ]}
                  >
                    {/* Header Row: City & Dealer + Cloud Sync Status */}
                    <View style={styles.msHeaderRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.msCityText}>{ms.city}</Text>
                        <Text style={styles.msDealerText} numberOfLines={1}>{ms.dealer}</Text>
                      </View>
                      <View style={styles.syncBadge}>
                        <Ionicons name="cloud-done-outline" size={12} color="#059669" />
                        <Text style={styles.syncBadgeText}>Synced to Field Logs</Text>
                      </View>
                    </View>

                    {/* Venue & Timing */}
                    <View style={styles.msVenueRow}>
                      <Ionicons name="location-outline" size={12} color="#71717A" />
                      <Text style={styles.msVenueText} numberOfLines={1}>{ms.venue || "Exhibition Ground"}</Text>
                      <Text style={styles.msDateTag}>{ms.eventDate || "2026-11-16"}</Text>
                    </View>

                    {/* Metrics Grid */}
                    <View style={styles.msGrid}>
                      <View style={styles.msMetricBox}>
                        <Text style={styles.msMetricLabel}>Footfall</Text>
                        <Text style={styles.msMetricVal}>{ms.footfall || 150}</Text>
                      </View>
                      <View style={styles.msMetricBox}>
                        <Text style={styles.msMetricLabel}>K-Carry Trials</Text>
                        <Text style={styles.msMetricVal}>{ms.kCarryTestDrives || 0}</Text>
                      </View>
                      <View style={styles.msMetricBox}>
                        <Text style={styles.msMetricLabel}>Every Trials</Text>
                        <Text style={styles.msMetricVal}>{ms.everyTestDrives || 0}</Text>
                      </View>
                      <View style={styles.msMetricBox}>
                        <Text style={styles.msMetricLabel}>Parts Revenue</Text>
                        <Text style={[styles.msMetricVal, { color: "#059669" }]}>
                          PKR {(ms.genuinePartsRevenuePkr || 0).toLocaleString()}
                        </Text>
                      </View>
                    </View>

                    {/* Footer Row: Rating & Supervisor Note */}
                    <View style={styles.msFooterRow}>
                      <View style={[styles.ratingTag, ms.dealerRating === "Excellent" ? styles.ratingTagGood : styles.ratingTagNeutral]}>
                        <Text style={styles.ratingTagText}>{ms.dealerRating || "Good"} Rating</Text>
                      </View>
                      {ms.supervisorNotes ? (
                        <Text style={styles.msNotesText} numberOfLines={2}>
                          "{ms.supervisorNotes}"
                        </Text>
                      ) : null}
                    </View>
                  </View>
                ))
              )}
            </View>
          </View>
        )}

        {/* SECTION 2: Visitor Interceptions */}
        {(activeSegment === "All" || activeSegment === "Interceptions") && (
          <View style={styles.card}>
            {/* Card Title Header */}
            <View style={styles.cardHeader}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
                  <Ionicons name="people-outline" size={16} color="#09090B" />
                  <Text style={styles.cardTitle}>Visitor Interceptions</Text>
                </View>
                <View style={styles.countTag}>
                  <Text style={styles.countTagText}>{interceptions.length} Entries</Text>
                </View>
              </View>
            </View>

            {/* Table Column Headers */}
            <View style={styles.tableHeaderRow}>
              <Text style={styles.tableHeaderLeft}>VISITOR / CITY</Text>
              <Text style={styles.tableHeaderRight}>CONTACT / SOURCE</Text>
            </View>

            {/* Clean, Perfectly Aligned Data Rows */}
            <View style={styles.cardBody}>
              {interceptions.length === 0 ? (
                <View style={styles.emptyBox}>
                  <Text style={styles.emptyText}>No visitors logged yet.</Text>
                </View>
              ) : (
                interceptions.map((row, idx) => (
                  <View
                    key={row.id || idx}
                    style={[
                      styles.rowContainer,
                      idx === interceptions.length - 1 && { borderBottomWidth: 0 },
                    ]}
                  >
                    {/* Left Column: Name & City */}
                    <View style={styles.leftCol}>
                      <Text style={styles.nameText} numberOfLines={1}>
                        {row.name}
                      </Text>
                      <View style={styles.locationRow}>
                        <Ionicons name="location-sharp" size={11} color="#71717A" style={{ marginRight: 2 }} />
                        <Text style={styles.cityText} numberOfLines={1}>
                          {row.city}
                        </Text>
                      </View>
                    </View>

                    {/* Right Column: Phone & Source */}
                    <View style={styles.rightCol}>
                      <TouchableOpacity
                        style={styles.phoneRow}
                        onPress={() => Linking.openURL(`tel:${row.contactNo.replace(/[^0-9+]/g, "")}`)}
                        activeOpacity={0.6}
                      >
                        <Ionicons name="call" size={11} color="#059669" style={{ marginRight: 4 }} />
                        <Text style={styles.phoneText}>{row.contactNo}</Text>
                      </TouchableOpacity>
                      <View style={styles.channelTag}>
                        <Text style={styles.channelTagText} numberOfLines={1}>
                          {formatChannel(row.channel)}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))
              )}
            </View>
          </View>
        )}

        {/* SECTION 3: K-Carry Survey Records */}
        {(activeSegment === "All" || activeSegment === "Surveys") && (
          <View style={styles.card}>
            {/* Card Title Header */}
            <View style={styles.cardHeader}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
                  <Ionicons name="sparkles-outline" size={16} color="#09090B" />
                  <Text style={styles.cardTitle}>K-Carry Survey Records</Text>
                </View>
                <View style={styles.countTag}>
                  <Text style={styles.countTagText}>{surveys.length} Records</Text>
                </View>
              </View>
            </View>

            {/* Table Column Headers */}
            <View style={styles.tableHeaderRow}>
              <Text style={styles.tableHeaderLeft}>RESPONDENT / OCCUPATION</Text>
              <Text style={styles.tableHeaderRight}>LEAD STATUS / BUDGET</Text>
            </View>

            <View style={styles.cardBody}>
              {surveys.length === 0 ? (
                <View style={styles.emptyBox}>
                  <Text style={styles.emptyText}>No K-Carry surveys recorded yet.</Text>
                </View>
              ) : (
                surveys.map((s, idx) => (
                  <View
                    key={s.id || idx}
                    style={[
                      styles.rowContainer,
                      idx === surveys.length - 1 && { borderBottomWidth: 0 },
                    ]}
                  >
                    {/* Left Column: Respondent & Details */}
                    <View style={styles.leftCol}>
                      <Text style={styles.nameText} numberOfLines={1}>
                        {s.respondentName}
                      </Text>
                      <Text style={styles.metaLine} numberOfLines={1}>
                        {s.mainOccupation} • {s.currentVehicle}
                      </Text>
                    </View>

                    {/* Right Column: Status & Budget */}
                    <View style={styles.rightCol}>
                      <View
                        style={[
                          styles.statusTag,
                          {
                            backgroundColor:
                              s.leadStatus === "Hot"
                                ? "#FEF2F2"
                                : s.leadStatus === "Warm"
                                ? "#FFFBEB"
                                : "#F4F4F5",
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusTagText,
                            {
                              color:
                                s.leadStatus === "Hot"
                                ? "#DC2626"
                                : s.leadStatus === "Warm"
                                ? "#D97706"
                                : "#18181B",
                            },
                          ]}
                        >
                          {s.leadStatus === "Hot" ? "🔥 Hot Lead" : `${s.leadStatus} Lead`}
                        </Text>
                      </View>
                      <Text style={styles.budgetLine} numberOfLines={1}>
                        {s.reasonablePriceRange}
                      </Text>
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
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E4E4E7",
  },
  segmentedContainer: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  segmentTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "#F4F4F5",
    borderWidth: 1,
    borderColor: "#E4E4E7",
  },
  segmentTabActive: {
    backgroundColor: "#18181B",
    borderColor: "#18181B",
  },
  segmentTabText: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: "#71717A",
  },
  segmentTabTextActive: {
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
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: "#F4F4F5",
    backgroundColor: "#FAFAFA",
  },
  cardTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: 13,
    color: "#09090B",
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
  tableHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#F4F4F5",
    borderBottomWidth: 1,
    borderBottomColor: "#E4E4E7",
  },
  tableHeaderLeft: {
    fontFamily: FONTS.semiBold,
    fontSize: 10,
    color: "#71717A",
    letterSpacing: 0.5,
  },
  tableHeaderRight: {
    fontFamily: FONTS.semiBold,
    fontSize: 10,
    color: "#71717A",
    letterSpacing: 0.5,
    textAlign: "right",
  },
  cardBody: {
    paddingHorizontal: 14,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: "#F4F4F5",
    gap: 12,
  },
  leftCol: {
    flex: 1.1,
    justifyContent: "center",
  },
  nameText: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    color: "#09090B",
    marginBottom: 3,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cityText: {
    fontFamily: FONTS.medium,
    fontSize: 11,
    color: "#52525B",
  },
  rightCol: {
    alignItems: "flex-end",
    justifyContent: "center",
    maxWidth: 155,
  },
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  phoneText: {
    fontFamily: FONTS.semiBold,
    fontSize: 12,
    color: "#09090B",
    letterSpacing: 0.2,
  },
  channelTag: {
    backgroundColor: "#F4F4F5",
    borderWidth: 1,
    borderColor: "#E4E4E7",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  channelTagText: {
    fontFamily: FONTS.regular,
    fontSize: 10,
    color: "#52525B",
  },
  metaLine: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: "#71717A",
    marginTop: 1,
  },
  budgetLine: {
    fontFamily: FONTS.regular,
    fontSize: 10,
    color: "#A1A1AA",
    marginTop: 2,
    textAlign: "right",
  },
  statusTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusTagText: {
    fontFamily: FONTS.bold,
    fontSize: 10,
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
  // Master Sheet Specific Styles
  masterSheetCard: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F4F4F5",
  },
  msHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  msCityText: {
    fontFamily: FONTS.bold,
    fontSize: 15,
    color: "#09090B",
  },
  msDealerText: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: "#71717A",
    marginTop: 1,
  },
  syncBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  syncBadgeText: {
    fontFamily: FONTS.medium,
    fontSize: 10,
    color: "#059669",
  },
  msVenueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
    marginBottom: 10,
  },
  msVenueText: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: "#71717A",
  },
  msDateTag: {
    fontFamily: FONTS.medium,
    fontSize: 10,
    color: "#71717A",
    backgroundColor: "#F4F4F5",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  msGrid: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: "#FAFAFA",
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#F4F4F5",
    marginBottom: 8,
  },
  msMetricBox: {
    flex: 1,
  },
  msMetricLabel: {
    fontFamily: FONTS.regular,
    fontSize: 10,
    color: "#71717A",
    marginBottom: 2,
  },
  msMetricVal: {
    fontFamily: FONTS.semiBold,
    fontSize: 12,
    color: "#09090B",
  },
  msFooterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ratingTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ratingTagGood: {
    backgroundColor: "#ECFDF5",
  },
  ratingTagNeutral: {
    backgroundColor: "#F4F4F5",
  },
  ratingTagText: {
    fontFamily: FONTS.semiBold,
    fontSize: 10,
    color: "#059669",
  },
  msNotesText: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: "#71717A",
    fontStyle: "italic",
  },
});
