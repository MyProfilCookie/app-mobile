import { useAuth, useSignUp } from "@clerk/expo";
import { Link, useRouter, type Href } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import AuthBranding from "@/components/AuthBranding";
import AuthScreen from "@/components/AuthScreen";
import LoadingScreen from "@/components/LoadingScreen";
import { getClerkErrorMessage } from "@/lib/clerk-errors";

export default function SignUp() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  if (!isLoaded) {
    return <LoadingScreen />;
  }

  const emailValid =
    emailAddress.length === 0 ||
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress);
  const passwordValid = password.length === 0 || password.length >= 8;
  const formValid =
    emailAddress.length > 0 && password.length >= 8 && emailValid;

  const navigateAfterAuth = () => {
    router.replace("/(tabs)" as Href);
  };

  const handleSubmit = async () => {
    if (!formValid) return;
    setApiError(null);

    const { error } = await signUp.password({ emailAddress, password });
    if (error) {
      setApiError(getClerkErrorMessage(error));
      return;
    }

    await signUp.verifications.sendEmailCode();
  };

  const handleVerify = async () => {
    await signUp.verifications.verifyEmailCode({ code });
    if (signUp.status === "complete") {
      await signUp.finalize({
        navigate: ({ session }) => {
          if (session?.currentTask) return;
          navigateAfterAuth();
        },
      });
    }
  };

  if (signUp.status === "complete" || isSignedIn) {
    return <LoadingScreen />;
  }

  if (
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0
  ) {
    return (
      <AuthScreen>
        <AuthBranding
          title="Vérifiez votre e-mail"
          subtitle={`Code envoyé à ${emailAddress}`}
        />
        <View className="auth-form">
          <Text className="auth-label">Code</Text>
          <TextInput
            className="auth-input"
            value={code}
            onChangeText={setCode}
            keyboardType="numeric"
            placeholder="123456"
            placeholderTextColor="rgba(0,0,0,0.4)"
          />
          {errors.fields.code ? (
            <Text className="auth-error">{errors.fields.code.message}</Text>
          ) : null}
          <Pressable
            className="auth-button"
            disabled={fetchStatus === "fetching"}
            onPress={handleVerify}
          >
            <Text className="auth-button-text">
              {fetchStatus === "fetching"
                ? "Vérification…"
                : "Vérifier l'e-mail"}
            </Text>
          </Pressable>
          <Pressable onPress={() => signUp.verifications.sendEmailCode()}>
            <Text className="text-center font-sans-semibold text-accent">
              Renvoyer le code
            </Text>
          </Pressable>
        </View>
      </AuthScreen>
    );
  }

  return (
    <AuthScreen>
      <AuthBranding
        title="Créer un compte"
        subtitle="Suivez vos abonnements et ne ratez plus un prélèvement"
      />
      <View className="auth-form">
        {apiError ? (
          <Text className="mb-2 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
            {apiError}
          </Text>
        ) : null}
        <Text className="auth-label">E-mail</Text>
        <TextInput
          className={`auth-input ${emailTouched && !emailValid ? "auth-input-error" : ""}`}
          value={emailAddress}
          onChangeText={setEmailAddress}
          onBlur={() => setEmailTouched(true)}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          placeholder="vous@exemple.com"
          placeholderTextColor="rgba(0,0,0,0.4)"
        />
        {emailTouched && !emailValid ? (
          <Text className="auth-error">E-mail invalide</Text>
        ) : null}
        {errors.fields.emailAddress ? (
          <Text className="auth-error">
            {errors.fields.emailAddress.message
              ?.toLowerCase()
              .includes("taken")
              ? "Cet e-mail a déjà un compte → utilisez « Se connecter »."
              : errors.fields.emailAddress.message}
          </Text>
        ) : null}

        <Text className="auth-label">Mot de passe</Text>
        <TextInput
          className="auth-input"
          value={password}
          onChangeText={setPassword}
          onBlur={() => setPasswordTouched(true)}
          secureTextEntry
          autoComplete="password-new"
          placeholder="8 caractères minimum"
          placeholderTextColor="rgba(0,0,0,0.4)"
        />
        {passwordTouched && !passwordValid ? (
          <Text className="auth-error">8 caractères minimum</Text>
        ) : null}
        {errors.fields.password ? (
          <Text className="auth-error">
            {errors.fields.password.message}
          </Text>
        ) : null}
        {!passwordTouched ? (
          <Text className="auth-hint">8 caractères minimum</Text>
        ) : null}

        {errors.global?.map((err, i) => (
          <Text key={i} className="auth-error">
            {err.longMessage ?? err.message}
          </Text>
        ))}

        <Pressable
          className={`auth-button ${!formValid || fetchStatus === "fetching" ? "auth-button-disabled" : ""}`}
          disabled={!formValid || fetchStatus === "fetching"}
          onPress={handleSubmit}
        >
          <Text className="auth-button-text">
            {fetchStatus === "fetching" ? "Création…" : "Créer un compte"}
          </Text>
        </Pressable>
      </View>

      <View className="mt-4 rounded-xl border border-accent/40 bg-accent/10 p-4">
        <Text className="font-sans-semibold text-foreground">
          E-mail déjà utilisé ?
        </Text>
        <Text className="mt-1 font-sans-regular text-sm text-muted-foreground">
          Votre compte existe déjà. Connectez-vous avec le même e-mail et mot de
          passe.
        </Text>
        <Link href="/(auth)/sign-in" asChild>
          <Pressable className="mt-3 items-center rounded-xl bg-primary px-4 py-3">
            <Text className="font-sans-semibold text-background">
              Aller à la connexion
            </Text>
          </Pressable>
        </Link>
      </View>

      <View className="auth-link-row">
        <Text className="font-sans-regular text-muted-foreground">
          Déjà un compte ?
        </Text>
        <Link href="/(auth)/sign-in" className="font-sans-semibold text-accent">
          Se connecter
        </Link>
      </View>

      <View nativeID="clerk-captcha" />
    </AuthScreen>
  );
}
