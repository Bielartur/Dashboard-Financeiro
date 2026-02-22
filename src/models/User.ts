export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
  isActive?: boolean;
  isAdmin?: boolean; // Ensure backend sends this if needed, or default false
  itemIds: string[]; // List of connected Open Finance Item IDs
}

export interface UserUpdate {
  firstName: string;
  lastName: string;
  email: string;
}

export interface PasswordChange {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}
