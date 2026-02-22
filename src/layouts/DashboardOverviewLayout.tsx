import { useState, useMemo, useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDashboard } from '@/hooks/use-dashboard';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingBag, Store, Landmark, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardResponse } from '@/models/Financial';
import { ListSummaryCards } from '@/components/dashboard/ListSummaryCards';

export interface DashboardContextType {
  dashboardData: DashboardResponse | null;
  monthsData: DashboardResponse['months'];
  currentMonthData: DashboardResponse['months'][0] | null;
  selectedMonth: number | null;
  selectedYear: string;
  selectedMetrics: string[];
  groupBy: 'category' | 'merchant' | 'bank';
  viewType: 'expense' | 'income';
  isLoading: boolean;
  onSelectMonth: (index: number | null) => void;
  onSelectYear: (year: string) => void;
  onSelectMetrics: (metrics: string[]) => void;
  onSetViewType: (type: 'expense' | 'income') => void;
}

export default function DashboardOverviewLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // State
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>("last-12");
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [viewType, setViewType] = useState<'expense' | 'income'>('expense');

  // Determine groupBy from URL
  const groupBy = useMemo(() => {
    const path = location.pathname;
    if (path.includes('/banks')) return 'bank';
    if (path.includes('/merchants')) return 'merchant';
    return 'category'; // default
  }, [location.pathname]);

  // Data Fetching
  const {
    data: dashboardData,
    isLoading,
    error,
    refresh,
    getAvailableMonths
  } = useDashboard(selectedYear, groupBy);

  const [availableMonthsList, setAvailableMonthsList] = useState<{ year: number, month: number, label: string }[]>([]);

  useEffect(() => {
    getAvailableMonths().then(data => {
      setAvailableMonthsList(data);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const monthsData = useMemo(() => dashboardData?.months || [], [dashboardData]);

  // Ref to track if grouping changed to trigger auto-selection
  const didGroupChange = useRef(false);

  // Update selected month when data or year changes
  useEffect(() => {
    if (monthsData.length > 0) {
      if (selectedMonth === null || selectedMonth >= monthsData.length) {
        setSelectedMonth(monthsData.length - 1);
      }
    } else {
      setSelectedMonth(null);
    }
  }, [monthsData.length, selectedYear]);

  // Handle auto-selection of metrics when groupBy or viewType changes
  useEffect(() => {
    // Reset selection immediately when group or view type changes
    setSelectedMetrics([]);
    didGroupChange.current = true;
  }, [groupBy, viewType]);

  // Apply auto-selection when data is available and group changed
  useEffect(() => {
    if (didGroupChange.current && !isLoading && monthsData.length > 0) {
      // Calculate total value per metric (category/merchant/bank) across all months
      const metricTotals = new Map<string, number>();

      monthsData.forEach(month => {
        month.metrics.forEach(metric => {
          if (metric.type === viewType) {
            // Use Math.abs to ensure positive values for ranking
            const currentTotal = metricTotals.get(metric.id) || 0;
            metricTotals.set(metric.id, currentTotal + Math.abs(metric.total));
          }
        });
      });

      // Sort by total descending and take top 2
      const top2Metrics = Array.from(metricTotals.entries())
        .sort((a, b) => b[1] - a[1]) // Descending order
        .slice(0, 2)
        .map(entry => entry[0]);

      if (top2Metrics.length > 0) {
        setSelectedMetrics(top2Metrics);
      }

      didGroupChange.current = false;
    }
  }, [monthsData, isLoading, viewType]);

  const currentMonthData = useMemo(() =>
    (selectedMonth !== null && monthsData[selectedMonth]) ? monthsData[selectedMonth] : null
    , [selectedMonth, monthsData]);

  const currentSummary = dashboardData?.summary || {
    totalRevenue: 0,
    totalExpenses: 0,
    totalInvestments: 0,
    balance: 0
  };

  const displayData = useMemo(() => currentMonthData ? {
    revenue: currentMonthData.revenue,
    expenses: currentMonthData.expenses,
    investments: currentMonthData.investments,
    balance: currentMonthData.balance
  } : {
    revenue: currentSummary.totalRevenue,
    expenses: currentSummary.totalExpenses,
    investments: currentSummary.totalInvestments || 0,
    balance: currentSummary.balance
  }, [currentMonthData, currentSummary]);

  const availableYears = useMemo(() => {
    return Array.from(new Set(availableMonthsList.map(m => m.year))).filter(y => y).sort((a, b) => b - a);
  }, [availableMonthsList]);

  const dataRangeLabel = useMemo(() => {
    if (monthsData.length > 0) {
      const first = monthsData[0];
      const last = monthsData[monthsData.length - 1];
      if (first.year === last.year) {
        return `Dados de ${first.year}`;
      } else {
        return `${first.monthShort}/${first.year} - ${last.monthShort}/${last.year}`;
      }
    }
    return "";
  }, [monthsData]);

  // Handle Tab Change (Navigation)
  const handleTabChange = (value: string) => {
    if (value === 'category') navigate('/categories');
    if (value === 'merchant') navigate('/merchants');
    if (value === 'bank') navigate('/banks');
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-6 w-6" />
          <span className="text-lg font-medium">{error || "Não foi possível carregar os dados"}</span>
        </div>
        <Button onClick={refresh} variant="outline" isLoading={isLoading}>Tentar Novamente</Button>
      </div>
    );
  }

  const contextValue: DashboardContextType = {
    dashboardData,
    monthsData,
    currentMonthData,
    selectedMonth,
    selectedYear,
    selectedMetrics,
    groupBy,
    viewType,
    isLoading,
    onSelectMonth: setSelectedMonth,
    onSelectYear: setSelectedYear,
    onSelectMetrics: setSelectedMetrics,
    onSetViewType: setViewType
  };


  return (
    <div className="space-y-8 animate-fade-in relative z-10 w-full overflow-hidden">
      {/* Header */}
      <DashboardHeader
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        onSelectYear={setSelectedYear}
        onSelectMonth={(idx) => setSelectedMonth(idx === -1 ? null : idx)}
        monthsWithData={monthsData.map(m => ({ month: m.month, year: m.year }))}
        availableYears={availableYears}
        dataRangeLabel={dataRangeLabel}
      />

      {/* Grouping Control (Navigation) */}
      <div className="-mt-2 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <Tabs value={groupBy} onValueChange={handleTabChange} className="w-full sm:w-[400px]">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="category" className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Categorias</span>
            </TabsTrigger>
            <TabsTrigger value="merchant" className="flex items-center gap-2">
              <Store className="w-4 h-4" />
              <span className="hidden sm:inline">Lojas</span>
            </TabsTrigger>
            <TabsTrigger value="bank" className="flex items-center gap-2">
              <Landmark className="w-4 h-4" />
              <span className="hidden sm:inline">Bancos</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* View Type Toggle (Expenses / Income) */}
        <div className="flex items-center bg-muted/50 p-1 rounded-lg border border-border/50">
          <button
            onClick={() => setViewType('expense')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${viewType === 'expense'
              ? 'bg-destructive/10 text-destructive shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            Despesas
          </button>
          <button
            onClick={() => setViewType('income')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${viewType === 'income'
              ? 'bg-emerald-500/10 text-emerald-500 shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            Receitas
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <ListSummaryCards
        selectedMonth={selectedMonth}
        currentMonthData={currentMonthData}
        displayData={displayData}
        isLoading={isLoading}
      />

      {/* Child Content */}
      {isLoading ? (
        <div className="flex h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <Outlet context={contextValue} />
      )}

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-border/30 text-center">
        <p className="text-sm text-muted-foreground">
          Dashboard Financeiro • Controle de Finanças Pessoais {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
