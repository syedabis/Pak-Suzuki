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
import { useApp, getPakistanDate, getPakistanTime } from "../context/AppContext";
import { CITIES_LIST, TourLocation } from "../constants/tour-data";
import { FONTS } from "../constants/fonts";
import { shareToWhatsApp } from "../utils/whatsappShare";

const FOUR_WHEELERS = ["Alto", "Cultus", "WagonR", "Swift", "Every", "Ravi", "K-Carry"] as const;
type FourWheelerModel = (typeof FOUR_WHEELERS)[number];

const INITIAL_4W_DATA: Record<FourWheelerModel, Record<string, number>> = {
  Alto: {
    testDrive: 0,
    salesEnquiry: 20,
    exchangeEnquiry: 18,
    usedCarEnquiry: 12,
    freeEvaluation: 32,
    financing: 6,
    conversion: 2,
  },
  Cultus: {
    testDrive: 0,
    salesEnquiry: 5,
    exchangeEnquiry: 4,
    usedCarEnquiry: 6,
    freeEvaluation: 9,
    financing: 1,
    conversion: 0,
  },
  WagonR: {
    testDrive: 0,
    salesEnquiry: 3,
    exchangeEnquiry: 2,
    usedCarEnquiry: 4,
    freeEvaluation: 4,
    financing: 1,
    conversion: 0,
  },
  Swift: {
    testDrive: 0,
    salesEnquiry: 7,
    exchangeEnquiry: 3,
    usedCarEnquiry: 5,
    freeEvaluation: 6,
    financing: 2,
    conversion: 1,
  },
  Every: {
    testDrive: 24,
    salesEnquiry: 15,
    exchangeEnquiry: 4,
    usedCarEnquiry: 3,
    freeEvaluation: 7,
    financing: 3,
    conversion: 1,
  },
  Ravi: {
    testDrive: 0,
    salesEnquiry: 0,
    exchangeEnquiry: 14,
    usedCarEnquiry: 9,
    freeEvaluation: 18,
    financing: 0,
    conversion: 0,
  },
  "K-Carry": {
    testDrive: 38,
    salesEnquiry: 22,
    exchangeEnquiry: 11,
    usedCarEnquiry: 0,
    freeEvaluation: 20,
    financing: 7,
    conversion: 2,
  },
};

interface MatrixMetric {
  key: string;
  label: string;
  sub: string;
  isHighlight?: boolean;
}

const MATRIX_METRICS: MatrixMetric[] = [
  { key: "testDrive", label: "Test Drive", sub: "On-ground trials" },
  { key: "salesEnquiry", label: "Sales Enquiry", sub: "Customer booking interest" },
  { key: "exchangeEnquiry", label: "Exchange Enquiry", sub: "Trade-in current vehicle" },
  { key: "usedCarEnquiry", label: "Used Car Enquiry", sub: "Pre-owned inquiries" },
  { key: "freeEvaluation", label: "Evaluation", sub: "130-pt vehicle evaluation" },
  { key: "financing", label: "Financing", sub: "Bank & Islamic leases" },
  { key: "conversion", label: "Conversion", sub: "Confirmed spot booking", isHighlight: true },
];

