import { useState } from "react";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";
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
import { Category } from "@/models/Category";
import { CategoryBadge } from "@/components/CategoryBadge";
import { Badge } from "./ui/badge";

interface CategoryComboboxProps {
  value?: string;
  categories: Category[];
  onChange: (value: string) => void;
  placeholder?: string;
  emptyText?: string;
  showUncategorized?: boolean;
  extraOption?: {
    label: string;
    value: string;
  };
}

export function CategoryCombobox({
  value,
  categories,
  onChange,
  placeholder = "Selecione uma categoria",
  emptyText = "Nenhuma categoria encontrada.",
  showUncategorized = true,
  extraOption,
}: CategoryComboboxProps) {
  const [open, setOpen] = useState(false);

  const selectedCategory = categories.find((c) => c.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-9 px-3 font-normal"
        >
          {selectedCategory ? (
            <CategoryBadge category={selectedCategory} />
          ) : extraOption && value === extraOption.value ? (
            <span className="truncate">{extraOption.label}</span>
          ) : value === "uncategorized" || (!value && showUncategorized) ? (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-muted-foreground border-dashed">Sem categoria</Badge>
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Buscar categoria..." />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            {extraOption && (
              <CommandGroup>
                <CommandItem
                  value={extraOption.value}
                  keywords={[extraOption.label]}
                  onSelect={() => {
                    onChange(extraOption.value);
                    setOpen(false);
                  }}
                >
                  <div
                    className={cn(
                      "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                      value === extraOption.value
                        ? "bg-primary text-primary-foreground"
                        : "opacity-50 [&_svg]:invisible"
                    )}
                  >
                    <Check className={cn("h-4 w-4")} />
                  </div>
                  <span className="font-medium text-primary">{extraOption.label}</span>
                </CommandItem>
              </CommandGroup>
            )}

            <CommandGroup>
              {showUncategorized && (
                <CommandItem
                  value="uncategorized"
                  keywords={["sem categoria", "nenhuma"]}
                  onSelect={() => {
                    onChange("uncategorized");
                    setOpen(false);
                  }}
                >
                  <div
                    className={cn(
                      "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                      value === "uncategorized" || (!value && showUncategorized)
                        ? "bg-primary text-primary-foreground"
                        : "opacity-50 [&_svg]:invisible"
                    )}
                  >
                    <Check className={cn("h-4 w-4")} />
                  </div>
                  <span>Sem categoria</span>
                </CommandItem>
              )}

              {categories.map((category) => (
                <CommandItem
                  key={category.id}
                  value={category.name} // Command uses value for search filtering by default
                  keywords={[category.name]}
                  onSelect={() => {
                    onChange(category.id);
                    setOpen(false);
                  }}
                >
                  <div
                    className={cn(
                      "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                      value === category.id
                        ? "bg-primary text-primary-foreground"
                        : "opacity-50 [&_svg]:invisible"
                    )}
                  >
                    <Check className={cn("h-4 w-4")} />
                  </div>
                  <CategoryBadge category={category} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
