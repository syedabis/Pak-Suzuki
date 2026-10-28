import React, { useState, useRef } from "react";
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
import { CITIES_LIST } from "../constants/tour-data";
import { FONTS } from "../constants/fonts";

export function KCarrySurveyTab() {
  const { supervisor, addSurvey } = useApp();
  const scrollViewRef = useRef<any>(null);

  // Active section tab: 'A' (Q1-Q5) or 'B' (Q6-Q10)
  const [activeSection, setActiveSection] = useState<"A" | "B">("A");

  // Header Details
  const [customerName, setCustomerName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [campaignLocation, setCampaignLocation] = useState(supervisor?.assignedCity || "Usta Muhammad");
  const [leadStatus, setLeadStatus] = useState<"Hot" | "Warm" | "Cold">("Hot");
  const [cityPickerOpen, setCityPickerOpen] = useState(false);

  // SECTION A: Customer Usage & Utility Needs (Q1 - Q5)
  const [mainOccupation, setMainOccupation] = useState("Farmer / Agriculture");
  const [mainRequirement, setMainRequirement] = useState("Goods Transportation");
  const [currentVehicle, setCurrentVehicle] = useState("Suzuki Ravi");
  const [mostImportantFeature, setMostImportantFeature] = useState("Fuel Economy");
  const [biggestTransportProblem, setBiggestTransportProblem] = useState("High Fuel Cost");

  // SECTION B: Suzuki K-CARRY Perception & Pricing (Q6 - Q10)
  const [heardAboutKCarryBefore, setHeardAboutKCarryBefore] = useState("Yes");
  const [knowsReplacementForRavi, setKnowsReplacementForRavi] = useState("Yes");
  const [suitableReplacementForRavi, setSuitableReplacementForRavi] = useState("Yes");
  const [reasonablePriceRange, setReasonablePriceRange] = useState("PKR 22–24 lakh");
  const [wouldConsiderBuying, setWouldConsiderBuying] = useState("Definitely Yes");
  const [notes, setNotes] = useState("");

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Q1 Options
  const occupations = [
    "Farmer / Agriculture",
    "Business / Trader",
    "Shopkeeper",
    "Transport / Delivery",
    "Job / Employee",
    "Other",
  ];

  // Q2 Options
  const requirements = [
    "Agriculture / Farm Work",
    "Goods Transportation",
    "Business / Shop",
    "Delivery",
    "Personal / Family Use",
    "Other",
  ];

  // Q3 Options
  const vehicles = [
    "Suzuki Ravi",
    "FAW — Carrier",
    "Hyundai — Shehzore",
    "Forland — C10 / C10 Fortis",
    "JAC — X200",
    "Changan — M9 / other",
    "Tractor / Trolley",
    "Motorcycle / Loader",
    "No Vehicle",
  ];

  // Q4 Options
  const features = [
    "Load Carrying Capacity",
    "Fuel Economy",
    "Durability",
    "Low Maintenance Cost",
    "Comfort",
    "Price",
  ];

  // Q5 Options
  const problems = [
    "High Fuel Cost",
    "Limited Load Capacity",
    "High Maintenance Cost",
    "Frequent Breakdowns",
    "Lack of Comfort",
    "No Major Problem",
  ];

  // Q8 Options
  const replacementOptions = ["Yes", "No", "Not Sure"];

  // Q9 Options
  const priceRanges = [
    "PKR 22–24 lakh",
    "PKR 24–27 lakh",
    "PKR 28–30 lakh",
    "Above PKR 30 lakh",
  ];

  // Q10 Options
  const buyingIntents = [
    "Definitely Yes",
    "Maybe / Needs More Information",
    "No",
  ];

  const handleNextToSectionB = () => {
    setActiveSection("B");
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }, 50);
  };

  const handleBackToSectionA = () => {
    setActiveSection("A");
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }, 50);
  };

  const handleSelectSection = (sec: "A" | "B") => {
    setActiveSection(sec);
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }, 50);
  };

  const handleSubmit = () => {
    if (!customerName.trim() || !mobileNo.trim()) {
      showToast("Please enter Customer Name and Mobile Number first");
      setActiveSection("A");
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      }, 50);
      return;
    }

    addSurvey({
      respondentName: customerName.trim(),
      contactNo: mobileNo.trim(),
      city: campaignLocation,
      leadStatus,
      mainOccupation,
      mainRequirement,
      currentVehicle,
      mostImportantFeature,
      biggestTransportProblem,
      heardAboutKCarryBefore,
      knowsReplacementForRavi,
      suitableReplacementForRavi,
      reasonablePriceRange,
      wouldConsiderBuying,
      notes: notes.trim(),
    });

    setCustomerName("");
    setMobileNo("");
    setNotes("");
    setActiveSection("A");
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }, 50);
    showToast(`Survey for ${customerName} logged successfully!`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <View style={styles.container}>
      {/* Floating Toast Alert - Always visible at top of viewport */}
      {toastMessage && (
        <View
          style={[
            styles.floatingToast,
            toastMessage.includes("Please") && styles.floatingToastWarning,
          ]}
        >
          <Ionicons
            name={toastMessage.includes("Please") ? "alert-circle" : "checkmark-circle"}
            size={18}
            color={toastMessage.includes("Please") ? "#DC2626" : "#059669"}
          />
          <Text
            style={[
              styles.floatingToastText,
              toastMessage.includes("Please") && styles.floatingToastWarningText,
            ]}
          >
            {toastMessage}
          </Text>
        </View>
      )}

      <ScrollView
        ref={scrollViewRef}
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

      {/* Program Header */}
      <View style={styles.pageHeader}>
        <View style={styles.titleRow}>
          <Text style={styles.pageTitle}>K-CARRY Customer Feedback Survey</Text>
          <View style={styles.intakeBadge}>
            <Text style={styles.intakeBadgeText}>Season 5 Rural Tour</Text>
          </View>
        </View>
      </View>

      {/* CARD 1: Header / Lead Details */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Lead Details</Text>
            {/* Lead Status Buttons */}
            <View style={styles.leadGroup}>
              {(["Hot", "Warm", "Cold"] as const).map((s) => {
                const isSelected = leadStatus === s;
                return (
                  <TouchableOpacity
                    key={s}
                    style={[
                      styles.leadPill,
                      isSelected && {
                        backgroundColor: s === "Hot" ? "#EF4444" : s === "Warm" ? "#F59E0B" : "#18181B",
                        borderColor: "transparent",
                      },
                    ]}
                    onPress={() => setLeadStatus(s)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.leadPillText, isSelected && { color: "#FFFFFF", fontWeight: "700" }]}>
                      {s === "Hot" ? "🔥 " : s === "Warm" ? "⚡ " : ""}
                      {s}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Customer Full Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Ghulam Rasool Bhatti"
              placeholderTextColor="#A1A1AA"
              value={customerName}
              onChangeText={setCustomerName}
            />
          </View>

          <View style={styles.grid2}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Mobile Number *</Text>
              <TextInput
                style={styles.input}
                placeholder="0300-1234567"
                placeholderTextColor="#A1A1AA"
                keyboardType="phone-pad"
                value={mobileNo}
                onChangeText={setMobileNo}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Tour Stop *</Text>
              <TouchableOpacity
                style={styles.selectTrigger}
                onPress={() => setCityPickerOpen(true)}
                activeOpacity={0.7}
              >
                <Text style={styles.selectValue} numberOfLines={1}>
                  {campaignLocation}
                </Text>
                <Ionicons name="chevron-down" size={14} color="#71717A" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* SECTION TABS SWITCHER (Clean 2-line layout, equal 50% flex, zero text wrapping) */}
      <View style={styles.sectionTabs}>
        <TouchableOpacity
          style={[styles.sectionTabBtn, activeSection === "A" && styles.sectionTabBtnActive]}
          onPress={() => handleSelectSection("A")}
          activeOpacity={0.7}
        >
          <Text style={[styles.sectionTabTitle, activeSection === "A" && styles.sectionTabTitleActive]}>
            Section A
          </Text>
          <Text style={[styles.sectionTabSub, activeSection === "A" && styles.sectionTabSubActive]}>
            Usage & Utility (Q1–Q5)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.sectionTabBtn, activeSection === "B" && styles.sectionTabBtnActive]}
          onPress={() => handleSelectSection("B")}
          activeOpacity={0.7}
        >
          <Text style={[styles.sectionTabTitle, activeSection === "B" && styles.sectionTabTitleActive]}>
            Section B
          </Text>
          <Text style={[styles.sectionTabSub, activeSection === "B" && styles.sectionTabSubActive]}>
            Perception & Price (Q6–Q10)
          </Text>
        </TouchableOpacity>
      </View>

      {/* SECTION A: Customer Usage & Utility Needs */}
      {activeSection === "A" && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.sectionTitleHeader}>SECTION A: CUSTOMER USAGE & UTILITY NEEDS</Text>
          </View>

          <View style={styles.cardBody}>
            {/* Q1 */}
            <View style={styles.questionBlock}>
              <Text style={styles.questionLabel}>1. What is your main occupation?</Text>
              <View style={styles.optionsGrid}>
                {occupations.map((opt) => {
                  const isSelected = mainOccupation === opt;
                  return (
                    <TouchableOpacity
                      key={opt}
                      style={[styles.radioItem, isSelected && styles.radioItemActive]}
                      onPress={() => setMainOccupation(opt)}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.radioCircle, isSelected && styles.radioCircleActive]}>
                        {isSelected && <View style={styles.radioDot} />}
                      </View>
                      <Text style={[styles.radioText, isSelected && styles.radioTextActive]}>
                        {opt}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Q2 */}
            <View style={styles.questionBlock}>
              <Text style={styles.questionLabel}>2. What is your main utility requirement?</Text>
              <View style={styles.optionsGrid}>
                {requirements.map((opt) => {
                  const isSelected = mainRequirement === opt;
                  return (
                    <TouchableOpacity
                      key={opt}
                      style={[styles.radioItem, isSelected && styles.radioItemActive]}
                      onPress={() => setMainRequirement(opt)}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.radioCircle, isSelected && styles.radioCircleActive]}>
                        {isSelected && <View style={styles.radioDot} />}
                      </View>
                      <Text style={[styles.radioText, isSelected && styles.radioTextActive]}>
                        {opt}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Q3 */}
            <View style={styles.questionBlock}>
              <Text style={styles.questionLabel}>3. What vehicle do you currently use for carrying goods?</Text>
              <View style={styles.optionsGrid}>
                {vehicles.map((opt) => {
                  const isSelected = currentVehicle === opt;
                  return (
                    <TouchableOpacity
                      key={opt}
                      style={[styles.radioItem, isSelected && styles.radioItemActive]}
                      onPress={() => setCurrentVehicle(opt)}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.radioCircle, isSelected && styles.radioCircleActive]}>
                        {isSelected && <View style={styles.radioDot} />}
                      </View>
                      <Text style={[styles.radioText, isSelected && styles.radioTextActive]}>
                        {opt}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Q4 */}
            <View style={styles.questionBlock}>
              <Text style={styles.questionLabel}>4. Most important feature expected from utility vehicle?</Text>
              <View style={styles.optionsGrid}>
                {features.map((opt) => {
                  const isSelected = mostImportantFeature === opt;
                  return (
                    <TouchableOpacity
                      key={opt}
                      style={[styles.radioItem, isSelected && styles.radioItemActive]}
                      onPress={() => setMostImportantFeature(opt)}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.radioCircle, isSelected && styles.radioCircleActive]}>
                        {isSelected && <View style={styles.radioDot} />}
                      </View>
                      <Text style={[styles.radioText, isSelected && styles.radioTextActive]}>
                        {opt}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Q5 */}
            <View style={styles.questionBlock}>
              <Text style={styles.questionLabel}>5. Biggest challenge with current transport?</Text>
              <View style={styles.optionsGrid}>
                {problems.map((opt) => {
                  const isSelected = biggestTransportProblem === opt;
                  return (
                    <TouchableOpacity
                      key={opt}
                      style={[styles.radioItem, isSelected && styles.radioItemActive]}
                      onPress={() => setBiggestTransportProblem(opt)}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.radioCircle, isSelected && styles.radioCircleActive]}>
                        {isSelected && <View style={styles.radioDot} />}
                      </View>
                      <Text style={[styles.radioText, isSelected && styles.radioTextActive]}>
                        {opt}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Continue Button */}
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={handleNextToSectionB}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryBtnText}>Continue to Section B (Q6–Q10)</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* SECTION B: Suzuki K-CARRY Perception & Pricing */}
      {activeSection === "B" && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.sectionTitleHeader}>SECTION B: SUZUKI K-CARRY PERCEPTION & PRICING</Text>
          </View>

          <View style={styles.cardBody}>
            {/* Q6 */}
            <View style={styles.questionBlock}>
              <Text style={styles.questionLabel}>6. Before today, had you heard about Suzuki K-CARRY?</Text>
              <View style={styles.horizontalRow}>
                {["Yes", "No"].map((opt) => {
                  const isSelected = heardAboutKCarryBefore === opt;
                  return (
                    <TouchableOpacity
                      key={opt}
                      style={[styles.radioItemSmall, isSelected && styles.radioItemActive]}
                      onPress={() => setHeardAboutKCarryBefore(opt)}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.radioCircle, isSelected && styles.radioCircleActive]}>
                        {isSelected && <View style={styles.radioDot} />}
                      </View>
                      <Text style={[styles.radioText, isSelected && styles.radioTextActive]}>{opt}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Q7 */}
            <View style={styles.questionBlock}>
              <Text style={styles.questionLabel}>7. Did you know K-CARRY is being introduced to replace Ravi?</Text>
              <View style={styles.horizontalRow}>
                {["Yes", "No"].map((opt) => {
                  const isSelected = knowsReplacementForRavi === opt;
                  return (
                    <TouchableOpacity
                      key={opt}
                      style={[styles.radioItemSmall, isSelected && styles.radioItemActive]}
                      onPress={() => setKnowsReplacementForRavi(opt)}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.radioCircle, isSelected && styles.radioCircleActive]}>
                        {isSelected && <View style={styles.radioDot} />}
                      </View>
                      <Text style={[styles.radioText, isSelected && styles.radioTextActive]}>{opt}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Q8 */}
            <View style={styles.questionBlock}>
              <Text style={styles.questionLabel}>8. After seeing K-CARRY, is it a suitable replacement for Ravi?</Text>
              <View style={styles.horizontalRow}>
                {replacementOptions.map((opt) => {
                  const isSelected = suitableReplacementForRavi === opt;
                  return (
                    <TouchableOpacity
                      key={opt}
                      style={[styles.radioItemSmall, isSelected && styles.radioItemActive]}
                      onPress={() => setSuitableReplacementForRavi(opt)}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.radioCircle, isSelected && styles.radioCircleActive]}>
                        {isSelected && <View style={styles.radioDot} />}
                      </View>
                      <Text style={[styles.radioText, isSelected && styles.radioTextActive]}>{opt}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Q9 */}
            <View style={styles.questionBlock}>
              <Text style={styles.questionLabel}>9. What price range would you consider reasonable?</Text>
              <View style={styles.optionsGrid}>
                {priceRanges.map((opt) => {
                  const isSelected = reasonablePriceRange === opt;
                  return (
                    <TouchableOpacity
                      key={opt}
                      style={[styles.radioItem, isSelected && styles.radioItemActive]}
                      onPress={() => setReasonablePriceRange(opt)}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.radioCircle, isSelected && styles.radioCircleActive]}>
                        {isSelected && <View style={styles.radioDot} />}
                      </View>
                      <Text style={[styles.radioText, isSelected && styles.radioTextActive]}>{opt}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Q10 */}
            <View style={styles.questionBlock}>
              <Text style={styles.questionLabel}>10. If K-CARRY meets your requirements and price, would you buy?</Text>
              <View style={styles.optionsGrid}>
                {buyingIntents.map((opt) => {
                  const isSelected = wouldConsiderBuying === opt;
                  return (
                    <TouchableOpacity
                      key={opt}
                      style={[styles.radioItem, isSelected && styles.radioItemActive]}
                      onPress={() => setWouldConsiderBuying(opt)}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.radioCircle, isSelected && styles.radioCircleActive]}>
                        {isSelected && <View style={styles.radioDot} />}
                      </View>
                      <Text style={[styles.radioText, isSelected && styles.radioTextActive]}>{opt}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Remarks / Notes */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Customer Remarks / Trade-In Details</Text>
              <TextInput
                style={styles.notesBox}
                multiline
                numberOfLines={3}
                placeholder="e.g. Inquiring about Meezan Islamic financing; wants evaluation on 2018 Ravi"
                placeholderTextColor="#A1A1AA"
                value={notes}
                onChangeText={setNotes}
              />
            </View>

            {/* Actions */}
            <View style={styles.btnRow}>
              <TouchableOpacity
                style={styles.outlineBtn}
                onPress={handleBackToSectionA}
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back" size={16} color="#18181B" style={{ marginRight: 4 }} />
                <Text style={styles.outlineBtnText}>Section A</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.primaryBtn, { flex: 2 }]}
                onPress={handleSubmit}
                activeOpacity={0.85}
              >
                <Ionicons name="paper-plane-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.primaryBtnText}>Submit K-CARRY Record</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Tour Stop City Picker Modal */}
      <Modal visible={cityPickerOpen} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.pickerCard}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Select Tour Stop City</Text>
              <TouchableOpacity onPress={() => setCityPickerOpen(false)}>
                <Ionicons name="close" size={20} color="#71717A" />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 300 }}>
              {CITIES_LIST.map((c) => {
                const isSelected = campaignLocation === c.city;
                return (
                  <TouchableOpacity
                    key={c.city}
                    style={[styles.pickerItem, isSelected && styles.pickerItemActive]}
                    onPress={() => {
                      setCampaignLocation(c.city);
                      setCityPickerOpen(false);
                    }}
                  >
                    <Text style={[styles.pickerItemText, isSelected && styles.pickerItemTextActive]}>
                      {c.city} ({c.region})
                    </Text>
                    {isSelected && <Ionicons name="checkmark" size={16} color="#09090B" />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  </View>
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
    lineHeight: 15,
  },
  floatingToast: {
    position: "absolute",
    top: 12,
    left: 14,
    right: 14,
    zIndex: 9999,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingToastText: {
    fontFamily: FONTS.semiBold,
    color: "#065F46",
    fontSize: 13,
    flex: 1,
  },
  floatingToastWarning: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
  },
  floatingToastWarningText: {
    color: "#991B1B",
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
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  cardTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: 13,
    color: "#09090B",
    flexShrink: 1,
  },
  sectionTitleHeader: {
    fontFamily: FONTS.bold,
    fontSize: 11,
    color: "#18181B",
    letterSpacing: 0.5,
  },
  cardBody: {
    padding: 14,
  },
  leadGroup: {
    flexDirection: "row",
    gap: 4,
  },
  leadPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#E4E4E7",
    backgroundColor: "#FFFFFF",
  },
  leadPillText: {
    fontFamily: FONTS.medium,
    fontSize: 10,
    color: "#71717A",
  },
  formGroup: {
    marginBottom: 12,
  },
  grid2: {
    flexDirection: "row",
    gap: 10,
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

  // SECTION TABS: Equal 50/50 flex, centered 2-line layout, zero text cutoff
  sectionTabs: {
    flexDirection: "row",
    backgroundColor: "#F4F4F5",
    borderRadius: 8,
    padding: 3,
    marginBottom: 14,
    gap: 4,
  },
  sectionTabBtn: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },
  sectionTabBtnActive: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E4E4E7",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  sectionTabTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: 12,
    color: "#71717A",
  },
  sectionTabTitleActive: {
    fontFamily: FONTS.bold,
    color: "#09090B",
  },
  sectionTabSub: {
    fontFamily: FONTS.regular,
    fontSize: 10,
    color: "#A1A1AA",
    marginTop: 2,
  },
  sectionTabSubActive: {
    fontFamily: FONTS.medium,
    color: "#71717A",
  },

  questionBlock: {
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F4F4F5",
  },
  questionLabel: {
    fontFamily: FONTS.semiBold,
    fontSize: 12,
    color: "#09090B",
    marginBottom: 8,
  },
  optionsGrid: {
    gap: 6,
  },
  horizontalRow: {
    flexDirection: "row",
    gap: 8,
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E4E4E7",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  radioItemSmall: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E4E4E7",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  radioItemActive: {
    borderColor: "#18181B",
    backgroundColor: "#FAFAFA",
  },
  radioCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: "#A1A1AA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  radioCircleActive: {
    borderColor: "#18181B",
  },
  radioDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#18181B",
  },
  radioText: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: "#3F3F46",
    flex: 1,
  },
  radioTextActive: {
    fontFamily: FONTS.semiBold,
    color: "#09090B",
  },
  notesBox: {
    fontFamily: FONTS.regular,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E4E4E7",
    borderRadius: 6,
    padding: 10,
    fontSize: 12,
    color: "#09090B",
    textAlignVertical: "top",
    minHeight: 65,
  },
  btnRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 6,
  },
  outlineBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E4E4E7",
    height: 38,
    borderRadius: 6,
  },
  outlineBtnText: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: "#18181B",
  },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#18181B",
    height: 38,
    borderRadius: 6,
  },
  primaryBtnText: {
    fontFamily: FONTS.semiBold,
    color: "#FFFFFF",
    fontSize: 12,
  },
  surveyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
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
    maxHeight: 380,
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
});
