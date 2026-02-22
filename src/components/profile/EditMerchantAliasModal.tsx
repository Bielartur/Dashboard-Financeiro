import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRequests } from "@/hooks/use-requests";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, Trash2, Plus, Check, AlertTriangle } from "lucide-react";
import { DebouncedSearchInput } from "@/components/shared/DebouncedSearchInput";

import { CategoryCombobox } from "@/components/shared/combobox/CategoryCombobox";

interface EditMerchantAliasModalProps {
  isOpen: boolean;
  onClose: () => void;
  aliasId: string | null;
  categories: any[];
}

export function EditMerchantAliasModal({
  isOpen,
  onClose,
  aliasId,
  categories = [],
}: EditMerchantAliasModalProps) {
  const api = useRequests();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // Local state for editing form
  const [pattern, setPattern] = useState("");
  const [categoryId, setCategoryId] = useState<string>("all");
  const [isInvestment, setIsInvestment] = useState(false);
  const [ignored, setIgnored] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Confirmation Modal State
  const [isConfirmUpdateOpen, setIsConfirmUpdateOpen] = useState(false);

  // Fetch Alias Details
  const { data: alias, isLoading, refetch } = useQuery({
    queryKey: ["merchant-alias", aliasId],
    queryFn: () => (aliasId ? api.getMerchantAliasById(aliasId) : null),
    enabled: !!aliasId && isOpen,
  });

  // Search Merchants to Add
  const { data: searchResults = [] } = useQuery({
    queryKey: ["merchants-search", searchQuery],
    queryFn: () => api.searchMerchants(searchQuery),
    enabled: searchQuery.length > 0 && isOpen,
  });

  useEffect(() => {
    if (alias) {
      setPattern(alias.pattern);
      setCategoryId(alias.categoryId || "all");
      setIsInvestment(alias.isInvestment || false);
      setIgnored(alias.ignored || false);
    }
  }, [alias]);

  const handleInitialSave = () => {
    // If the category changed from what it was originally, ask about past transactions
    const originalCategoryId = alias?.categoryId || "all";
    if (categoryId !== originalCategoryId) {
      setIsConfirmUpdateOpen(true);
    } else {
      // Category didn't change, just save normally
      executeSave(false);
    }
  };

  const executeSave = async (updatePastTransactions: boolean) => {
    if (!aliasId) return;
    setIsSavingSettings(true);
    setIsConfirmUpdateOpen(false); // Close confirmation modal if open

    try {
      await api.updateMerchantAlias(aliasId, {
        pattern: pattern,
        category_id: categoryId === "all" ? null : categoryId,
        is_investment: isInvestment,
        ignored: ignored,
        update_past_transactions: updatePastTransactions,
      });
      toast.success("Configurações atualizadas com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["merchant-aliases"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] }); // Invalidate transactions in case they were updated
      await refetch();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar configurações.");
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleRemove = async (merchantId: string, merchantName: string) => {
    if (!aliasId) return;
    try {
      await api.removeMerchantFromAlias(aliasId, merchantId);
      toast.success(`${merchantName} removido do grupo.`);
      await refetch();
      queryClient.invalidateQueries({ queryKey: ["merchant-aliases"] });
    } catch (error) {
      toast.error("Erro ao remover item.");
    }
  };

  const handleAdd = async (merchantId: string, merchantName: string) => {
    if (!aliasId) return;
    try {
      setIsAdding(true);
      await api.addMerchantToAlias(aliasId, merchantId);
      toast.success(`${merchantName} adicionado ao grupo.`);
      setSearchQuery(""); // Clear search
      await refetch();
      queryClient.invalidateQueries({ queryKey: ["merchant-aliases"] });
    } catch (error) {
      toast.error("Erro ao adicionar item.");
    } finally {
      setIsAdding(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Editar Agrupamento</DialogTitle>
            <DialogDescription>
              Gerencie os estabelecimentos vinculados a <strong>{alias?.pattern}</strong>.
            </DialogDescription>
          </DialogHeader>

          {isLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="animate-spin" /></div>
          ) : (
            <div className="flex-1 overflow-y-auto flex flex-col gap-4 px-1 pr-2">

              {/* General Settings */}
              <div className="space-y-3 border-b pb-4 bg-muted/20 p-3 rounded-md">
                <div className="flex items-center justify-between">
                  <Label className="font-semibold text-primary">Configurações Gerais</Label>
                  <Button
                    size="sm"
                    onClick={handleInitialSave}
                    disabled={isSavingSettings || (alias && (pattern === alias.pattern && (categoryId === (alias.categoryId || "all")) && (isInvestment === (alias.isInvestment || false)) && (ignored === (alias.ignored || false))))}
                  >
                    {isSavingSettings && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                    Salvar Alterações
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="alias-pattern" className="text-xs text-muted-foreground">Nome do Agrupamento</Label>
                    <Input
                      id="alias-pattern"
                      value={pattern}
                      onChange={(e) => setPattern(e.target.value)}
                      placeholder="Ex: Uber"
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Categoria Padrão</Label>
                    <div className="h-9">
                      <CategoryCombobox
                        categories={categories}
                        value={categoryId}
                        onChange={setCategoryId}
                        placeholder="Selecione..."
                        extraOption={{ label: "Sem Categoria Padrão", value: "all" }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-background">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">Investimento</Label>
                    <div className="text-[0.7rem] text-muted-foreground">
                      Marcar como investimento
                    </div>
                  </div>
                  <Switch
                    checked={isInvestment}
                    onCheckedChange={setIsInvestment}
                  />
                </div>

                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-background">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">Ignorar</Label>
                    <div className="text-[0.7rem] text-muted-foreground">
                      Não exibir no dashboard
                    </div>
                  </div>
                  <Switch
                    checked={ignored}
                    onCheckedChange={setIgnored}
                  />
                </div>
              </div>

              {/* Search Section */}
              <div className="space-y-2 border-b pb-4">
                <Label>Adicionar Estabelecimento</Label>
                <DebouncedSearchInput
                  placeholder="Buscar para adicionar..."
                  value={searchQuery}
                  onChange={setSearchQuery}
                />

                {searchQuery && (
                  <div className="border rounded-md max-h-[150px] overflow-y-auto bg-background absolute z-50 w-[550px] shadow-lg">
                    {searchResults.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground">Nenhum resultado.</div>
                    ) : (
                      searchResults.map((m: any) => {
                        const isMember = alias?.merchants?.some((curr: any) => curr.id === m.id);
                        return (
                          <div
                            key={m.id}
                            className={`flex justify-between items-center p-2 cursor-pointer ${isMember ? 'bg-muted cursor-default' : 'hover:bg-muted'}`}
                            onClick={() => !isMember && !isAdding && handleAdd(m.id, m.name)}
                          >
                            <span className={`text-sm font-medium ${isMember ? 'text-muted-foreground' : ''}`}>
                              {m.name} {isMember && "(Já adicionado)"}
                            </span>
                            <Button size="sm" variant="ghost" disabled={isAdding || isMember}>
                              {isMember ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                            </Button>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>

              {/* List Section */}
              <div className="flex flex-col gap-2">
                <Label className="mb-2">Itens no Agrupamento ({alias?.merchants?.length || 0})</Label>
                <div className="border rounded-md p-2">
                  {alias?.merchants?.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">Nenhum item neste grupo.</p>
                  ) : (
                    <ul className="space-y-1">
                      {alias?.merchants?.map((m: any) => (
                        <li key={m.id} className="flex justify-between items-center p-2 rounded hover:bg-muted/50 text-sm">
                          <span>{m.name}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8"
                            onClick={() => handleRemove(m.id, m.name)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog >

      {/* Confirmation Modal for Updating Past Transactions */}
      <Dialog open={isConfirmUpdateOpen} onOpenChange={setIsConfirmUpdateOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-500">
              <AlertTriangle className="h-5 w-5" />
              Atenção
            </DialogTitle>
            <DialogDescription className="py-4 text-base">
              Você alterou a categoria padrão deste agrupamento. Deseja atualizar a mesma categoria para <strong>todas as transações passadas</strong> que pertencem aos estabelecimentos deste grupo?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => executeSave(false)}
            >
              Não, apenas as futuras
            </Button>
            <Button
              onClick={() => executeSave(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              Sim, atualizar passadas
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

