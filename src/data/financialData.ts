import { MonthlyData, CategoryData } from '@/models/Financial';
export type { MonthlyData, CategoryData };

export const categoryLabels: Record<keyof CategoryData, string> = {
  alimentacao: 'Alimentação',
  apartamento: 'Apartamento',
  lazer: 'Lazer',
  outros: 'Outros',
  pagamentos: 'Pagamentos',
  restaurante: 'Restaurante',
  saude: 'Saúde',
  trabalho: 'Trabalho',
  transporte: 'Transporte',
  vestuario: 'Vestuário',
};

export const categoryColors: Record<keyof CategoryData, string> = {
  alimentacao: 'hsl(32, 95%, 55%)',
  apartamento: 'hsl(262, 83%, 58%)',
  lazer: 'hsl(330, 81%, 60%)',
  outros: 'hsl(215, 20%, 55%)',
  pagamentos: 'hsl(45, 93%, 47%)',
  restaurante: 'hsl(16, 85%, 55%)',
  saude: 'hsl(142, 76%, 36%)',
  trabalho: 'hsl(199, 89%, 48%)',
  transporte: 'hsl(280, 67%, 55%)',
  vestuario: 'hsl(350, 89%, 60%)',
};

const generateMonthlyData = (year: number, multiplier: number = 1): MonthlyData[] => {
  return [
    { month: 'Janeiro', monthShort: 'Jan', revenue: 12500 * multiplier, expenses: 8750 * multiplier, investments: 2000 * multiplier, categories: { alimentacao: 1200 * multiplier, apartamento: 2500, lazer: 450 * multiplier, outros: 380, pagamentos: 1200, restaurante: 850 * multiplier, saude: 350, trabalho: 280, transporte: 890, vestuario: 650 * multiplier } },
    { month: 'Fevereiro', monthShort: 'Fev', revenue: 12500 * multiplier, expenses: 9200 * multiplier, investments: 1800 * multiplier, categories: { alimentacao: 1150 * multiplier, apartamento: 2500, lazer: 680 * multiplier, outros: 420, pagamentos: 1350, restaurante: 920 * multiplier, saude: 280, trabalho: 320, transporte: 850, vestuario: 730 * multiplier } },
    { month: 'Março', monthShort: 'Mar', revenue: 13200 * multiplier, expenses: 8450 * multiplier, investments: 2500 * multiplier, categories: { alimentacao: 1180 * multiplier, apartamento: 2500, lazer: 380 * multiplier, outros: 290, pagamentos: 1100, restaurante: 780 * multiplier, saude: 450, trabalho: 250, transporte: 920, vestuario: 600 * multiplier } },
    { month: 'Abril', monthShort: 'Abr', revenue: 12500 * multiplier, expenses: 10200 * multiplier, investments: 1500 * multiplier, categories: { alimentacao: 1350 * multiplier, apartamento: 2500, lazer: 890 * multiplier, outros: 650, pagamentos: 1450, restaurante: 1100 * multiplier, saude: 380, trabalho: 350, transporte: 880, vestuario: 650 * multiplier } },
    { month: 'Maio', monthShort: 'Mai', revenue: 14500 * multiplier, expenses: 9100 * multiplier, investments: 3000 * multiplier, categories: { alimentacao: 1220 * multiplier, apartamento: 2500, lazer: 520 * multiplier, outros: 380, pagamentos: 1280, restaurante: 890 * multiplier, saude: 420, trabalho: 290, transporte: 950, vestuario: 650 * multiplier } },
    { month: 'Junho', monthShort: 'Jun', revenue: 12500 * multiplier, expenses: 8900 * multiplier, investments: 2200 * multiplier, categories: { alimentacao: 1190 * multiplier, apartamento: 2500, lazer: 450 * multiplier, outros: 320, pagamentos: 1150, restaurante: 850 * multiplier, saude: 380, trabalho: 280, transporte: 880, vestuario: 900 * multiplier } },
    { month: 'Julho', monthShort: 'Jul', revenue: 15800 * multiplier, expenses: 11500 * multiplier, investments: 2500 * multiplier, categories: { alimentacao: 1380 * multiplier, apartamento: 2500, lazer: 1200 * multiplier, outros: 580, pagamentos: 1650, restaurante: 1350 * multiplier, saude: 320, trabalho: 380, transporte: 1240, vestuario: 900 * multiplier } },
    { month: 'Agosto', monthShort: 'Ago', revenue: 12500 * multiplier, expenses: 8650 * multiplier, investments: 2000 * multiplier, categories: { alimentacao: 1150 * multiplier, apartamento: 2500, lazer: 420 * multiplier, outros: 350, pagamentos: 1180, restaurante: 820 * multiplier, saude: 450, trabalho: 260, transporte: 870, vestuario: 650 * multiplier } },
    { month: 'Setembro', monthShort: 'Set', revenue: 12500 * multiplier, expenses: 9350 * multiplier, investments: 1800 * multiplier, categories: { alimentacao: 1200 * multiplier, apartamento: 2500, lazer: 580 * multiplier, outros: 420, pagamentos: 1320, restaurante: 950 * multiplier, saude: 380, trabalho: 320, transporte: 930, vestuario: 750 * multiplier } },
    { month: 'Outubro', monthShort: 'Out', revenue: 13500 * multiplier, expenses: 9800 * multiplier, investments: 2200 * multiplier, categories: { alimentacao: 1280 * multiplier, apartamento: 2500, lazer: 650 * multiplier, outros: 480, pagamentos: 1380, restaurante: 1020 * multiplier, saude: 320, trabalho: 350, transporte: 920, vestuario: 900 * multiplier } },
    { month: 'Novembro', monthShort: 'Nov', revenue: 12500 * multiplier, expenses: 10800 * multiplier, investments: 1000 * multiplier, categories: { alimentacao: 1320 * multiplier, apartamento: 2500, lazer: 720 * multiplier, outros: 550, pagamentos: 1580, restaurante: 1150 * multiplier, saude: 380, trabalho: 380, transporte: 970, vestuario: 1250 * multiplier } },
    { month: 'Dezembro', monthShort: 'Dez', revenue: 18500 * multiplier, expenses: 14200 * multiplier, investments: 2000 * multiplier, categories: { alimentacao: 1650 * multiplier, apartamento: 2500, lazer: 1850 * multiplier, outros: 980, pagamentos: 2100, restaurante: 1680 * multiplier, saude: 350, trabalho: 420, transporte: 1120, vestuario: 1550 * multiplier } },
  ];
};

