import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRequests } from "@/hooks/use-requests";
import { BaseModal } from "./BaseModal";
import { DialogFooter } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { CategorySchema, CategoryFormValues } from "@/models/schemas/CategorySchema";
import { Switch } from "@/components/ui/switch";

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateCategoryModal({ isOpen, onClose }: CreateCategoryModalProps) {
  const api = useRequests();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      name: "",
      colorHex: "#000000",
      isInvestment: false,
      ignored: false,
    },
  });

  async function onSubmit(values: CategoryFormValues) {
    setIsLoading(true);
    try {
      await api.createCategory({
        name: values.name,
        colorHex: values.colorHex,
        isInvestment: values.isInvestment,
        ignored: values.ignored,
      });

      toast({
        variant: "success",
        title: "Sucesso",
        description: "Categoria cadastrada com sucesso!",
      });
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
      form.reset({
        name: "",
        colorHex: values.colorHex,
        isInvestment: false,
        ignored: false,
      });
      onClose();
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao cadastrar categoria.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <BaseModal
      title="Nova Categoria"
      description="Preencha os dados abaixo para criar uma nova categoria."
      isOpen={isOpen}
      onClose={onClose}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da Categoria</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Alimentação" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />



          <FormField
            control={form.control}
            name="colorHex"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cor da Categoria</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input
                      type="color"
                      {...field}
                      className="w-20 py-1.5 px-2 cursor-pointer"
                    />
                  </FormControl>
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                      placeholder="#000000"
                      className="flex-1 font-mono uppercase"
                      maxLength={7}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.startsWith("#") || value === "") {
                          field.onChange(value);
                        } else {
                          field.onChange("#" + value);
                        }
                      }}
                    />
                  </FormControl>
                </div>
                <FormDescription className="text-xs text-muted-foreground">
                  Escolha uma cor para identificar esta categoria nos gráficos.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="isInvestment"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Investimento</FormLabel>
                    <div className="text-[0.8rem] text-muted-foreground">
                      Marcar esta categoria como investimento.
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ignored"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Ignorar no Dashboard</FormLabel>
                    <div className="text-[0.8rem] text-muted-foreground">
                      Não contabilizar nos totais de Receita/Despesa.
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} className="w-1/2" disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" className="w-1/2" isLoading={isLoading}>
              Cadastrar
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </BaseModal>
  );
}
