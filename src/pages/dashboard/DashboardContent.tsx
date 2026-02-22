import { useOutletContext } from 'react-router-dom';
import { RevenueExpenseChart } from '@/components/dashboard/RevenueExpenseChart';
import { MonthlyMetricChart } from '@/components/dashboard/MonthlyMetricChart';
import { MetricEvolutionChart } from '@/components/dashboard/MetricEvolutionChart';
import { MetricDonutChart } from '@/components/dashboard/MetricDonutChart';
import { MetricTable } from '@/components/dashboard/MetricTable';
import { DashboardContextType } from '@/layouts/DashboardOverviewLayout';

export default function DashboardContent() {
  const {
    monthsData,
    selectedMonth,
    selectedYear,
    selectedMetrics,
    onSelectMonth,
    onSelectMetrics,
    groupBy,
    viewType
  } = useOutletContext<DashboardContextType>();

  return (
    <div className="space-y-6">
      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueExpenseChart data={monthsData} />
        <MetricDonutChart
          selectedMonth={selectedMonth}
          data={monthsData}
          type={groupBy}
          metricType={viewType}
        />
      </div>

      {/* Charts Row 2 */}
      <MonthlyMetricChart
        selectedMonth={selectedMonth}
        data={monthsData}
        selectedYear={selectedYear}
        onSelectMonth={onSelectMonth}
        type={groupBy}
        metricType={viewType}
      />

      {/* Category Annual Evolution */}
      <MetricEvolutionChart
        selectedMetrics={selectedMetrics}
        data={monthsData}
        selectedYear={selectedYear}
        onSelectMetrics={onSelectMetrics}
        type={groupBy}
        metricType={viewType}
      />

      {/* CategoryTable */}
      <MetricTable
        selectedMonth={selectedMonth}
        data={monthsData}
        selectedYear={selectedYear}
        type={groupBy}
        metricType={viewType}
      />
    </div>
  );
}
