/** Nom affiché : prénom + nom Clerk, sinon fullName, sinon e-mail. */
export function getClerkUserDisplayName(
  user:
    | {
        firstName?: string | null;
        lastName?: string | null;
        fullName?: string | null;
        primaryEmailAddress?: { emailAddress?: string } | null;
      }
    | null
    | undefined
): string {
  const first = user?.firstName?.trim();
  const last = user?.lastName?.trim();

  if (first && last) return `${first} ${last}`;
  if (first) return first;
  if (last) return last;

  const full = user?.fullName?.trim();
  if (full) return full;

  return user?.primaryEmailAddress?.emailAddress ?? "Utilisateur";
}

/** Initiales pour l’avatar (ex. Virginie Ayivor → VA). */
export function getUserInitials(
  user:
    | {
        firstName?: string | null;
        lastName?: string | null;
        primaryEmailAddress?: { emailAddress?: string } | null;
      }
    | null
    | undefined
): string {
  const first = user?.firstName?.trim();
  const last = user?.lastName?.trim();
  if (first && last) {
    return `${first[0]}${last[0]}`.toUpperCase();
  }
  if (first) return first.slice(0, 2).toUpperCase();
  if (last) return last.slice(0, 2).toUpperCase();
  const email = user?.primaryEmailAddress?.emailAddress;
  if (email) return email[0].toUpperCase();
  return "?";
}
