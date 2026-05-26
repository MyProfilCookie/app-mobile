import { Text, View } from "react-native";

export default function AuthBranding({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <View className="auth-branding">
      <View className="auth-logo-row">
        <View className="auth-logo-badge">
          <Text className="auth-logo-letter">R</Text>
        </View>
        <View>
          <Text className="auth-logo-title">Recurrly</Text>
          <Text className="auth-logo-subtitle">SUBSCRIPTIONS</Text>
        </View>
      </View>
      <Text className="auth-heading">{title}</Text>
      <Text className="auth-subheading">{subtitle}</Text>
    </View>
  );
}
