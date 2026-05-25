import { Text, View, type ViewProps } from "react-native";

type Props = ViewProps & {
  initials: string;
  className?: string;
};

export default function InitialsAvatar({ initials, className, ...rest }: Props) {
  return (
    <View
      className={`items-center justify-center rounded-full bg-[#6C47FF] ${className ?? ""}`}
      {...rest}
    >
      <Text className="font-sans-bold text-lg text-white">{initials}</Text>
    </View>
  );
}
