import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/components/theme/theme-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function ProfilePreferences() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Preferências do Sistema</h2>
        <p className="text-sm text-muted-foreground">
          Ajuste temas e outras configurações globais.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Aparência</CardTitle>
          <CardDescription>
            Personalize a aparência do sistema de acordo com sua preferência.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-0">
          <div className="space-y-2 max-w-sm">
            <Label htmlFor="theme-select">Tema</Label>
            <Select value={theme} onValueChange={(t) => setTheme(t as any)}>
              <SelectTrigger id="theme-select">
                <SelectValue placeholder="Selecione um tema" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Tema Claro</SelectItem>
                <SelectItem value="dark">Tema Escuro</SelectItem>
                <SelectItem value="system">Mesma do Sistema</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="p-8 mt-6 text-center text-muted-foreground border rounded-lg border-dashed">
            Em breve terá novas funcionalidades.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
