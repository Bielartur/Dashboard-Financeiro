
export const formatPeriodLabel = (year: string, style: 'of' | 'in' | 'paren' | 'default' = 'default'): string => {
  const isLast12 = year === 'last-12';

  switch (style) {
    case 'of': // "de" / "dos"
      return isLast12 ? 'dos Últimos 12 meses' : `de ${year}`;
    case 'in': // "em" / "nos"
      return isLast12 ? 'nos Últimos 12 meses' : `em ${year}`;
    case 'paren': // Context: Specific headers mixing "de Year" with "(Last 12)"
      return isLast12 ? '(Últimos 12 meses)' : `de ${year}`;
    default:
      return isLast12 ? 'Últimos 12 meses' : year;
  }
};

export const calculateYearForMonth = (selectedYear: string, monthIndex: number): string => {
  if (selectedYear !== 'last-12') return selectedYear;

  const today = new Date();
  const currentMonthIndex = today.getMonth();
  const diff = 11 - monthIndex;
  const date = new Date(today.getFullYear(), currentMonthIndex - diff, 1);
  return date.getFullYear().toString();
};
