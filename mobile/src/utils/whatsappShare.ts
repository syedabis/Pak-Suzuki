import { Linking, Share, Alert } from "react-native";
import { DailyMasterSheetEntry } from "../context/AppContext";

export const formatMasterSheetWhatsApp = (sheet: {
  city: string;
  dealer: string;
  venue?: string;
  eventDate?: string;
  eventTimings?: string;
  footfall?: number | string;
  ogSupervisor?: string;
  psSupervisor?: string;
  fourWheelData?: Record<string, Record<string, number>>;
  kCarryTestDrives?: number;
  everyTestDrives?: number;
  tradeInEvaluations?: number;
  freeInspections?: number;
  freeOilChanges?: number;
  appointmentsGiven?: number;
  genuinePartsRevenuePkr?: number;
  dealerRating?: string;
  supervisorNotes?: string;
}): string => {
  const models = ["Alto", "Cultus", "WagonR", "Swift", "Every", "Ravi", "K-Carry"];

  let matrixSummary = "";
  let totalTD = 0;
  let totalEnq = 0;
  let totalCon = 0;

  if (sheet.fourWheelData) {
    for (const m of models) {
      const data = sheet.fourWheelData[m];
      if (data) {
        const td = data.testDrive || 0;
        const enq = data.salesEnquiry || 0;
        const con = data.conversion || 0;
        totalTD += td;
        totalEnq += enq;
        totalCon += con;
        if (td > 0 || enq > 0 || con > 0) {
          matrixSummary += `  • *${m}*: Test Drives: ${td} | Enq: ${enq} | Bookings: ${con}\n`;
        }
      }
    }
  }

  const lines = [
    `*PAK SUZUKI MOTOR CO. LTD.*`,
    `*SUZUKI EXPRESS 2026 • DAILY MASTER REPORT*`,
    `━━━━━━━━━━━━━━━━━━━━━━━━`,
    `📍 *EVENT DETAILS*`,
    `• *City / Tour Stop*: ${sheet.city}`,
    `• *Dealership*: ${sheet.dealer}`,
    `• *Venue*: ${sheet.venue || "Exhibition Ground"}`,
    `• *Date*: ${sheet.eventDate || "Today"}`,
    sheet.eventTimings ? `• *Timings*: ${sheet.eventTimings} (PKT)` : `• *Time*: PKT`,
    sheet.footfall ? `• *Total Footfall*: ${sheet.footfall}` : null,
    sheet.ogSupervisor ? `• *On-Ground Lead*: ${sheet.ogSupervisor}` : null,
    sheet.psSupervisor ? `• *Area Manager*: ${sheet.psSupervisor}` : null,
    ``,
    `🚗 *AUTOMOBILE MATRIX (4W)*`,
    matrixSummary.trim()
      ? matrixSummary.trim()
      : `  • K-Carry Trials: ${sheet.kCarryTestDrives || 0}\n  • Every Trials: ${sheet.everyTestDrives || 0}`,
    `  ─────────────────────`,
    `  *TOTALS*: Trials: ${
      totalTD || (sheet.kCarryTestDrives || 0) + (sheet.everyTestDrives || 0)
    } | Enq: ${totalEnq} | Spot Bookings: ${totalCon}`,
    ``,
    `🔧 *AFTERSALES & SERVICE*`,
    `• Free Check-ups: ${sheet.freeInspections || 0}`,
    `• Free Oil Changes: ${sheet.freeOilChanges || 0}`,
    `• Vehicle Evaluations (130-pt): ${sheet.tradeInEvaluations || 0}`,
    sheet.appointmentsGiven ? `• Service Appointments: ${sheet.appointmentsGiven}` : null,
    `• Genuine Parts Revenue: PKR ${(sheet.genuinePartsRevenuePkr || 0).toLocaleString()}`,
    ``,
    `⭐ *DEALER PERFORMANCE*`,
    `• Rating: *${sheet.dealerRating || "Good"}*`,
    sheet.supervisorNotes ? `• Notes: "${sheet.supervisorNotes}"` : null,
    `━━━━━━━━━━━━━━━━━━━━━━━━`,
    `_Sent via Pak Suzuki Express Field App_`,
  ].filter((line) => line !== null);

  return lines.join("\n");
};

export const shareToWhatsApp = async (
  sheetOrText:
    | string
    | (Parameters<typeof formatMasterSheetWhatsApp>[0] & { id?: string })
): Promise<void> => {
  const text =
    typeof sheetOrText === "string"
      ? sheetOrText
      : formatMasterSheetWhatsApp(sheetOrText);

  const url = `whatsapp://send?text=${encodeURIComponent(text)}`;

  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      // Fallback: system share sheet
      await Share.share({
        message: text,
        title: "Pak Suzuki Daily Master Inquiry Report",
      });
    }
  } catch (err) {
    try {
      await Share.share({
        message: text,
        title: "Pak Suzuki Daily Master Inquiry Report",
      });
    } catch {
      Alert.alert(
        "WhatsApp Unavailable",
        "Could not open WhatsApp. Please ensure WhatsApp is installed on this device."
      );
    }
  }
};

