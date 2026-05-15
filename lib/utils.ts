import dayjs from "dayjs";
import relativeTimePlugin from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTimePlugin);
export const formatCurrency = (
  value: number | string,
  currency: string = "EUR"
): string => {
  try {
    const numericValue = typeof value === "string" ? parseFloat(value) : value;

    if (isNaN(numericValue)) {
      throw new Error("Invalid number");
    }

    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericValue);
  } catch (error) {
    // Fallback if there's an error formatting
    const symbol = currency === "EUR" ? "€" : currency === "USD" ? "$" : currency;
    return `${symbol}0.00`;
  }
};
export const formatSubscriptionDateTime = (
    dateOrString: Date | string | undefined,
    format: string = 'DD MMM',
    fallback: string = 'N/A'
): string => {
    if (!dateOrString) return fallback

    // If it's a string, try to create a date from it
    if (typeof dateOrString === 'string') {
        // Create a date from the string. dayjs handles many formats, but for robustness
        // you might want to ensure it's ISO if you control the input. Here we try dayjs first.
        return dayjs(dateOrString).format(format)
    }

    // If it's already a Date object
    return dayjs(dateOrString).format(format)
}

export const relativeTime = (dateOrString: Date | string): string => {
    return dayjs(dateOrString).fromNow();
}
  
