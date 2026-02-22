import { ChevronDown, UserCircle, ShieldCheck, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BASE_URL } from "@/utils/apiRequests";

export const SidebarUserProfile = () => {
  const { user, logout } = useAuth();

  // Fallback for loading state or if somehow user is null but component renders
  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName}`
    : 'Usuário';

  const getInitials = (first: string = "", last: string = "") => {
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
  };

  const getAvatarUrl = (path?: string) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${BASE_URL}${path}`;
  };

  console.log(user?.profileImageUrl);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 cursor-pointer hover:bg-secondary transition-colors">
          <Avatar className="h-10 w-10 ring-2 ring-primary/20">
            <AvatarImage src={getAvatarUrl(user?.profileImageUrl)} className="object-cover" />
            <AvatarFallback className="bg-primary/10 text-primary">
              {user?.firstName ? getInitials(user.firstName, user.lastName) : <UserCircle className="h-6 w-6" />}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{displayName}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <Link to="/profile">
          <DropdownMenuItem className="cursor-pointer">
            <UserCircle className="mr-2 h-4 w-4" />
            <span>Meu Perfil</span>
          </DropdownMenuItem>
        </Link>
        {user?.isAdmin && (
          <Link to="/admin">
            <DropdownMenuItem className="cursor-pointer">
              <ShieldCheck className="mr-2 h-4 w-4" />
              <span>Administração</span>
            </DropdownMenuItem>
          </Link>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer text-destructive hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10 focus:text-destructive"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span className="font-medium">Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
