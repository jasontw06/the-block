const cadCurrency = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
  maximumFractionDigits: 0,
});

const compactNumber = new Intl.NumberFormat("en-CA");

export function formatCurrency(amount: number): string {
  return cadCurrency.format(amount);
}

export function formatOdometer(km: number): string {
  return `${compactNumber.format(km)} km`;
}

export function formatConditionGrade(grade: number): string {
  return grade.toFixed(1);
}
