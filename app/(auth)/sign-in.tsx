import { useAuth, useSignIn } from "@clerk/expo";
import { Link, useRouter, type Href } from "expo-router";
import { useEffect, useState } from "react";
import { usePostHog } from "posthog-react-native";
import { Pressable, Text, TextInput, View } from "react-native";

import AuthBranding from "@/components/AuthBranding";
import AuthScreen from "@/components/AuthScreen";
import LoadingScreen from "@/components/LoadingScreen";
import { getClerkErrorMessage } from "@/lib/clerk-errors";

type MfaStrategy = "email_code" | "phone_code" | "totp";

function pickMfaStrategy(
  factors: { strategy: string }[] | null | undefined
): MfaStrategy | null {
  if (!factors?.length) return null;
  if (factors.some((f) => f.strategy === "email_code")) return "email_code";
  if (factors.some((f) => f.strategy === "phone_code")) return "phone_code";
  if (factors.some((f) => f.strategy === "totp")) return "totp";
  return null;
}

function mfaSubtitle(strategy: MfaStrategy | null): string {
  switch (strategy) {
    case "email_code":
      return "Un code a été envoyé à votre e-mail";
    case "phone_code":
      return "Un code a été envoyé par SMS";
    case "totp":
      return "Entrez le code de votre application d'authentification";
    default:
      return "Saisissez le code de vérification";
  }
}

