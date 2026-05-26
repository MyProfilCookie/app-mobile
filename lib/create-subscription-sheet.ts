/** Espace visible au-dessus du panneau : padding + profil + carte orange. */
const HOME_SCREEN_PADDING = 20;
const HOME_HEADER_BLOCK = 64 + 10;
const HOME_BALANCE_CARD_BLOCK = 200 + 20;

export const CREATE_SUBSCRIPTION_SHEET_TOP_OFFSET =
  HOME_SCREEN_PADDING + HOME_HEADER_BLOCK + HOME_BALANCE_CARD_BLOCK;

/** Hauteur max. du sheet : sous la carte orange, sans couvrir le haut de l’accueil. */
export function getCreateSubscriptionSheetHeight(
  windowHeight: number,
  topInset: number
): number {
  return windowHeight - topInset - CREATE_SUBSCRIPTION_SHEET_TOP_OFFSET;
}
