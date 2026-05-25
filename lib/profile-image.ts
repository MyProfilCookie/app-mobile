import * as ImagePicker from "expo-image-picker";

export type ClerkUserWithImage = {
  imageUrl: string;
  hasImage: boolean | null;
};

type UserWithProfileImage = ClerkUserWithImage & {
  setProfileImage: (params: { file: string | null }) => Promise<unknown>;
  reload: () => Promise<unknown>;
};

/** Avatar Clerk par défaut (silhouette violette), pas une vraie photo. */
function isDefaultClerkAvatar(url: string): boolean {
  const lower = url.toLowerCase();
  return (
    lower.includes("default") ||
    lower.includes("initials") ||
    lower.includes("type=default")
  );
}

/** true si l’utilisateur a importé une vraie photo (Clerk). */
export function userHasCustomProfileImage(
  user: ClerkUserWithImage | null | undefined
): boolean {
  if (!user?.imageUrl) return false;
  if (user.hasImage === true) return true;
  return !isDefaultClerkAvatar(user.imageUrl);
}

/** Source distante uniquement quand une vraie photo existe. */
export function getUserAvatarUri(
  user: ClerkUserWithImage | null | undefined
): string | null {
  if (!user?.imageUrl) return null;
  if (userHasCustomProfileImage(user)) return user.imageUrl;
  return null;
}

export async function requestPhotoLibraryPermission(): Promise<boolean> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  return status === "granted";
}

/**
 * Ouvre la galerie (photo enregistrée depuis LinkedIn, etc.)
 * et l’envoie sur le compte Clerk.
 */
export async function pickAndUploadProfileImage(
  user: UserWithProfileImage
): Promise<{ ok: true } | { ok: false; message: string }> {
  const granted = await requestPhotoLibraryPermission();
  if (!granted) {
    return {
      ok: false,
      message: "Autorisez l’accès aux photos dans les réglages du téléphone.",
    };
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.85,
    base64: true,
  });

  if (result.canceled || !result.assets[0]?.base64) {
    return { ok: false, message: "Aucune image sélectionnée." };
  }

  const asset = result.assets[0];
  const mimeType = asset.mimeType ?? "image/jpeg";
  const dataUrl = `data:${mimeType};base64,${asset.base64}`;

  try {
    await user.setProfileImage({ file: dataUrl });
    await user.reload();
    return { ok: true };
  } catch (e) {
    const message =
      e instanceof Error
        ? e.message
        : "Impossible d’enregistrer la photo. Réessayez.";
    return { ok: false, message };
  }
}