export default function SignIn() {
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();
  const posthog = usePostHog();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [mfaStrategy, setMfaStrategy] = useState<MfaStrategy | null>(null);
  const [mfaCodeSent, setMfaCodeSent] = useState(false);

  useEffect(() => {
    if (isSignedIn) {
      router.replace("/(tabs)" as Href);
    }
  }, [isSignedIn, router]);

  if (!authLoaded) {
    return <LoadingScreen />;
  }

  const emailValid =
    emailAddress.length === 0 ||
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress);
  const passwordValid = password.length > 0;
  const formValid =
    emailAddress.length > 0 && password.length > 0 && emailValid;

  const needsMfaStep =
    signIn.status === "needs_second_factor" ||
    signIn.status === "needs_client_trust";

  const finalizeSignIn = async () => {
    await signIn.finalize({
      navigate: ({ session, decorateUrl }) => {
        if (session?.currentTask) {
          setApiError(
            "Une action est requise sur votre compte Clerk avant de continuer."
          );
          return;
        }
        const userId = session?.user?.id;
        const email = session?.user?.primaryEmailAddress?.emailAddress;
        if (userId) {
          posthog.identify(userId, { $set: { email } });
        }
        posthog.capture("user_signed_in", { email });
        router.replace(decorateUrl("/(tabs)") as Href);
      },
    });
  };

  const startMfaVerification = async (): Promise<boolean> => {
    const strategy =
      pickMfaStrategy(signIn.supportedSecondFactors) ??
      (signIn.status === "needs_client_trust" ? "email_code" : null);

    if (!strategy) {
      setApiError(
        "Vérification requise, mais aucune méthode (e-mail, SMS, app) n'est disponible dans Clerk."
      );
      return false;
    }

    setMfaStrategy(strategy);

    if (strategy === "email_code") {
      const { error } = await signIn.mfa.sendEmailCode();
      if (error) {
        setApiError(getClerkErrorMessage(error));
        return false;
      }
      setMfaCodeSent(true);
      return true;
    }

    if (strategy === "phone_code") {
      const { error } = await signIn.mfa.sendPhoneCode();
      if (error) {
        setApiError(getClerkErrorMessage(error));
        return false;
      }
      setMfaCodeSent(true);
      return true;
    }

    setMfaCodeSent(true);
    return true;
  };

  const handleSubmit = async () => {
    if (!formValid) return;
    setApiError(null);

    try {
      const { error } = await signIn.password({ emailAddress, password });

      if (error) {
        const message = getClerkErrorMessage(error);
        setApiError(message);
        posthog.capture("sign_in_failed", { error_message: message });
        return;
      }

      if (signIn.status === "complete") {
        await finalizeSignIn();
        return;
      }

      if (
        signIn.status === "needs_second_factor" ||
        signIn.status === "needs_client_trust"
      ) {
        await startMfaVerification();
        return;
      }

      if (signIn.status === "needs_first_factor") {
        setApiError(
          "Une vérification supplémentaire est requise. Consultez votre e-mail."
        );
        return;
      }

      const hookError = errors.global?.[0];
      if (hookError) {
        setApiError(hookError.longMessage ?? hookError.message);
        return;
      }

      setApiError(
        `Connexion incomplète (${signIn.status ?? "inconnu"}). Réessayez ou contactez le support.`
      );
    } catch (e) {
      setApiError(getClerkErrorMessage(e));
    }
  };

  const handleVerify = async () => {
    setApiError(null);
    const strategy =
      mfaStrategy ??
      pickMfaStrategy(signIn.supportedSecondFactors) ??
      "email_code";

    try {
      let error: unknown;
      if (strategy === "email_code") {
        ({ error } = await signIn.mfa.verifyEmailCode({ code }));
      } else if (strategy === "phone_code") {
        ({ error } = await signIn.mfa.verifyPhoneCode({ code }));
      } else {
        ({ error } = await signIn.mfa.verifyTOTP({ code }));
      }

      if (error) {
        setApiError(getClerkErrorMessage(error));
        return;
      }

      if (signIn.status === "complete") {
        await finalizeSignIn();
      } else {
        setApiError("Code invalide ou expiré. Réessayez.");
      }
    } catch (e) {
      setApiError(getClerkErrorMessage(e));
    }
  };

  const handleResendCode = async () => {
    setApiError(null);
    const strategy = mfaStrategy ?? pickMfaStrategy(signIn.supportedSecondFactors);
    if (strategy === "phone_code") {
      const { error } = await signIn.mfa.sendPhoneCode();
      if (error) setApiError(getClerkErrorMessage(error));
      return;
    }
    const { error } = await signIn.mfa.sendEmailCode();
    if (error) setApiError(getClerkErrorMessage(error));
  };

  if (needsMfaStep) {
    return (
      <AuthScreen>
        <AuthBranding
          title="Vérifiez votre identité"
          subtitle={mfaSubtitle(mfaStrategy)}
        />
        <View className="auth-form">
          {apiError ? (
            <Text className="mb-2 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
              {apiError}
            </Text>
          ) : !mfaCodeSent ? (
            <Pressable
              className="auth-button mb-2"
              disabled={fetchStatus === "fetching"}
              onPress={() => void startMfaVerification()}
            >
              <Text className="auth-button-text">
                {fetchStatus === "fetching"
                  ? "Envoi…"
                  : "Recevoir le code de vérification"}
              </Text>
            </Pressable>
          ) : null}
          <Text className="auth-label">Code de vérification</Text>
          <TextInput
            className="auth-input"
            value={code}
            onChangeText={setCode}
            keyboardType="numeric"
            placeholder={mfaStrategy === "totp" ? "000000" : "123456"}
            placeholderTextColor="rgba(0,0,0,0.4)"
          />
          {errors.fields.code ? (
            <Text className="auth-error">{errors.fields.code.message}</Text>
          ) : null}
          <Pressable
            className="auth-button"
            disabled={fetchStatus === "fetching" || !code}
            onPress={handleVerify}
          >
            <Text className="auth-button-text">
              {fetchStatus === "fetching" ? "Vérification…" : "Vérifier"}
            </Text>
          </Pressable>
          {mfaStrategy !== "totp" ? (
            <Pressable onPress={handleResendCode}>
              <Text className="text-center font-sans-semibold text-accent">
                Renvoyer le code
              </Text>
            </Pressable>
          ) : null}
        </View>
      </AuthScreen>
    );
  }

  return (
    <AuthScreen>
      <AuthBranding
        title="Bon retour"
        subtitle={
          isSignedIn
            ? "Vous êtes déjà connecté, redirection…"
            : "Utilisez le même e-mail et mot de passe que lors de l'inscription"
        }
      />
      <View className="auth-form">
        {apiError ? (
          <Text className="mb-2 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
            {apiError}
          </Text>
        ) : (
          <Text className="mb-2 font-sans-regular text-xs text-muted-foreground">
            E-mail déjà enregistré ? Utilisez le mot de passe choisi à
            l&apos;inscription. En cas d&apos;échec répété, attendez ~10 min
            (limite Clerk).
          </Text>
        )}
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
        {errors.fields.identifier ? (
          <Text className="auth-error">
            {errors.fields.identifier.message}
          </Text>
        ) : null}

        <Text className="auth-label">Mot de passe</Text>
        <TextInput
          className="auth-input"
          value={password}
          onChangeText={setPassword}
          onBlur={() => setPasswordTouched(true)}
          secureTextEntry
          autoComplete="password"
          placeholder="••••••••"
          placeholderTextColor="rgba(0,0,0,0.4)"
        />
        {passwordTouched && !passwordValid ? (
          <Text className="auth-error">Mot de passe requis</Text>
        ) : null}
        {errors.fields.password ? (
          <Text className="auth-error">{errors.fields.password.message}</Text>
        ) : null}

        <Pressable
          className={`auth-button ${!formValid || fetchStatus === "fetching" ? "auth-button-disabled" : ""}`}
          disabled={!formValid || fetchStatus === "fetching"}
          onPress={handleSubmit}
        >
          <Text className="auth-button-text">
            {fetchStatus === "fetching" ? "Connexion…" : "Se connecter"}
          </Text>
        </Pressable>
      </View>

      <View className="auth-link-row">
        <Text className="font-sans-regular text-muted-foreground">
          Pas de compte ?
        </Text>
        <Link href="/(auth)/sign-up" className="font-sans-semibold text-accent">
          Créer un compte
        </Link>
      </View>

      <View nativeID="clerk-captcha" />
    </AuthScreen>
  );
}
