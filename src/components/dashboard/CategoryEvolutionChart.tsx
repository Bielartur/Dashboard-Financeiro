import { useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  categoryLabels,
  categoryColors,
  formatCurrency,
} from '@/data/financialData';
import { MonthlyData, CategoryData } from '@/models/Financial';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp } from 'lucide-react';

interface CategoryEvolutionChartProps {
  selectedCategory: keyof CategoryData | null;
  data: MonthlyData[];
  selectedYear: number;
  onSelectCategory: (category: keyof CategoryData | null) => void;
}

export function CategoryEvolutionChart({
  selectedCategory,
  data,
  selectedYear,
  onSelectCategory,
}: CategoryEvolutionChartProps) {
  const categories = Object.keys(categoryLabels) as Array<keyof CategoryData>;

  const chartData = useMemo(() => {
    if (!selectedCategory) return [];

    const currentYear = new Date().getFullYear();
    const currentMonthIndex = new Date().getMonth();

    // Map over all available months (assuming data has 12 months)
    return data.map((month, index) => {
      let value = month.categories[selectedCategory];

      // If viewing current year and month is in the future, set value to 0
      if (selectedYear === currentYear && index > currentMonthIndex) {
        value = 0;
      }
      // If viewing future year, set all to 0
      else if (selectedYear > currentYear) {
        value = 0;
      }

      return {
        name: month.monthShort,
        fullMonth: month.month,
        value: value,
      };
    });
  }, [selectedCategory, data, selectedYear]);

  return (
    <div className="glass-card rounded-xl p-6 animate-slide-up" style={{ animationDelay: '400ms' }}>
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <div>
          <span className="text-lg font-bold text-foreground mb-1">Evolução anual por categoria</span>
          <h3 className="text-sm font-medium text-muted-foreground">
            {selectedCategory ? `${categoryLabels[selectedCategory]} em ${selectedYear}` : `Selecione uma categoria`}
          </h3>
        </div>

        <div className="flex items-center gap-4">
          <Select
            value={selectedCategory || ""}
            onValueChange={(val) => onSelectCategory(val as keyof CategoryData)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione a categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {categoryLabels[category]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="h-[300px]">
        {selectedCategory ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} vertical={false} />
              <XAxis
                dataKey="name"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                cursor={{ fill: 'hsl(var(--muted)/0.1)' }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="glass-card rounded-lg p-3 border border-border/50 shadow-xl">
                        <p className="text-sm font-semibold text-foreground mb-1">{payload[0].payload.fullMonth}</p>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: payload[0].color }}
                          />
                          <span className="text-sm text-foreground">
                            {formatCurrency(payload[0].value as number)}
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="value"
                name={categoryLabels[selectedCategory]}
                fill={categoryColors[selectedCategory]}
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
            <div className="p-3 rounded-full bg-secondary/50">
              <TrendingUp className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground max-w-[300px]">
              Selecione uma categoria acima para visualizar a evolução.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
