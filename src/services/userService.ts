
import { apiRequest } from "@/utils/apiRequests";
import { User, UserUpdate, PasswordChange } from "@/models/User";

export const userService = {
  updateUser: async (payload: UserUpdate) => {
    return await apiRequest<User>("users/me", "PUT", payload as unknown as Record<string, unknown>);
  },

  changePassword: async (payload: PasswordChange) => {
    return await apiRequest<void>("users/change-password", "PUT", payload as unknown as Record<string, unknown>);
  },

  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return await apiRequest<void>("users/me/avatar", "POST", formData);
  }
};
