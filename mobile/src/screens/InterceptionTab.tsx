import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "../context/AppContext";
import { MARKETING_CHANNELS, CITIES_LIST } from "../constants/tour-data";
import { FONTS } from "../constants/fonts";

export function InterceptionTab() {
  const { supervisor, addInterception, isViewOnly } = useApp();

  const [name, setName] = useState("");
  const [gender, setGender] = useState<"Male" | "Female">("Male");
  const [age, setAge] = useState("35");
  const [phone, setPhone] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("Auto Rickshaw Banner");
  const [selectedCity, setSelectedCity] = useState(supervisor?.assignedCity || "Usta Muhammad");

  const [channelModalOpen, setChannelModalOpen] = useState(false);
  const [cityModalOpen, setCityModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSubmit = () => {
    if (isViewOnly) {
      showToast("View Access Mode: New customer submissions are disabled.");
      return;
    }

    if (!name.trim() || !phone.trim()) {
      showToast("Please enter Customer Name & Phone");
      return;
    }

    addInterception({
      name: name.trim(),
      gender,
      age: parseInt(age) || 30,
      contactNo: phone.trim(),
      channel: selectedChannel,
      city: selectedCity,
    });

    setName("");
    setPhone("");
    showToast(`Logged ${name.trim()} successfully!`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Banner */}
      <View style={styles.pageHeader}>
        <View style={styles.titleRow}>
          <Text style={styles.pageTitle}>Visitor Interceptions</Text>
          <View style={styles.intakeBadge}>
            <Text style={styles.intakeBadgeText}>Daily Log</Text>
          </View>
        </View>
      </View>

      {/* View Only Alert */}
      {isViewOnly && (
        <View style={styles.viewOnlyAlert}>
          <Ionicons name="eye-outline" size={15} color="#1D4ED8" />
          <Text style={styles.viewOnlyAlertText}>
            View Access Mode: You have read-only access. Form submission is disabled.
          </Text>
        </View>
      )}

      {/* Success Toast */}
      {toastMessage && (
        <View style={styles.toast}>
          <Ionicons name="checkmark-circle" size={16} color="#059669" />
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}

      {/* CARD 1: New Customer / Visitor Form */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Ionicons name="person-add-outline" size={16} color="#09090B" />
            <Text style={styles.cardTitle}>New Customer / Visitor</Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          {/* Row 1: Customer Name */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Customer Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Customer Name"
              placeholderTextColor="#A1A1AA"
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Row 2: Contact Number */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Mobile Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="03XX-XXXXXXX"
              placeholderTextColor="#A1A1AA"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          {/* Row 3: Gender & Age (2-Column Grid) */}
          <View style={styles.grid2}>
            {/* Gender Select */}
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Gender</Text>
              <View style={styles.segmentedRow}>
                <TouchableOpacity
                  style={[styles.segmentBtn, gender === "Male" && styles.segmentBtnActive]}
                  onPress={() => setGender("Male")}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.segmentText, gender === "Male" && styles.segmentTextActive]}>
                    Male
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.segmentBtn, gender === "Female" && styles.segmentBtnActive]}
                  onPress={() => setGender("Female")}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.segmentText, gender === "Female" && styles.segmentTextActive]}>
                    Female
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Age Input */}
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Age</Text>
              <TextInput
                style={styles.input}
                placeholder="Age (e.g. 35)"
                placeholderTextColor="#A1A1AA"
                keyboardType="numeric"
                maxLength={2}
                value={age}
                onChangeText={setAge}
              />
            </View>
          </View>

          {/* Row 4: Event Source & Tour Stop City (2-Column Grid) */}
          <View style={styles.grid2}>
            {/* Marketing Channel Dropdown Selector */}
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Source (Maloomat)</Text>
              <TouchableOpacity
                style={styles.selectTrigger}
                onPress={() => setChannelModalOpen(true)}
                activeOpacity={0.7}
              >
                <Text style={styles.selectValue} numberOfLines={1}>
                  {selectedChannel}
                </Text>
                <Ionicons name="chevron-down" size={14} color="#71717A" />
              </TouchableOpacity>
            </View>

            {/* Tour Stop / City Locked as per Caravan Schedule */}
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <Text style={styles.label}>Tour City</Text>
                <Ionicons name="lock-closed" size={10} color="#059669" />
              </View>
              <View style={[styles.selectTrigger, { backgroundColor: "#F4F4F5", borderColor: "#E4E4E7" }]}>
                <Text style={[styles.selectValue, { color: "#18181B", fontWeight: "600" }]} numberOfLines={1}>
                  {selectedCity}
                </Text>
                <Ionicons name="lock-closed-outline" size={13} color="#71717A" />
              </View>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitBtn, isViewOnly && { backgroundColor: "#9CA3AF" }]}
            onPress={handleSubmit}
            disabled={isViewOnly}
            activeOpacity={0.85}
          >
            <Ionicons name={isViewOnly ? "eye-outline" : "add"} size={18} color="#FFFFFF" />
            <Text style={styles.submitBtnText}>
              {isViewOnly ? "View Only (Submissions Disabled)" : "Add Customer"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Channel Picker Modal */}
      <Modal visible={channelModalOpen} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.pickerCard}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Select Acquisition Channel</Text>
              <TouchableOpacity onPress={() => setChannelModalOpen(false)}>
                <Ionicons name="close" size={20} color="#71717A" />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 300 }}>
              {MARKETING_CHANNELS.map((ch) => {
                const isSelected = selectedChannel === ch;
                return (
                  <TouchableOpacity
                    key={ch}
                    style={[styles.pickerItem, isSelected && styles.pickerItemActive]}
                    onPress={() => {
                      setSelectedChannel(ch);
                      setChannelModalOpen(false);
                    }}
                  >
                    <Text style={[styles.pickerItemText, isSelected && styles.pickerItemTextActive]}>
                      {ch}
                    </Text>
                    {isSelected && <Ionicons name="checkmark" size={16} color="#09090B" />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* City Picker Modal */}
      <Modal visible={cityModalOpen} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.pickerCard}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Select Tour Stop / City</Text>
              <TouchableOpacity onPress={() => setCityModalOpen(false)}>
                <Ionicons name="close" size={20} color="#71717A" />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 300 }}>
              {CITIES_LIST.map((c) => {
                const isSelected = selectedCity === c.city;
                return (
                  <TouchableOpacity
                    key={c.city}
                    style={[styles.pickerItem, isSelected && styles.pickerItemActive]}
                    onPress={() => {
                      setSelectedCity(c.city);
                      setCityModalOpen(false);
                    }}
                  >
                    <View>
                      <Text style={[styles.pickerItemText, isSelected && styles.pickerItemTextActive]}>
                        {c.city} ({c.region})
                      </Text>
                      <Text style={styles.pickerSubText}>{c.dealer}</Text>
                    </View>
                    {isSelected && <Ionicons name="checkmark" size={16} color="#09090B" />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  content: {
    padding: 14,
    paddingBottom: 24,
  },
  pageHeader: {
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  pageTitle: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: "#09090B",
    letterSpacing: -0.2,
  },
  intakeBadge: {
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  intakeBadgeText: {
    fontFamily: FONTS.semiBold,
    color: "#059669",
    fontSize: 10,
  },
  pageSubtitle: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: "#71717A",
    marginTop: 2,
    lineHeight: 16,
  },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
  viewOnlyAlert: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
  viewOnlyAlertText: {
    fontFamily: FONTS.medium,
    color: "#1E40AF",
    fontSize: 11,
    flex: 1,
  },
  toastText: {
    fontFamily: FONTS.medium,
    color: "#065F46",
    fontSize: 12,
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
    fontSize: 14,
    color: "#09090B",
  },
  cardDescription: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: "#71717A",
    marginTop: 2,
  },
  cardBody: {
    padding: 14,
  },
  formGroup: {
    marginBottom: 12,
  },
  label: {
    fontFamily: FONTS.semiBold,
    fontSize: 11,
    color: "#18181B",
    marginBottom: 5,
  },
  input: {
    fontFamily: FONTS.regular,
    height: 38,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E4E4E7",
    borderRadius: 6,
    paddingHorizontal: 10,
    fontSize: 12,
    color: "#09090B",
  },
  grid2: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  segmentedRow: {
    flexDirection: "row",
    backgroundColor: "#F4F4F5",
    borderRadius: 6,
    padding: 2,
    height: 38,
  },
  segmentBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
  },
  segmentBtnActive: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E4E4E7",
  },
  segmentText: {
    fontFamily: FONTS.medium,
    fontSize: 11,
    color: "#71717A",
  },
  segmentTextActive: {
    fontFamily: FONTS.semiBold,
    color: "#09090B",
  },
  selectTrigger: {
    height: 38,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E4E4E7",
    borderRadius: 6,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectValue: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: "#09090B",
    flex: 1,
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#18181B",
    height: 38,
    borderRadius: 6,
    marginTop: 4,
  },
  submitBtnText: {
    fontFamily: FONTS.semiBold,
    color: "#FFFFFF",
    fontSize: 12,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    padding: 20,
  },
  pickerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E4E4E7",
    padding: 16,
    maxHeight: 400,
  },
  pickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F4F4F5",
    marginBottom: 8,
  },
  pickerTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    color: "#09090B",
  },
  pickerItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  pickerItemActive: {
    backgroundColor: "#F4F4F5",
  },
  pickerItemText: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: "#18181B",
  },
  pickerItemTextActive: {
    fontFamily: FONTS.semiBold,
    color: "#09090B",
  },
  pickerSubText: {
    fontFamily: FONTS.regular,
    fontSize: 10,
    color: "#71717A",
    marginTop: 1,
  },
});
