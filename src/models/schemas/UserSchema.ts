
import { z } from "zod";

export const UserUpdateSchema = z.object({
  firstName: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  lastName: z.string().min(3, "O sobrenome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
});

export type UserUpdateFormValues = z.infer<typeof UserUpdateSchema>;

export const PasswordChangeSchema = z.object({
  currentPassword: z.string().min(1, "Senha atual é obrigatória"),
  newPassword: z.string().min(6, "A nova senha deve ter pelo menos 6 caracteres"),
  newPasswordConfirm: z.string().min(6, "A confirmação deve ter pelo menos 6 caracteres"),
}).refine((data) => data.newPassword === data.newPasswordConfirm, {
  message: "As senhas não conferem",
  path: ["newPasswordConfirm"],
});

export type PasswordChangeFormValues = z.infer<typeof PasswordChangeSchema>;
