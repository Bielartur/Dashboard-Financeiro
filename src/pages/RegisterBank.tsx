import * as React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

import { useRequests } from "@/hooks/use-requests";

const formSchema = z.object({
  name: z.string().min(1, "O nome do banco é obrigatório"),
  color_hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Cor inválida"),
  logo_url: z.string().url("URL do logo inválida").optional().or(z.literal("")),
});

const RegisterBank = () => {
  const api = useRequests();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9 ]/g, "")
      .replace(/\s+/g, "_");
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      color_hex: "#000000",
      logo_url: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await api.createBank({
        name: values.name,
        color_hex: values.color_hex,
        slug: generateSlug(values.name),
        logo_url: values.logo_url || "https://placehold.co/600",
        is_active: true,
      });

      toast.success("Banco cadastrado com sucesso!");
      form.reset();
      // Optional: navigate back or stay
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Erro desconhecido");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative">
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />

      <nav className="absolute top-0 left-0 w-full p-6 z-20">
        <Link to="/">
          <Button variant="secondary" className="gap-2 pl-2 hover:text-foreground hover:backdrop-blur-sm transition-all duration-300">
            <ArrowLeft className="h-4 w-4" />
            <span className="font-medium">Voltar para Dashboard</span>
          </Button>
        </Link>
      </nav>

      <Card className="w-full max-w-lg z-10 shadow-lg">
        <CardHeader>
          <CardTitle>Cadastrar Banco</CardTitle>
          <CardDescription>
            Adicione um novo banco ao sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Banco</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Nubank" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="color_hex"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cor do Banco</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input
                            type="color"
                            {...field}
                            className="w-16 h-10 p-1 cursor-pointer"
                          />
                        </FormControl>
                        <FormControl>
                          <Input
                            type="text"
                            {...field}
                            placeholder="#000000"
                            className="flex-1 font-mono uppercase"
                            maxLength={7}
                          />
                        </FormControl>
                      </div>
                      <FormDescription className="text-xs text-muted-foreground">
                        Cor usada em gráficos e ícones.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="logo_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL da Logo</FormLabel>
                      <FormControl>
                        <Input placeholder="https://exemplo.com/logo.png" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Logo Preview */}
              {form.watch("logo_url") && (
                <div className="mt-6 flex flex-col items-center justify-center p-4 border rounded-lg bg-muted/20 border-dashed">
                  <span className="text-sm text-muted-foreground mb-3">Prévia da Logo</span>
                  <div className="relative w-24 h-24 flex items-center justify-center rounded-full shadow-sm overflow-hidden p-2">
                    <img
                      src={form.watch("logo_url")}
                      alt="Preview"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://placehold.co/600?text=Error";
                      }}
                    />
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full mt-6" disabled={isLoading}>
                {isLoading ? "Cadastrando..." : "Cadastrar Banco"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterBank;
