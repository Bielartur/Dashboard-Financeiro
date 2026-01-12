import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Upload, FileText, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useRequests } from "@/hooks/use-requests";
import { useQuery } from "@tanstack/react-query";
import { Bank } from "@/models/Bank";
import { Category } from "@/models/Category";
import { PaymentImportResponse, PaymentCreate } from "@/models/Payment";
import { ImportPaymentTable } from "@/components/import/ImportPaymentTable";
import { toast } from "sonner";

const ImportPayments = () => {
  const api = useRequests();
  const [file, setFile] = useState<File | null>(null);
  const [selectedBank, setSelectedBank] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "credit_card" | "debit_card" | "other">("credit_card");
  const [importedPayments, setImportedPayments] = useState<PaymentImportResponse[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
  const [isImporting, setIsImporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { data: banks = [] } = useQuery<Bank[]>({
    queryKey: ["banks"],
    queryFn: api.getBanks,
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: api.getCategories,
  });

  // Filter banks that support import (currently only Nubank)
  const supportedBanks = banks.filter(b => b.slug === "nubank");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!file || !selectedBank) {
      toast.error("Selecione um banco e um arquivo.");
      return;
    }

    setIsImporting(true);
    try {
      let source = "nubank"; // Default
      const bankObj = banks.find(b => b.id === selectedBank);
      if (bankObj) {
        const slug = bankObj.slug;
        if (slug === "nubank") source = "nubank";
        else if (slug === "itau") source = "itau";
      }

      const response = await api.importPayments(file, source);
      setImportedPayments(response);

      // Select only non-duplicate items by default
      const nonDuplicateIndices = new Set(
        response.map((p, index) => (!p.alreadyExists ? index : -1)).filter(i => i !== -1)
      );
      setSelectedIndices(nonDuplicateIndices);

      toast.success("Fatura importada com sucesso!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Erro ao importar fatura.");
    } finally {
      setIsImporting(false);
    }
  };

  const handleCategoryChange = (index: number, categoryId: string) => {
    const updatedPayments = [...importedPayments];
    const category = categories.find((c) => c.id === categoryId);

    if (category) {
      updatedPayments[index] = {
        ...updatedPayments[index],
        category: {
          id: category.id,
          name: category.name,
          slug: category.slug,
          type: category.type
        },
      };
      setImportedPayments(updatedPayments);
    }
  };

  const handleSavePayments = async () => {
    if (importedPayments.length === 0) return;

    // Validate that all payments have a category
    const hasMissingCategories = importedPayments.some((p) => !p.category?.id);
    if (hasMissingCategories) {
      toast.error("Por favor, selecione uma categoria para todos os pagamentos.");
      return;
    }

    if (!selectedBank) {
      toast.error("Banco não selecionado.");
      return;
    }

    setIsSaving(true);
    try {
      // Filter only selected payments
      const selectedPayments = importedPayments.filter((_, index) => selectedIndices.has(index));

      const paymentsToCreate: PaymentCreate[] = selectedPayments.map(p => ({
        title: p.title,
        date: p.date,
        amount: p.amount,
        bankId: selectedBank,
        categoryId: p.category!.id, // Safe assertion due to validation above
        paymentMethod: paymentMethod,
        hasMerchant: p.hasMerchant
      }));

      await api.createPaymentsBulk(paymentsToCreate);
      toast.success("Pagamentos salvos com sucesso!");
      setImportedPayments([]);
      setFile(null);
    } catch (error: any) {
      console.error(error);
      toast.error("Erro ao salvar pagamentos.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative pb-8">
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/search-payments">
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Importar Fatura</h1>
            <p className="text-muted-foreground">
              Carregue o extrato do seu banco para importar pagamentos
            </p>
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-card border rounded-xl p-6 shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium">Banco</label>
              <Select value={selectedBank} onValueChange={setSelectedBank}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o banco" />
                </SelectTrigger>
                <SelectContent>
                  {supportedBanks.map((bank) => (
                    <SelectItem key={bank.id} value={bank.id}>
                      {bank.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Método de Pagamento</label>
              <Select value={paymentMethod} onValueChange={(v: any) => setPaymentMethod(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o método" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="debit_card">Cartão de Débito</SelectItem>
                  <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                  <SelectItem value="pix">Pix</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Arquivo (CSV)</label>
              <Input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
            </div>

            <Button
              onClick={handleImport}
              disabled={isImporting || !file || !selectedBank}
              className="w-full gap-2"
              variant="outline"
            >
              <Upload className="h-4 w-4" />
              {isImporting ? "Processando..." : "Carregar Fatura"}
            </Button>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Pagamentos Selecionados ({selectedIndices.size}/{importedPayments.length})
            </h2>
            {importedPayments.length > 0 && (
              <Button onClick={handleSavePayments} disabled={isSaving} className="gap-2">
                <Check className="h-4 w-4" />
                {isSaving ? "Salvando..." : "Confirmar Importação"}
              </Button>
            )}
          </div>

          <ImportPaymentTable
            payments={importedPayments}
            categories={categories}
            selectedIndices={selectedIndices}
            onSelectionChange={setSelectedIndices}
            onCategoryChange={handleCategoryChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ImportPayments;
