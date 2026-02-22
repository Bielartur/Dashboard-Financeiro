import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRequests } from "@/hooks/use-requests";
import { Category, CategorySettingsUpdate } from "@/models/Category";
import { PaginationControl } from "@/components/shared/PaginationControl";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// Removed Input import as it is now inside DebouncedSearchInput
import { Pencil, Loader2 } from "lucide-react";
import { EditCategoryModal } from "@/components/admin/EditCategoryModal";
import { toast } from "sonner";
import { DebouncedSearchInput } from "@/components/shared/DebouncedSearchInput";
import { BooleanLabel } from "../shared/BooleanLabel";

export function CategorySettingsTable() {
  const api = useRequests();
  const queryClient = useQueryClient();
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [scope, setScope] = useState<"general" | "investment" | "ignored">("general");

  // Reset page when search or scope changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery, scope]);

  const { data, isLoading } = useQuery({
    queryKey: ["categories", searchQuery, page, scope],
    queryFn: () => api.searchCategories(searchQuery, page, 10, scope),
    placeholderData: (previousData) => previousData,
  });

  const categories = data?.items || [];
  const totalPages = data?.pages || 1;

  const handleSave = async (id: string, data: CategorySettingsUpdate) => {
    try {
      await api.updateCategorySettings(id, data);
      toast.success("Preferências atualizadas");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      // Invalidate dashboard too
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    } catch (error) {
      console.error("Erro ao atualizar categoria:", error);
      toast.error("Erro ao atualizar preferências");
    }
  };

  return (
    <div className="space-y-4">
      {/* <span className="text-foreground font-semibold">Tipos de categorias</span> */}

      <div className="relative">
        <DebouncedSearchInput
          placeholder="Buscar categorias..."
          value={searchQuery}
          onChange={setSearchQuery}
          className="w-full"
        />
      </div>
      
      <Tabs defaultValue="general" value={scope} onValueChange={(v) => setScope(v as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">Gerais</TabsTrigger>
          <TabsTrigger value="investment">Investimentos</TabsTrigger>
          <TabsTrigger value="ignored">Ignoradas no Dashboard</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="rounded-md border h-[60vh] overflow-y-auto relative flex flex-col justify-between">
        <Table>
          <TableHeader className="sticky top-0 bg-secondary z-10 shadow-sm">
            <TableRow className="hover:bg-secondary">
              <TableHead>Cor</TableHead>
              <TableHead>Nome Original</TableHead>
              <TableHead>Apelido (Seu)</TableHead>
              <TableHead className="text-center w-[100px]">Investimento?</TableHead>
              <TableHead className="text-center w-[100px]">Ignorado?</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-[52vh] text-center">
                  <div className="flex justify-center items-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                </TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-[52vh] text-center">
                  Nenhuma categoria encontrada.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <div
                      className="w-6 h-6 rounded-full border"
                      style={{ backgroundColor: category.colorHex }}
                    />
                  </TableCell>
                  <TableCell className="font-medium text-muted-foreground">{category.name}</TableCell>
                  <TableCell className="font-medium">
                    {category.alias ? (
                      <span>{category.alias}</span>
                    ) : (
                      <span className="italic text-muted-foreground opacity-50">Sem apelido</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <BooleanLabel check={category.isInvestment} />
                  </TableCell>
                  <TableCell className="text-center">
                    <BooleanLabel check={category.ignored} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setCategoryToEdit(category)}
                      title="Personalizar"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <PaginationControl
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <EditCategoryModal
        category={categoryToEdit}
        isOpen={!!categoryToEdit}
        onClose={() => setCategoryToEdit(null)}
        onSave={handleSave}
        mode="personal"
      />
    </div>
  );
}
