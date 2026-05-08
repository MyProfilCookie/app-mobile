export const formatCurrency = (
  value: number | string,
  currency: string = "EUR"
): string => {
  try {
    const numericValue = typeof value === "string" ? parseFloat(value) : value;

    if (isNaN(numericValue)) {
      throw new Error("Invalid number");
    }

    return new Intl.NumberFormat("en-US", {
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
