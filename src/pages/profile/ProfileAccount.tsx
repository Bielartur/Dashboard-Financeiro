
import { UserProfileForm } from "@/components/profile/UserProfileForm";
import { ChangePasswordForm } from "@/components/profile/ChangePasswordForm";

export default function ProfileAccount() {
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Dados da Conta</h2>
        <p className="text-sm text-muted-foreground">
          Gerencie suas informações de login e dados pessoais.
        </p>
      </div>

      <div className="grid gap-6 max-w-3xl mx-auto">
        <UserProfileForm />
        <ChangePasswordForm />
      </div>
    </div>
  );
}