export const financialDataByYear: Record<number, MonthlyData[]> = {
  2024: generateMonthlyData(2024, 0.8), // Lower values for 2024
  2025: generateMonthlyData(2025, 0.9), // Slightly lower values for 2025
  2026: generateMonthlyData(2026, 1.0), // Current values (base)
};

// Default export can remain but pointing to current year or we handle in Index
export const financialData = financialDataByYear[2026]; // Backwards compatibility if needed

export const getAnnualTotals = (data: MonthlyData[] = financialData) => {
  const totals = data.reduce(
    (acc, month) => ({
      revenue: acc.revenue + month.revenue,
      expenses: acc.expenses + month.expenses,
      investments: acc.investments + month.investments,
    }),
    { revenue: 0, expenses: 0, investments: 0 }
  );

  return {
    ...totals,
    balance: totals.revenue - totals.expenses - totals.investments,
  };
};

export const getAnnualCategoryTotals = (data: MonthlyData[] = financialData): CategoryData => {
  return data.reduce(
    (acc, month) => {
      Object.keys(month.categories).forEach((key) => {
        const categoryKey = key as keyof CategoryData;
        acc[categoryKey] += month.categories[categoryKey];
      });
      return acc;
    },
    {
      alimentacao: 0,
      apartamento: 0,
      lazer: 0,
      outros: 0,
      pagamentos: 0,
      restaurante: 0,
      saude: 0,
      trabalho: 0,
      transporte: 0,
      vestuario: 0,
    }
  );
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatPercent = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
};
