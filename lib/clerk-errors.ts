type ClerkApiError = {
  clerkError?: boolean;
  status?: number;
  retryAfter?: number;
  errors?: { code?: string; message?: string; longMessage?: string }[];
};

export function getClerkErrorMessage(error: unknown): string {
  const err = error as ClerkApiError;

  if (err.status === 429 || err.errors?.[0]?.code === "too_many_requests") {
    const seconds = err.retryAfter ?? 600;
    const minutes = Math.max(1, Math.ceil(seconds / 60));
    return `Trop de tentatives. Attendez ${minutes} min avant de réessayer, ou créez un compte via « Créer un compte » si vous n'en avez pas encore.`;
  }

  const code = err.errors?.[0]?.code;
  const message = err.errors?.[0]?.message ?? "";

  if (
    code === "form_identifier_exists" ||
    message.toLowerCase().includes("email address is taken")
  ) {
    return "Cet e-mail a déjà un compte. Utilisez « Se connecter » en bas de page.";
  }
  if (code === "form_identifier_not_found") {
    return "Aucun compte avec cet e-mail. Utilisez « Créer un compte » d'abord.";
  }
  if (code === "form_password_incorrect") {
    return "Mot de passe incorrect.";
  }

  return (
    err.errors?.[0]?.longMessage ??
    err.errors?.[0]?.message ??
    "Connexion impossible. Vérifiez votre e-mail et mot de passe."
  );
}
