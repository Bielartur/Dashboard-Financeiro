import { useState } from "react";
import { Check, ChevronsUpDown, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface MonthOption {
  month: string;
  year: number;
  index: number;
}

interface MonthComboboxProps {
  selectedMonth: number | null;
  months: { month: string; year: number }[];
  onSelectMonth: (index: number) => void;
  disabled?: boolean;
}

export function MonthCombobox({
  selectedMonth,
  months,
  onSelectMonth,
  disabled = false,
}: MonthComboboxProps) {
  const [open, setOpen] = useState(false);

  // Convert selectedMonth to string for comparison, but handle null/-1 logic
  // If selectedMonth is -1 or null, it's "Relatório Anual"
  // If selectedMonth is >= 0, it's an index.

  const isAnnual = selectedMonth === -1 || selectedMonth === null;

  const selectedLabel = isAnnual
    ? "Relatório Anual"
    : months[selectedMonth!]?.month || "Selecione o mês";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="min-w-[140px] justify-between h-9 px-3 font-normal"
        >
          <div className="flex items-center gap-2">
            {!isAnnual && <Calendar className="h-4 w-4 text-muted-foreground" />}
            <span className={cn(isAnnual ? "font-semibold text-primary" : "")}>
              {selectedLabel}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Buscar mês..." />
          <CommandList>
            <CommandEmpty>Mês não encontrado.</CommandEmpty>

            <CommandGroup>
              <CommandItem
                value="Relatório Anual"
                onSelect={() => {
                  onSelectMonth(-1);
                  setOpen(false);
                }}
              >
                <div
                  className={cn(
                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                    isAnnual
                      ? "bg-primary text-primary-foreground"
                      : "opacity-50 [&_svg]:invisible"
                  )}
                >
                  <Check className={cn("h-4 w-4")} />
                </div>
                <span className="font-semibold text-primary">Relatório Anual</span>
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Meses disponíveis">
              {months.map((month, index) => (
                <CommandItem
                  key={`${month.month}-${month.year}-${index}`}
                  value={`${month.month} ${month.year}`} // Combining for search
                  onSelect={() => {
                    onSelectMonth(index);
                    setOpen(false);
                  }}
                >
                  <div
                    className={cn(
                      "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                      (!isAnnual && selectedMonth === index)
                        ? "bg-primary text-primary-foreground"
                        : "opacity-50 [&_svg]:invisible"
                    )}
                  >
                    <Check className={cn("h-4 w-4")} />
                  </div>
                  <span>{month.month}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