export function MasterSheetTab() {
  const { supervisor, masterSheets, addMasterSheet, isViewOnly } = useApp();
  const scrollViewRef = useRef<any>(null);

  // Event Header Details (matching daily-inquiry-sheet-form.tsx)
  const [city, setCity] = useState(supervisor?.assignedCity || "Usta Muhammad");
  const [venue, setVenue] = useState(supervisor?.stationVenue || "Grain Market Exhibition Ground");
  const [dealer, setDealer] = useState(supervisor?.assignedDealer || "Suzuki Jacobabad Motors");
  const [footfall, setFootfall] = useState("168");
  const [ogSupervisor, setOgSupervisor] = useState(supervisor?.name || "Gohar Ali");
  const [psSupervisor, setPsSupervisor] = useState("Usama Fareed");
  const [cityModalOpen, setCityModalOpen] = useState(false);

  // 4W Automobile Matrix State
  const [selectedModel, setSelectedModel] = useState<FourWheelerModel>("K-Carry");
  const [fourWheelData, setFourWheelData] = useState<Record<FourWheelerModel, Record<string, number>>>(INITIAL_4W_DATA);

  // Workshop & Aftersales
  const [checkups, setCheckups] = useState(96);
  const [oilChanges, setOilChanges] = useState(42);
  const [appointments, setAppointments] = useState(58);
  const [partsSales, setPartsSales] = useState("62400");

  // Ratings & Observations
  const [dealerRating, setDealerRating] = useState<"Satisfactory" | "Good" | "Excellent">("Excellent");
  const [observation, setObservation] = useState(
    "Parts counter established; strong interest in K-Carry rural payload capacity."
  );

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Region calculation matching dashboard
  const regionLabel =
    city.includes("Umerkot") ||
    city.includes("Badin") ||
    city.includes("Jamshoro") ||
    city.includes("Usta") ||
    city.includes("Khairpur") ||
    city.includes("Dadu") ||
    city.includes("Larkana") ||
    city.includes("Sukkur") ||
    city.includes("Ghotki") ||
    city.includes("Tando")
      ? "ROS (Sindh)"
      : "ROSP (Punjab)";

  // Update city and auto-fill venue/dealer from tour list
  const handleSelectCity = (item: TourLocation) => {
    setCity(item.city);
    setVenue(item.venue);
    setDealer(item.dealer);
    setCityModalOpen(false);
  };

  // Matrix cell modifier
  const handleCellChange = (model: FourWheelerModel, field: string, deltaOrValue: number | string) => {
    setFourWheelData((prev) => {
      const currentVal = prev[model]?.[field] || 0;
      let newVal = typeof deltaOrValue === "number" ? Math.max(0, currentVal + deltaOrValue) : parseInt(deltaOrValue) || 0;
      return {
        ...prev,
        [model]: {
          ...prev[model],
          [field]: newVal,
        },
      };
    });
  };

  // Summary Totals
  const totalTestDrives = Object.values(fourWheelData).reduce((sum, m) => sum + (m.testDrive || 0), 0);
  const totalSalesEnquiries = Object.values(fourWheelData).reduce((sum, m) => sum + (m.salesEnquiry || 0), 0);
  const totalConversions = Object.values(fourWheelData).reduce((sum, m) => sum + (m.conversion || 0), 0);

  const handleSubmit = () => {
    if (isViewOnly) {
      showToast("View Access Mode: Master Sheet submission is disabled.");
      return;
    }

    addMasterSheet({
      eventDate: getPakistanDate(),
      eventTimings: getPakistanTime(),
      city,
      dealer,
      venue,
      footfall: parseInt(footfall) || 0,
      ogSupervisor,
      psSupervisor,
      fourWheelData,
      everyTestDrives: fourWheelData.Every?.testDrive || 0,
      kCarryTestDrives: fourWheelData["K-Carry"]?.testDrive || 0,
      tradeInEvaluations: fourWheelData.Alto?.freeEvaluation || 0,
      freeInspections: checkups,
      freeOilChanges: oilChanges,
      appointmentsGiven: appointments,
      genuinePartsRevenuePkr: parseInt(partsSales) || 0,
      dealerRating,
      supervisorNotes: observation,
    });

    showToast("Master Inquiry Sheet saved & synced with IMS database!");
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }, 50);
  };

  const handleShareCurrentWhatsApp = () => {
    shareToWhatsApp({
      city,
      dealer,
      venue,
      eventDate: getPakistanDate(),
      eventTimings: getPakistanTime(),
      footfall: parseInt(footfall) || 0,
      ogSupervisor,
      psSupervisor,
      fourWheelData,
      everyTestDrives: fourWheelData.Every?.testDrive || 0,
      kCarryTestDrives: fourWheelData["K-Carry"]?.testDrive || 0,
      tradeInEvaluations: fourWheelData.Alto?.freeEvaluation || 0,
      freeInspections: checkups,
      freeOilChanges: oilChanges,
      appointmentsGiven: appointments,
      genuinePartsRevenuePkr: parseInt(partsSales) || 0,
      dealerRating,
      supervisorNotes: observation,
    });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <View style={styles.container}>
      {/* Floating Toast Notification */}
      {toastMessage && (
        <View style={styles.floatingToast}>
          <Ionicons name="checkmark-circle" size={18} color="#059669" />
          <Text style={styles.floatingToastText}>{toastMessage}</Text>
        </View>
      )}

      <ScrollView
        ref={scrollViewRef}
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Banner - Matches Dashboard Exactly */}
        <View style={styles.pageHeader}>
          <View style={styles.titleRow}>
            <Text style={styles.pageTitle}>Daily Event Master Inquiry Sheet</Text>
            <View style={styles.intakeBadge}>
              <Text style={styles.intakeBadgeText}>Master Form Template</Text>
            </View>
          </View>
        </View>

        {/* View Only Alert */}
        {isViewOnly && (
          <View style={styles.viewOnlyAlert}>
            <Ionicons name="eye-outline" size={15} color="#1D4ED8" />
            <Text style={styles.viewOnlyAlertText}>
              View Access Mode: You have read-only access. Master sheet submission is disabled.
            </Text>
          </View>
        )}

        {/* CARD 1: Event Header Metadata */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Ionicons name="location-outline" size={16} color="#09090B" />
                <Text style={styles.cardTitle}>Station & Field Audit Setup</Text>
              </View>
              <View style={styles.regionBadge}>
                <Text style={styles.regionBadgeText}>{regionLabel}</Text>
              </View>
            </View>
          </View>

          <View style={styles.cardBody}>
            {/* Tour City Locked as per Caravan Schedule */}
            <View style={styles.formGroup}>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <Text style={styles.label}>Tour City *</Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                  <Ionicons name="lock-closed" size={11} color="#059669" />
                  <Text style={{ fontSize: 10, color: "#059669", fontWeight: "600" }}>Locked as per Schedule</Text>
                </View>
              </View>
              <View style={[styles.selectTrigger, { backgroundColor: "#F4F4F5", borderColor: "#E4E4E7" }]}>
                <Text style={[styles.selectValue, { color: "#18181B", fontWeight: "600" }]} numberOfLines={1}>
                  {city} ({regionLabel})
                </Text>
                <Ionicons name="lock-closed-outline" size={14} color="#71717A" />
              </View>
            </View>

            {/* Venue & Participating Dealer */}
            <View style={styles.grid2}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Venue</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: "#F4F4F5", color: "#18181B" }]}
                  value={venue}
                  editable={false}
                  placeholder="Exhibition Ground"
                  placeholderTextColor="#A1A1AA"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Participating Dealer</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: "#F4F4F5", color: "#18181B" }]}
                  value={dealer}
                  editable={false}
                  placeholder="Authorized Dealer"
                  placeholderTextColor="#A1A1AA"
                />
              </View>
            </View>

            {/* Customer Footfall & Auto Timestamp */}
            <View style={styles.grid2}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Customer Footfall *</Text>
                <TextInput
                  style={[styles.input, { fontWeight: "700" }]}
                  keyboardType="numeric"
                  value={footfall}
                  onChangeText={setFootfall}
                  placeholder="168"
                  placeholderTextColor="#A1A1AA"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Auto Timestamp (PKT)</Text>
                <View style={[styles.input, { backgroundColor: "#F4F4F5", justifyContent: "center" }]}>
                  <Text style={{ fontSize: 12, color: "#18181B", fontWeight: "600" }} numberOfLines={1}>
                    {getPakistanDate()} • {getPakistanTime()}
                  </Text>
                </View>
              </View>
            </View>

            {/* OG Supervisor & PSMC Supervisor */}
            <View style={styles.grid2}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>OG Supervisor</Text>
                <TextInput
                  style={styles.input}
                  value={ogSupervisor}
                  onChangeText={setOgSupervisor}
                  placeholder="Lead Supervisor"
                  placeholderTextColor="#A1A1AA"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>PSMC Supervisor</Text>
                <TextInput
                  style={styles.input}
                  value={psSupervisor}
                  onChangeText={setPsSupervisor}
                  placeholder="Regional Manager"
                  placeholderTextColor="#A1A1AA"
                />
              </View>
            </View>
          </View>
        </View>

        {/* CARD 2: Automobile Matrix (4W Models) */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View>
                <Text style={styles.cardTitle}>Automobile Matrix (4W Models)</Text>
              </View>
            </View>
          </View>

          {/* Matrix KPI Summary Bar */}
          <View style={styles.kpiRow}>
            <View style={styles.kpiItem}>
              <Text style={styles.kpiValue}>{totalTestDrives}</Text>
              <Text style={styles.kpiLabel}>Total Test Drives</Text>
            </View>
            <View style={styles.kpiDivider} />
            <View style={styles.kpiItem}>
              <Text style={styles.kpiValue}>{totalSalesEnquiries}</Text>
              <Text style={styles.kpiLabel}>Sales Enquiries</Text>
            </View>
            <View style={styles.kpiDivider} />
            <View style={styles.kpiItem}>
              <Text style={[styles.kpiValue, { color: "#059669" }]}>{totalConversions}</Text>
              <Text style={styles.kpiLabel}>Spot Bookings</Text>
            </View>
          </View>

          <View style={styles.cardBody}>
            {/* Horizontal Scrollable Model Tabs */}
            <Text style={[styles.label, { marginBottom: 8 }]}>Select Vehicle Model:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.modelTabsContainer}
            >
              {FOUR_WHEELERS.map((m) => {
                const isSelected = selectedModel === m;
                const modelConversions = fourWheelData[m]?.conversion || 0;
                return (
                  <TouchableOpacity
                    key={m}
                    style={[styles.modelTab, isSelected && styles.modelTabActive]}
                    onPress={() => setSelectedModel(m)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.modelTabText, isSelected && styles.modelTabTextActive]}>
                      {m}
                    </Text>
                    {modelConversions > 0 && (
                      <View style={[styles.modelBadge, isSelected && styles.modelBadgeActive]}>
                        <Text style={[styles.modelBadgeText, isSelected && styles.modelBadgeTextActive]}>
                          {modelConversions}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Active Model Audit Card */}
            <View style={styles.modelAuditCard}>
              <View style={styles.modelAuditHeader}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Ionicons name="car-sport" size={16} color="#18181B" />
                  <Text style={styles.modelAuditTitle}>Suzuki {selectedModel}</Text>
                </View>
                <Text style={styles.modelAuditSub}>Audit Metrics</Text>
              </View>

              {MATRIX_METRICS.map((metric, idx) => {
                const val = fourWheelData[selectedModel]?.[metric.key] || 0;
                const isLast = idx === MATRIX_METRICS.length - 1;
                return (
                  <View
                    key={metric.key}
                    style={[
                      styles.metricRow,
                      isLast && { borderBottomWidth: 0 },
                      metric.isHighlight && styles.highlightMetricRow,
                    ]}
                  >
                    <View style={{ flex: 1, paddingRight: 8 }}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                        <Text style={[styles.metricLabel, metric.isHighlight && styles.highlightMetricLabel]}>
                          {metric.label}
                        </Text>
                        {metric.isHighlight && (
                          <View style={styles.conversionChip}>
                            <Text style={styles.conversionChipText}>Target</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.metricSub}>{metric.sub}</Text>
                    </View>

                    <View style={styles.stepperContainer}>
                      <TouchableOpacity
                        style={styles.stepBtn}
                        onPress={() => handleCellChange(selectedModel, metric.key, -1)}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="remove" size={16} color="#09090B" />
                      </TouchableOpacity>

                      <TextInput
                        style={[styles.stepInput, metric.isHighlight && styles.highlightStepInput]}
                        keyboardType="numeric"
                        value={val.toString()}
                        onChangeText={(txt) => handleCellChange(selectedModel, metric.key, txt)}
                      />

                      <TouchableOpacity
                        style={styles.stepBtn}
                        onPress={() => handleCellChange(selectedModel, metric.key, 1)}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="add" size={16} color="#09090B" />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* CARD 3: Aftersales, Workshop & Parts Consumption */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Ionicons name="build-outline" size={16} color="#09090B" />
              <View>
                <Text style={styles.cardTitle}>Aftersales, Workshop & Parts Consumption</Text>
              </View>
            </View>
          </View>

          <View style={styles.cardBody}>
            {/* Free Check-ups */}
            <View style={styles.counterRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.counterLabel}>Free Check-ups Done (Qty)</Text>
                <Text style={styles.counterSub}>130-point safety & mechanical audits</Text>
              </View>
              <View style={styles.stepperContainer}>
                <TouchableOpacity
                  style={styles.stepBtn}
                  onPress={() => setCheckups(Math.max(0, checkups - 1))}
                  activeOpacity={0.7}
                >
                  <Ionicons name="remove" size={16} color="#09090B" />
                </TouchableOpacity>
                <TextInput
                  style={styles.stepInput}
                  keyboardType="numeric"
                  value={checkups.toString()}
                  onChangeText={(t) => setCheckups(parseInt(t) || 0)}
                />
                <TouchableOpacity
                  style={styles.stepBtn}
                  onPress={() => setCheckups(checkups + 1)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="add" size={16} color="#09090B" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Free Oil Changes */}
            <View style={styles.counterRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.counterLabel}>Free Oil Changes Done (Qty)</Text>
                <Text style={styles.counterSub}>Mobil / Suzuki genuine lubricants</Text>
              </View>
              <View style={styles.stepperContainer}>
                <TouchableOpacity
                  style={styles.stepBtn}
                  onPress={() => setOilChanges(Math.max(0, oilChanges - 1))}
                  activeOpacity={0.7}
                >
                  <Ionicons name="remove" size={16} color="#09090B" />
                </TouchableOpacity>
                <TextInput
                  style={styles.stepInput}
                  keyboardType="numeric"
                  value={oilChanges.toString()}
                  onChangeText={(t) => setOilChanges(parseInt(t) || 0)}
                />
                <TouchableOpacity
                  style={styles.stepBtn}
                  onPress={() => setOilChanges(oilChanges + 1)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="add" size={16} color="#09090B" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Next Appointments Given */}
            <View style={styles.counterRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.counterLabel}>Next Appointments Given (Qty)</Text>
                <Text style={styles.counterSub}>Booked dealer workshop visits</Text>
              </View>
              <View style={styles.stepperContainer}>
                <TouchableOpacity
                  style={styles.stepBtn}
                  onPress={() => setAppointments(Math.max(0, appointments - 1))}
                  activeOpacity={0.7}
                >
                  <Ionicons name="remove" size={16} color="#09090B" />
                </TouchableOpacity>
                <TextInput
                  style={styles.stepInput}
                  keyboardType="numeric"
                  value={appointments.toString()}
                  onChangeText={(t) => setAppointments(parseInt(t) || 0)}
                />
                <TouchableOpacity
                  style={styles.stepBtn}
                  onPress={() => setAppointments(appointments + 1)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="add" size={16} color="#09090B" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Parts Sales & Consumption (PKR) */}
            <View style={{ paddingTop: 10 }}>
              <Text style={styles.label}>Parts Sales & Consumption (PKR)</Text>
              <View style={styles.pkrInputBox}>
                <Text style={styles.pkrPrefix}>PKR</Text>
                <TextInput
                  style={styles.pkrInput}
                  placeholder="62400"
                  placeholderTextColor="#A1A1AA"
                  keyboardType="numeric"
                  value={partsSales}
                  onChangeText={setPartsSales}
                />
              </View>
            </View>
          </View>
        </View>

        {/* CARD 4: Rating & Field Observations */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Ionicons name="document-text-outline" size={16} color="#09090B" />
              <Text style={styles.cardTitle}>Dealer Rating & Field Observations</Text>
            </View>
          </View>

          <View style={styles.cardBody}>
            {/* Dealer Performance Rating */}
            <Text style={styles.label}>3S Dealer Performance Rating</Text>
            <View style={styles.ratingRow}>
              {(["Satisfactory", "Good", "Excellent"] as const).map((r) => {
                const isSelected = dealerRating === r;
                return (
                  <TouchableOpacity
                    key={r}
                    style={[styles.ratingBtn, isSelected && styles.ratingBtnActive]}
                    onPress={() => setDealerRating(r)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.ratingBtnText, isSelected && styles.ratingBtnTextActive]}>
                      {r === "Excellent" ? "⭐ " : ""}
                      {r}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Field Observations */}
            <View style={{ marginTop: 14 }}>
              <Text style={styles.label}>Supervisor Field Observation / Special Remarks</Text>
              <TextInput
                style={styles.notesBox}
                multiline
                numberOfLines={3}
                placeholder="Enter field observation, parts inventory state, crowd sentiment..."
                placeholderTextColor="#A1A1AA"
                value={observation}
                onChangeText={setObservation}
              />
            </View>

            {/* Save Button (Deep Charcoal #18181B) */}
            <TouchableOpacity
              style={[styles.submitBtn, isViewOnly && { backgroundColor: "#9CA3AF" }]}
              onPress={handleSubmit}
              disabled={isViewOnly}
              activeOpacity={0.85}
            >
              <Ionicons name={isViewOnly ? "eye-outline" : "save-outline"} size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.submitBtnText}>
                {isViewOnly ? "View Only (Submissions Disabled)" : "Save Master Event Inquiry Record"}
              </Text>
            </TouchableOpacity>

            {/* Direct WhatsApp Share Button */}
            <TouchableOpacity
              style={styles.whatsappBtn}
              onPress={handleShareCurrentWhatsApp}
              activeOpacity={0.85}
            >
              <Ionicons name="logo-whatsapp" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.whatsappBtnText}>Share Report on WhatsApp</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Audit Submissions Feed */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Recent Master Audit Records ({masterSheets.length})</Text>
          </View>
          <View style={styles.cardBody}>
            {masterSheets.map((ms) => (
              <View key={ms.id} style={styles.auditRow}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <Text style={styles.auditCity}>{ms.city}</Text>
                    <View style={styles.auditRatingBadge}>
                      <Text style={styles.auditRatingText}>{ms.dealerRating}</Text>
                    </View>
                  </View>
                  <Text style={styles.auditMeta}>
                    {ms.dealer} • {ms.venue}
                  </Text>
                  <Text style={styles.auditSub}>
                    K-Carry Trials: {ms.kCarryTestDrives} • Every Trials: {ms.everyTestDrives} • Parts: PKR {ms.genuinePartsRevenuePkr.toLocaleString()}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <TouchableOpacity
                    style={styles.auditWhatsAppBtn}
                    onPress={() => shareToWhatsApp(ms)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="logo-whatsapp" size={17} color="#25D366" />
                  </TouchableOpacity>
                  <View style={styles.syncedChip}>
                    <Text style={styles.syncedChipText}>Synced</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Tour City Picker Modal */}
      <Modal visible={cityModalOpen} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.pickerCard}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Select Tour City</Text>
              <TouchableOpacity onPress={() => setCityModalOpen(false)}>
                <Ionicons name="close" size={20} color="#71717A" />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 340 }}>
              {CITIES_LIST.map((c) => {
                const isSelected = city === c.city;
                return (
                  <TouchableOpacity
                    key={c.city}
                    style={[styles.pickerItem, isSelected && styles.pickerItemActive]}
                    onPress={() => handleSelectCity(c)}
                    activeOpacity={0.7}
                  >
                    <View>
                      <Text style={[styles.pickerItemText, isSelected && styles.pickerItemTextActive]}>
                        {c.city} ({c.region})
                      </Text>
                      <Text style={styles.pickerItemSub}>{c.dealer} • {c.venue}</Text>
                    </View>
                    {isSelected && <Ionicons name="checkmark" size={16} color="#09090B" />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 28,
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
    backgroundColor: "#F4F4F5",
    borderWidth: 1,
    borderColor: "#E4E4E7",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  intakeBadgeText: {
    fontFamily: FONTS.semiBold,
    color: "#18181B",
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
  cardDescription: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: "#71717A",
    marginTop: 2,
  },
  regionBadge: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.2)",
  },
  regionBadgeText: {
    fontFamily: FONTS.bold,
    color: "#059669",
    fontSize: 10,
  },
  cardBody: {
    padding: 14,
  },
  formGroup: {
    marginBottom: 12,
  },
  grid2: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  label: {
    fontFamily: FONTS.semiBold,
    fontSize: 11,
    color: "#09090B",
    marginBottom: 4,
  },
  input: {
    fontFamily: FONTS.regular,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E4E4E7",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    fontSize: 12,
    color: "#09090B",
  },
  selectTrigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E4E4E7",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  selectValue: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: "#09090B",
    flex: 1,
  },
  kpiRow: {
    flexDirection: "row",
    backgroundColor: "#FAFAFA",
    borderBottomWidth: 1,
    borderBottomColor: "#E4E4E7",
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  kpiItem: {
    flex: 1,
    alignItems: "center",
  },
  kpiValue: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: "#09090B",
  },
  kpiLabel: {
    fontFamily: FONTS.regular,
    fontSize: 10,
    color: "#71717A",
    marginTop: 2,
  },
  kpiDivider: {
    width: 1,
    backgroundColor: "#E4E4E7",
    height: "80%",
    alignSelf: "center",
  },
  modelTabsContainer: {
    flexDirection: "row",
    gap: 6,
    paddingBottom: 10,
  },
  modelTab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 6,
    backgroundColor: "#F4F4F5",
    borderWidth: 1,
    borderColor: "#E4E4E7",
  },
  modelTabActive: {
    backgroundColor: "#18181B",
    borderColor: "#18181B",
  },
  modelTabText: {
    fontFamily: FONTS.semiBold,
    fontSize: 12,
    color: "#71717A",
  },
  modelTabTextActive: {
    fontFamily: FONTS.semiBold,
    color: "#FFFFFF",
  },
  modelBadge: {
    backgroundColor: "#E4E4E7",
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 8,
  },
  modelBadgeActive: {
    backgroundColor: "#27272A",
  },
  modelBadgeText: {
    fontFamily: FONTS.bold,
    fontSize: 9,
    color: "#18181B",
  },
  modelBadgeTextActive: {
    fontFamily: FONTS.bold,
    color: "#10B981",
  },
  modelAuditCard: {
    backgroundColor: "#FAFAFA",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E4E4E7",
    padding: 10,
    marginTop: 4,
  },
  modelAuditHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#E4E4E7",
    paddingBottom: 8,
    marginBottom: 8,
  },
  modelAuditTitle: {
    fontFamily: FONTS.bold,
    fontSize: 13,
    color: "#09090B",
  },
  modelAuditSub: {
    fontFamily: FONTS.medium,
    fontSize: 10,
    color: "#71717A",
  },
  metricRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F4F4F5",
  },
  highlightMetricRow: {
    backgroundColor: "rgba(16, 185, 129, 0.05)",
    marginHorizontal: -6,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  metricLabel: {
    fontFamily: FONTS.semiBold,
    fontSize: 12,
    color: "#09090B",
  },
  highlightMetricLabel: {
    color: "#047857",
  },
  metricSub: {
    fontFamily: FONTS.regular,
    fontSize: 10,
    color: "#71717A",
    marginTop: 1,
  },
  conversionChip: {
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  conversionChipText: {
    fontFamily: FONTS.bold,
    color: "#059669",
    fontSize: 9,
  },
  counterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F4F4F5",
  },
  counterLabel: {
    fontFamily: FONTS.semiBold,
    fontSize: 12,
    color: "#09090B",
  },
  counterSub: {
    fontFamily: FONTS.regular,
    fontSize: 10,
    color: "#71717A",
    marginTop: 2,
  },
  stepperContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E4E4E7",
    overflow: "hidden",
  },
  stepBtn: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    backgroundColor: "#FAFAFA",
    justifyContent: "center",
    alignItems: "center",
  },
  stepInput: {
    fontFamily: FONTS.bold,
    minWidth: 42,
    textAlign: "center",
    fontSize: 12,
    color: "#09090B",
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  highlightStepInput: {
    color: "#047857",
  },
  pkrInputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E4E4E7",
    overflow: "hidden",
  },
  pkrPrefix: {
    fontFamily: FONTS.bold,
    paddingHorizontal: 10,
    fontSize: 11,
    color: "#71717A",
    backgroundColor: "#FAFAFA",
    borderRightWidth: 1,
    borderRightColor: "#E4E4E7",
    paddingVertical: 8,
  },
  pkrInput: {
    fontFamily: FONTS.semiBold,
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 7,
    fontSize: 12,
    color: "#09090B",
  },
  ratingRow: {
    flexDirection: "row",
    gap: 8,
  },
  ratingBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: "#F4F4F5",
    borderWidth: 1,
    borderColor: "#E4E4E7",
  },
  ratingBtnActive: {
    backgroundColor: "#18181B",
    borderColor: "#18181B",
  },
  ratingBtnText: {
    fontFamily: FONTS.semiBold,
    fontSize: 11,
    color: "#71717A",
  },
  ratingBtnTextActive: {
    color: "#FFFFFF",
  },
  notesBox: {
    fontFamily: FONTS.regular,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E4E4E7",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 12,
    color: "#09090B",
    minHeight: 70,
    textAlignVertical: "top",
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#18181B",
    borderRadius: 6,
    paddingVertical: 12,
    marginTop: 14,
  },
  submitBtnText: {
    fontFamily: FONTS.semiBold,
    color: "#FFFFFF",
    fontSize: 13,
  },
  whatsappBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#16A34A",
    borderRadius: 6,
    paddingVertical: 12,
    marginTop: 8,
  },
  whatsappBtnText: {
    fontFamily: FONTS.semiBold,
    color: "#FFFFFF",
    fontSize: 13,
  },
  auditWhatsAppBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#DCFCE7",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#86EFAC",
  },
  auditRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F4F4F5",
  },
  auditCity: {
    fontFamily: FONTS.bold,
    fontSize: 13,
    color: "#09090B",
  },
  auditRatingBadge: {
    backgroundColor: "#F4F4F5",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  auditRatingText: {
    fontFamily: FONTS.semiBold,
    fontSize: 9,
    color: "#18181B",
  },
  auditMeta: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: "#71717A",
    marginTop: 1,
  },
  auditSub: {
    fontFamily: FONTS.regular,
    fontSize: 10,
    color: "#A1A1AA",
    marginTop: 2,
  },
  syncedChip: {
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  syncedChipText: {
    fontFamily: FONTS.semiBold,
    color: "#059669",
    fontSize: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  pickerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    overflow: "hidden",
    maxHeight: 440,
  },
  pickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E4E4E7",
  },
  pickerTitle: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: "#09090B",
  },
  pickerItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F4F4F5",
  },
  pickerItemActive: {
    backgroundColor: "#F4F4F5",
  },
  pickerItemText: {
    fontFamily: FONTS.semiBold,
    fontSize: 12,
    color: "#09090B",
  },
  pickerItemTextActive: {
    fontFamily: FONTS.bold,
  },
  pickerItemSub: {
    fontFamily: FONTS.regular,
    fontSize: 10,
    color: "#71717A",
    marginTop: 2,
  },
});
