import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  Animated,
  Dimensions,
  Image,
} from "react-native";

const { width } = Dimensions.get("window");

type Screen = "login" | "signup";
type Gender = "Female" | "Male" | "Custom" | null;

interface LoginForm {
  identifier: string;
  password: string;
}

interface LoginErrors {
  identifier?: string;
  password?: string;
}

interface SignUpForm {
  firstName: string;
  lastName: string;
  mobileOrEmail: string;
  password: string;
  day: string;
  month: string;
  year: string;
  gender: Gender;
}

interface SignUpErrors {
  firstName?: string;
  lastName?: string;
  mobileOrEmail?: string;
  password?: string;
  dob?: string;
  gender?: string;
}


const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function useShake() {
  const anim = useRef(new Animated.Value(0)).current;
  
  const shake = () =>
    Animated.sequence([
      Animated.timing(anim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(anim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  
  return { anim, shake };
}


function MetaLogo(): React.JSX.Element {
  return (
    <Image
      source={require("../assets/images/meta.png")}
      style={shared.metaLogoImage}
      resizeMode="contain"
    />
  );
}


// LOGIN SCREEN

function LoginScreen({ onNavigate }: { onNavigate: (s: Screen) => void }): React.JSX.Element {
  const [form, setForm] = useState<LoginForm>({ identifier: "", password: "" });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [showPw, setShowPw] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const { anim: shakeAnim, shake } = useShake();

  const validate = (): boolean => {
    const e: LoginErrors = {};
    
    if (!form.identifier.trim()) {
      e.identifier = "Mobile number or email is required.";
    }
    if (!form.password || form.password.length < 6) {
      e.password = "Password must be at least 6 characters.";
    }
    
    setErrors(e);
    if (Object.keys(e).length) shake();
    return !Object.keys(e).length;
  };

  const handleLogin = () => {
    if (validate()) alert("Logged in successfully!");
  };

  const getInputWrapStyle = (field: string, hasErr?: boolean) => [
    login.inputWrap,
    focused === field && login.inputWrapFocused,
    hasErr && login.inputWrapError,
  ];

  return (
    <SafeAreaView style={login.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <KeyboardAvoidingView
        style={shared.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Top Bar */}
        <View style={login.topBar}>
          <TouchableOpacity style={login.backButton} activeOpacity={0.7}>
            <Text style={login.backArrow}></Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={login.langText}>English (US) ▾</Text>
          </TouchableOpacity>
        </View>

        {/* Scrollable Body */}
        <Animated.ScrollView
          contentContainerStyle={login.scrollBody}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          style={{ transform: [{ translateX: shakeAnim }] }}
        >
          {/* Facebook Logo */}
          <Image
            source={require("../assets/images/facebook.png")}
            style={login.fbLogo}
            resizeMode="contain"
          />

          {/* Identifier Input */}
          <View style={getInputWrapStyle("id", !!errors.identifier)}>
            {(form.identifier || focused === "id") && (
              <Text style={login.floatingLabel}>Mobile number or email</Text>
            )}
            <TextInput
              style={login.textInput}
              placeholder={focused === "id" ? "" : "Mobile number or email"}
              placeholderTextColor="#8A8D91"
              value={form.identifier}
              onChangeText={(v) => {
                setForm((p) => ({ ...p, identifier: v }));
                setErrors((p) => ({ ...p, identifier: undefined }));
              }}
              onFocus={() => setFocused("id")}
              onBlur={() => setFocused(null)}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
            />
          </View>
          {errors.identifier && (
            <Text style={shared.errorText}>{errors.identifier}</Text>
          )}

          {/* Password Input */}
          <View style={getInputWrapStyle("pw", !!errors.password)}>
            {(form.password || focused === "pw") && (
              <Text style={login.floatingLabel}>Password</Text>
            )}
            <TextInput
              style={[login.textInput, { paddingRight: 60 }]}
              placeholder={focused === "pw" ? "" : "Password"}
              placeholderTextColor="#8A8D91"
              value={form.password}
              onChangeText={(v) => {
                setForm((p) => ({ ...p, password: v }));
                setErrors((p) => ({ ...p, password: undefined }));
              }}
              onFocus={() => setFocused("pw")}
              onBlur={() => setFocused(null)}
              secureTextEntry={!showPw}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />
            <TouchableOpacity
              style={login.showHideButton}
              onPress={() => setShowPw((p) => !p)}
              activeOpacity={0.7}
            >
              <Text style={login.showHideText}>{showPw ? "Hide" : "Show"}</Text>
            </TouchableOpacity>
          </View>
          {errors.password && (
            <Text style={shared.errorText}>{errors.password}</Text>
          )}

          {/* Login Button */}
          <TouchableOpacity
            style={login.logInButton}
            onPress={handleLogin}
            activeOpacity={0.85}
          >
            <Text style={login.logInButtonText}>Log in</Text>
          </TouchableOpacity>

          {/* Forgot Password */}
          <TouchableOpacity style={login.forgotButton} activeOpacity={0.7}>
            <Text style={login.forgotText}>Forgot password?</Text>
          </TouchableOpacity>
        </Animated.ScrollView>

        {/* Bottom Area */}
        <View style={login.bottomArea}>
          <TouchableOpacity
            style={login.createAccountButton}
            onPress={() => onNavigate("signup")}
            activeOpacity={0.85}
          >
            <Text style={login.createAccountText}>Create new account</Text>
          </TouchableOpacity>

          <View style={login.metaLogoRow}>
            <MetaLogo />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


// SIGNUP SCREEN

function SignUpScreen({ onNavigate }: { onNavigate: (s: Screen) => void }): React.JSX.Element {
  const [form, setForm] = useState<SignUpForm>({
    firstName: "",
    lastName: "",
    mobileOrEmail: "",
    password: "",
    day: "",
    month: "",
    year: "",
    gender: null,
  });
  const [errors, setErrors] = useState<SignUpErrors>({});
  const [showPw, setShowPw] = useState(false);
  const [showMonthPicker, setShowMonth] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const { anim: shakeAnim, shake } = useShake();

  const validate = (): boolean => {
    const e: SignUpErrors = {};
    
    if (!form.firstName.trim()) e.firstName = "First name is required.";
    if (!form.lastName.trim()) e.lastName = "Surname is required.";
    if (!form.mobileOrEmail.trim()) e.mobileOrEmail = "Mobile number or email is required.";
    if (!form.password || form.password.length < 6) {
      e.password = "Password must be at least 6 characters.";
    }
    
    const d = parseInt(form.day, 10);
    const y = parseInt(form.year, 10);
    if (
      !form.day || !form.month || !form.year ||
      isNaN(d) || isNaN(y) ||
      d < 1 || d > 31 ||
      y < 1905 || y > new Date().getFullYear() - 5
    ) {
      e.dob = "Please enter a valid date of birth.";
    }
    
    if (!form.gender) e.gender = "Please select a gender.";
    
    setErrors(e);
    if (Object.keys(e).length) shake();
    return !Object.keys(e).length;
  };

  const handleSignUp = () => {
    if (validate()) alert("Account created successfully!");
  };

  const updateField = (field: keyof SignUpForm, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field as keyof SignUpErrors]) {
      setErrors((p) => ({ ...p, [field]: undefined }));
    }
  };

  const selectGender = (g: Gender) => {
    setForm((p) => ({ ...p, gender: g }));
    if (errors.gender) setErrors((p) => ({ ...p, gender: undefined }));
  };

  const getInputStyle = (field: string, hasErr?: boolean) => [
    signup.input,
    focused === field && signup.inputFocused,
    hasErr && signup.inputError,
  ];

  return (
    <SafeAreaView style={signup.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1877F2" />

      <KeyboardAvoidingView
        style={shared.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={signup.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={signup.header}>
            <Text style={signup.logo}>facebook</Text>
            <Text style={signup.tagline}>Fast and easy sign up.</Text>
          </View>

          {/* Form Card */}
          <Animated.View
            style={[signup.card, { transform: [{ translateX: shakeAnim }] }]}
          >
            <Text style={signup.cardTitle}>Create new account</Text>
            <View style={signup.divider} />

            {/* Name Row */}
            <View style={signup.nameRow}>
              <View style={signup.nameField}>
                <TextInput
                  style={getInputStyle("fn", !!errors.firstName)}
                  placeholder="First name"
                  placeholderTextColor="#AAAAAA"
                  value={form.firstName}
                  onChangeText={(v) => updateField("firstName", v)}
                  onFocus={() => setFocused("fn")}
                  onBlur={() => setFocused(null)}
                  autoCapitalize="words"
                  returnKeyType="next"
                />
                {errors.firstName && (
                  <Text style={shared.errorText}>{errors.firstName}</Text>
                )}
              </View>
              
              <View style={signup.nameField}>
                <TextInput
                  style={getInputStyle("ln", !!errors.lastName)}
                  placeholder="Surname"
                  placeholderTextColor="#AAAAAA"
                  value={form.lastName}
                  onChangeText={(v) => updateField("lastName", v)}
                  onFocus={() => setFocused("ln")}
                  onBlur={() => setFocused(null)}
                  autoCapitalize="words"
                  returnKeyType="next"
                />
                {errors.lastName && (
                  <Text style={shared.errorText}>{errors.lastName}</Text>
                )}
              </View>
            </View>

            {/* Mobile/Email */}
            <TextInput
              style={getInputStyle("email", !!errors.mobileOrEmail)}
              placeholder="Mobile number or email address"
              placeholderTextColor="#AAAAAA"
              value={form.mobileOrEmail}
              onChangeText={(v) => updateField("mobileOrEmail", v)}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
            />
            {errors.mobileOrEmail && (
              <Text style={shared.errorText}>{errors.mobileOrEmail}</Text>
            )}

            {/* Password */}
            <View style={signup.passwordWrapper}>
              <TextInput
                style={[getInputStyle("pw2", !!errors.password), signup.passwordInput]}
                placeholder="New password"
                placeholderTextColor="#AAAAAA"
                value={form.password}
                onChangeText={(v) => updateField("password", v)}
                onFocus={() => setFocused("pw2")}
                onBlur={() => setFocused(null)}
                secureTextEntry={!showPw}
                returnKeyType="next"
              />
              <TouchableOpacity
                style={signup.showHideButton}
                onPress={() => setShowPw((p) => !p)}
                activeOpacity={0.7}
              >
                <Text style={signup.showHideText}>{showPw ? "Hide" : "Show"}</Text>
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text style={shared.errorText}>{errors.password}</Text>
            )}

            {/* Date of Birth */}
            <Text style={signup.sectionLabel}>
              Date of birth{"  "}
              <Text style={signup.sectionLabelLink}>
                Why do I need to provide my date of birth?
              </Text>
            </Text>

            <View style={signup.dobRow}>
              {/* Day Input */}
              <TextInput
                style={[getInputStyle("dd", !!errors.dob), signup.dobDay]}
                placeholder="DD"
                placeholderTextColor="#AAAAAA"
                value={form.day}
                onChangeText={(v) => {
                  updateField("day", v.replace(/[^0-9]/g, "").slice(0, 2));
                  setErrors((p) => ({ ...p, dob: undefined }));
                }}
                onFocus={() => setFocused("dd")}
                onBlur={() => setFocused(null)}
                keyboardType="number-pad"
                maxLength={2}
              />

              {/* Month Dropdown */}
              <View style={signup.dobMonthWrap}>
                <TouchableOpacity
                  style={[
                    getInputStyle("mm", !!errors.dob),
                    signup.monthButton,
                    focused === "mm" && signup.inputFocused,
                  ]}
                  onPress={() => {
                    setShowMonth((p) => !p);
                    setFocused("mm");
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={form.month ? signup.monthValueText : signup.monthPlaceholder}>
                    {form.month || "Month"}
                  </Text>
                  <Text style={signup.dropdownArrow}>▾</Text>
                </TouchableOpacity>

                {showMonthPicker && (
                  <View style={signup.monthDropdown}>
                    <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
                      {MONTHS.map((m) => (
                        <TouchableOpacity
                          key={m}
                          style={[
                            signup.monthOption,
                            form.month === m && signup.monthOptionSelected,
                          ]}
                          onPress={() => {
                            setForm((p) => ({ ...p, month: m }));
                            setShowMonth(false);
                            setFocused(null);
                            setErrors((p) => ({ ...p, dob: undefined }));
                          }}
                        >
                          <Text
                            style={[
                              signup.monthOptionText,
                              form.month === m && signup.monthOptionTextSelected,
                            ]}
                          >
                            {m}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>

              {/* Year Input */}
              <TextInput
                style={[getInputStyle("yy", !!errors.dob), signup.dobYear]}
                placeholder="YYYY"
                placeholderTextColor="#AAAAAA"
                value={form.year}
                onChangeText={(v) => {
                  updateField("year", v.replace(/[^0-9]/g, "").slice(0, 4));
                  setErrors((p) => ({ ...p, dob: undefined }));
                }}
                onFocus={() => setFocused("yy")}
                onBlur={() => setFocused(null)}
                keyboardType="number-pad"
                maxLength={4}
              />
            </View>
            {errors.dob && <Text style={shared.errorText}>{errors.dob}</Text>}

            {/* Gender Selection */}
            <Text style={signup.sectionLabel}>
              Gender{"  "}
              <Text style={signup.sectionLabelLink}>
                Why do I need to provide my gender?
              </Text>
            </Text>

            <View style={signup.genderRow}>
              {(["Female", "Male", "Custom"] as Gender[]).map((g) => (
                <TouchableOpacity
                  key={g as string}
                  style={[
                    signup.genderOption,
                    form.gender === g && signup.genderOptionSelected,
                    !!errors.gender && signup.genderOptionError,
                  ]}
                  onPress={() => selectGender(g)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      signup.genderText,
                      form.gender === g && signup.genderTextSelected,
                    ]}
                  >
                    {g}
                  </Text>
                  <View
                    style={[
                      signup.radioOuter,
                      form.gender === g && signup.radioOuterSelected,
                    ]}
                  >
                    {form.gender === g && <View style={signup.radioInner} />}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            {errors.gender && (
              <Text style={shared.errorText}>{errors.gender}</Text>
            )}

            {/* Policy Text */}
            <Text style={signup.policyText}>
              People who use our service may have uploaded your contact
              information to Facebook.{" "}
              <Text style={signup.policyLink}>Learn more.</Text>
            </Text>
            <Text style={signup.policyText}>
              By clicking Sign Up, you agree to our{" "}
              <Text style={signup.policyLink}>Terms</Text>,{" "}
              <Text style={signup.policyLink}>Privacy Policy</Text> and{" "}
              <Text style={signup.policyLink}>Cookies Policy</Text>. You may
              receive SMS notifications from us and can opt out at any time.
            </Text>

            {/* Sign Up Button */}
            <TouchableOpacity
              style={signup.signUpButton}
              onPress={handleSignUp}
              activeOpacity={0.85}
            >
              <Text style={signup.signUpButtonText}>Sign Up</Text>
            </TouchableOpacity>

            {/* Back to Login */}
            <View style={signup.backRow}>
              <TouchableOpacity onPress={() => onNavigate("login")} activeOpacity={0.7}>
                <Text style={signup.backLink}>Already have an account?</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Footer */}
          <View style={signup.footer}>
            <Text style={signup.footerLabel}>from</Text>
            <MetaLogo />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


// STYLES

const login = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
  
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
  },
  
  scrollBody: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  
  bottomArea: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === "ios" ? 28 : 20,
    alignItems: "center",
  },
  
  backButton: { padding: 8 },
  backArrow: { fontSize: 24, color: "#1C1E21", fontWeight: "400" },
  langText: { fontSize: 14, color: "#606770", fontWeight: "500" },
  
  fbLogo: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 36,
    marginTop: 8,
  },
  
  inputWrap: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#CDD0D4",
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 6,
    minHeight: 58,
    justifyContent: "center",
    marginBottom: 12,
  },
  inputWrapFocused: { borderColor: "#1877F2" },
  inputWrapError: { borderColor: "#FA383E" },
  floatingLabel: { fontSize: 12, color: "#606770", marginBottom: 2 },
  textInput: { fontSize: 16, color: "#1C1E21", paddingVertical: 0 },
  
  showHideButton: {
    position: "absolute",
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  showHideText: { color: "#1877F2", fontSize: 14, fontWeight: "600" },
  
  logInButton: {
    width: "100%",
    backgroundColor: "#1877F2",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 6,
    shadowColor: "#1877F2",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  logInButtonText: { color: "#FFFFFF", fontSize: 17, fontWeight: "700" },
  
  forgotButton: { marginTop: 20 },
  forgotText: { color: "#1C1E21", fontSize: 15, fontWeight: "600" },
  
  createAccountButton: {
    width: "100%",
    borderWidth: 1.5,
    borderColor: "#1877F2",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginBottom: 18,
  },
  createAccountText: { color: "#1877F2", fontSize: 16, fontWeight: "700" },
  
  metaLogoRow: { alignItems: "center" },
});



const signup = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#1877F2" },
  scrollContent: { flexGrow: 1, alignItems: "center", paddingBottom: 36 },
  
  header: { alignItems: "center", paddingTop: 40, paddingBottom: 28 },
  logo: {
    fontSize: 44,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -1,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  tagline: {
    fontSize: 15,
    color: "rgba(255,255,255,0.88)",
    marginTop: 6,
    fontWeight: "400",
  },
  
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    width: width - 32,
    paddingHorizontal: 16,
    paddingVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
  },
  cardTitle: { fontSize: 22, fontWeight: "600", color: "#1C1E21", marginBottom: 4 },
  divider: { height: 1, backgroundColor: "#DADDE1", marginVertical: 12 },
  
  nameRow: { flexDirection: "row", gap: 8 },
  nameField: { flex: 1 },
  
  input: {
    borderWidth: 1.5,
    borderColor: "#CDD0D4",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 15,
    color: "#1C1E21",
    backgroundColor: "#F5F6F7",
    marginBottom: 10,
  },
  inputFocused: {
    borderColor: "#1877F2",
    backgroundColor: "#FFFFFF",
    shadowColor: "#1877F2",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  inputError: { borderColor: "#FA383E", backgroundColor: "#FFF0F0" },
  
  passwordWrapper: { position: "relative", justifyContent: "center" },
  passwordInput: { paddingRight: 58 },
  showHideButton: { position: "absolute", right: 12, top: 12 },
  showHideText: { color: "#1877F2", fontSize: 14, fontWeight: "600" },
  
  sectionLabel: { fontSize: 13, color: "#606770", marginBottom: 8, lineHeight: 18 },
  sectionLabelLink: { color: "#1877F2", fontWeight: "500" },
  
  dobRow: { flexDirection: "row", gap: 8, marginBottom: 10, alignItems: "flex-start" },
  dobDay: { flex: 1, textAlign: "center", marginBottom: 0 },
  dobMonthWrap: { flex: 2, position: "relative", zIndex: 10 },
  dobYear: { flex: 1.5, textAlign: "center", marginBottom: 0 },
  
  monthButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 0,
  },
  monthPlaceholder: { color: "#AAAAAA", fontSize: 15 },
  monthValueText: { color: "#1C1E21", fontSize: 15 },
  dropdownArrow: { color: "#606770", fontSize: 14 },
  
  monthDropdown: {
    position: "absolute",
    top: 46,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#1877F2",
    borderRadius: 6,
    maxHeight: 180,
    zIndex: 999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
  },
  monthOption: { paddingHorizontal: 14, paddingVertical: 10 },
  monthOptionSelected: { backgroundColor: "#E7F3FF" },
  monthOptionText: { fontSize: 15, color: "#1C1E21" },
  monthOptionTextSelected: { color: "#1877F2", fontWeight: "600" },
  
  genderRow: { flexDirection: "row", gap: 8, marginBottom: 10 },
  genderOption: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "#CDD0D4",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 11,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F5F6F7",
  },
  genderOptionSelected: { borderColor: "#1877F2", backgroundColor: "#E7F3FF" },
  genderOptionError: { borderColor: "#FA383E" },
  genderText: { fontSize: 14, color: "#606770", fontWeight: "500" },
  genderTextSelected: { color: "#1877F2", fontWeight: "600" },
  
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#CDD0D4",
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterSelected: { borderColor: "#1877F2" },
  radioInner: { width: 9, height: 9, borderRadius: 4.5, backgroundColor: "#1877F2" },
  
  policyText: { fontSize: 12, color: "#777", lineHeight: 17, marginBottom: 8 },
  policyLink: { color: "#1877F2", fontWeight: "500" },
  
  signUpButton: {
    backgroundColor: "#00A400",
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 4,
    shadowColor: "#00A400",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  signUpButtonText: { color: "#FFFFFF", fontSize: 17, fontWeight: "700", letterSpacing: 0.3 },
  
  backRow: {
    alignItems: "center",
    paddingTop: 14,
    paddingBottom: 4,
    borderTopWidth: 1,
    borderTopColor: "#DADDE1",
    marginTop: 12,
  },
  backLink: { color: "#1877F2", fontSize: 15, fontWeight: "600" },
  
  footer: { marginTop: 24, alignItems: "center", gap: 4 },
  footerLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
});

const shared = StyleSheet.create({
  flex: { flex: 1 },
  errorText: { color: "#FA383E", fontSize: 12, marginTop: -6, marginBottom: 8, marginLeft: 2 },
  metaLogoImage: { width: 80, height: 26 },
});


// ROOT COMPONENT

export default function App(): React.JSX.Element {
  const [screen, setScreen] = useState<Screen>("login");
  
  return screen === "login"
    ? <LoginScreen onNavigate={setScreen} />
    : <SignUpScreen onNavigate={setScreen} />;
}