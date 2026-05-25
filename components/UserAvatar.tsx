import { Image, type ImageProps } from "react-native";

import InitialsAvatar from "@/components/InitialsAvatar";
import { getUserAvatarUri, type ClerkUserWithImage } from "@/lib/profile-image";
import { getUserInitials } from "@/lib/user-display";

type Props = {
  user:
    | (ClerkUserWithImage & {
        firstName?: string | null;
        lastName?: string | null;
        primaryEmailAddress?: { emailAddress?: string } | null;
      })
    | null
    | undefined;
  className?: string;
} & Omit<ImageProps, "source">;

export default function UserAvatar({ user, className, ...rest }: Props) {
  const uri = getUserAvatarUri(user);

  if (uri) {
    return (
      <Image
        source={{ uri }}
        className={className}
        {...rest}
      />
    );
  }

  return (
    <InitialsAvatar
      initials={getUserInitials(user)}
      className={className}
    />
  );
}
