import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApp } from "../context/AppContext";
import { FONTS } from "../constants/fonts";

export function LoginScreen() {
  const { login } = useApp();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim()) {
      showToast("Please enter your email address");
      return;
    }
    if (!password.trim()) {
      showToast("Please enter your password");
      return;
    }
    setIsLoading(true);
    try {
      const res = await login({ email: email.trim(), pass: password.trim() });
      if (!res.success) {
        showToast(res.message || "Invalid email or password");
      }
    } catch {
      showToast("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      {/* Floating Toast Alert */}
      {toastMessage && (
        <View style={styles.floatingToast}>
          <Ionicons name="alert-circle" size={18} color="#DC2626" />
          <Text style={styles.floatingToastText}>{toastMessage}</Text>
        </View>
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
          {/* Header with Official Logo */}
          <View style={styles.header}>
            <Image
              source={require("../../assets/images/suzuki-logo.png")}
              style={{ width: 220, height: 60 }}
              resizeMode="contain"
            />
          </View>

          {/* Login Card */}
          <View style={styles.card}>
            <View style={styles.cardBody}>
              {/* Email Input */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="admin@paksuzuki.com.pk"
                  placeholderTextColor="#A1A1AA"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>

              {/* Password Input */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.passwordRow}>
                  <TextInput
                    style={[styles.input, { flex: 1, borderWidth: 0, height: "100%" }]}
                    placeholder="paksuzuki2026"
                    placeholderTextColor="#A1A1AA"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeBtn}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={18}
                      color="#71717A"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Sign In Button */}
              <TouchableOpacity
                style={[styles.primaryButton, isLoading && { opacity: 0.75 }]}
                onPress={handleLogin}
                disabled={isLoading}
                activeOpacity={0.85}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <Text style={styles.primaryButtonText}>Sign In</Text>
                    <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  brandTitle: {
    fontFamily: FONTS.bold,
    color: "#09090B",
    fontSize: 18,
    letterSpacing: 0.8,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E4E4E7",
    overflow: "hidden",
  },
  cardBody: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontFamily: FONTS.semiBold,
    fontSize: 12,
    color: "#18181B",
    marginBottom: 6,
  },
  input: {
    fontFamily: FONTS.regular,
    height: 42,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E4E4E7",
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 13,
    color: "#09090B",
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E4E4E7",
    borderRadius: 6,
    height: 42,
    paddingRight: 6,
  },
  eyeBtn: {
    paddingHorizontal: 8,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#18181B",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 42,
    borderRadius: 6,
    marginTop: 8,
  },
  primaryButtonText: {
    fontFamily: FONTS.semiBold,
    color: "#FFFFFF",
    fontSize: 13,
  },
  floatingToast: {
    position: "absolute",
    top: 14,
    left: 20,
    right: 20,
    zIndex: 9999,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingToastText: {
    fontFamily: FONTS.semiBold,
    color: "#991B1B",
    fontSize: 12,
    flex: 1,
  },
});
