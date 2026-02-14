import { Calendar as CalendarIcon, Filter } from "lucide-react";
import { ClearFilterButton } from "@/components/shared/ClearFilterButton";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TransactionMethodCombobox } from "@/components/shared/combobox/TransactionMethodCombobox";
import { CategoryCombobox } from "@/components/shared/combobox/CategoryCombobox";
import { BankCombobox } from "@/components/shared/combobox/BankCombobox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DebouncedSearchInput } from "@/components/shared/DebouncedSearchInput";
import { Category } from "@/models/Category";
import { Bank } from "@/models/Bank";
import { useRequests } from "@/hooks/use-requests";
import { useQuery } from "@tanstack/react-query";

export interface TransactionFiltersState {
  search: string;
  paymentMethod: string;
  categoryId: string;
  bankId: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  minAmount: string;
  maxAmount: string;
}

interface FilterTransactionsProps {
  filters: TransactionFiltersState;
  onFilterChange: (filters: Partial<TransactionFiltersState>) => void;
  clearFilters: () => void;
}

export function FilterTransactions({
  filters,
  onFilterChange,
  clearFilters,
}: FilterTransactionsProps) {
  const api = useRequests();

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: api.getCategories,
  });

  const { data: banks = [] } = useQuery<Bank[]>({
    queryKey: ["banks"],
    queryFn: api.getBanks,
  });

  const handleFilterChange = (key: keyof TransactionFiltersState, value: any) => {
    onFilterChange({ [key]: value });
  };

  const hasActiveFilters =
    filters.paymentMethod !== "all" ||
    filters.categoryId !== "all" ||
    filters.bankId !== "all" ||
    filters.startDate !== undefined ||
    filters.endDate !== undefined ||
    filters.minAmount !== "" ||
    filters.maxAmount !== "" ||
    filters.search !== "";

  return (
    <div className="bg-card border rounded-xl p-4 shadow-sm mb-6 space-y-4 animate-slide-up">
      <div className="flex items-center gap-2 mb-2">
        <Filter className="h-4 w-4 text-primary" />
        <h2 className="font-semibold text-sm">Filtros</h2>
        {hasActiveFilters && (
          <ClearFilterButton onClick={clearFilters} label="Limpar filtros" className="ml-auto" />
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 relative">
          <DebouncedSearchInput
            placeholder="Buscar por estabelecimento..."
            value={filters.search}
            onChange={(v) => handleFilterChange("search", v)}
          />
        </div>

        {/* Payment Method */}
        <TransactionMethodCombobox
          value={filters.paymentMethod}
          onChange={(v) => handleFilterChange("paymentMethod", v)}
          placeholder="Método"
          extraOption={{ label: "Todos os Métodos", value: "all" }}
        />

        {/* Category */}
        <CategoryCombobox
          categories={categories}
          value={filters.categoryId}
          onChange={(v) => handleFilterChange("categoryId", v)}
          placeholder="Categoria"
          extraOption={{ label: "Todas as Categorias", value: "all" }}
        />

        {/* Bank */}
        <BankCombobox
          banks={banks}
          value={filters.bankId}
          onChange={(v) => handleFilterChange("bankId", v)}
          placeholder="Banco"
          extraOption={{ label: "Todos os Bancos", value: "all" }}
        />

        {/* Date Range - Start */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "justify-start text-left font-normal",
                !filters.startDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.startDate ? format(filters.startDate, "dd/MM/yyyy") : <span>Data Início</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={filters.startDate}
              onSelect={(date) => handleFilterChange("startDate", date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Date Range - End */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "justify-start text-left font-normal",
                !filters.endDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.endDate ? format(filters.endDate, "dd/MM/yyyy") : <span>Data Fim</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={filters.endDate}
              onSelect={(date) => handleFilterChange("endDate", date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Min Amount */}
        <Input
          type="number"
          placeholder="Valor Mínimo"
          value={filters.minAmount}
          onChange={(e) => handleFilterChange("minAmount", e.target.value)}
        />

        {/* Max Amount */}
        <Input
          type="number"
          placeholder="Valor Máximo"
          value={filters.maxAmount}
          onChange={(e) => handleFilterChange("maxAmount", e.target.value)}
        />
      </div>
    </div>
  );
}