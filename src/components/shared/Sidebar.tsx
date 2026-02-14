import { BarChart3, ArrowLeftRight, Settings, Crown, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { SidebarMenuItem } from './SidebarMenuItem';
import { SidebarUserProfile } from './SidebarUserProfile';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar = ({ isOpen = false, onClose }: SidebarProps) => {
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen w-64 bg-card border-r border-border/50 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
      )}
    >
      {/* Logo Section */}
      <div className="p-6 border-b border-border/50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/20">
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Dashboard</h1>
            <p className="text-xs text-muted-foreground">Financeiro</p>
          </div>
        </div>
        {/* Close Button Mobile */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* User Profile */}
      <div className="px-4 py-4">
        <SidebarUserProfile />
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-2 space-y-6 overflow-y-auto">
        {/* Principal Section */}
        <div>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
            Principal
          </h2>
          <div className="space-y-1">
            <SidebarMenuItem
              icon={BarChart3}
              label="Dashboard"
              path="/"
              active={['/', '/categories', '/banks', '/merchants'].includes(useLocation().pathname)}
              onClick={onClose}
            />
            <SidebarMenuItem icon={ArrowLeftRight} label="Transações" path="/transactions" onClick={onClose} />
            {/* <SidebarMenuItem icon={CreditCard} label="Assinaturas" path="/subscriptions" onClick={onClose} /> */}
          </div>
        </div>

        {/* Outros Section */}
        <div>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
            Outros
          </h2>
          <div className="space-y-1">
            <SidebarMenuItem icon={Settings} label="Configurações" path="/profile" onClick={onClose} />
          </div>
        </div>
      </nav>

      {/* Theme Toggle */}
      <div className="px-4 py-2">
        <ThemeToggle />
      </div>

      {/* Upgrade Card */}
      <div className="p-4 m-4 mt-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="p-3 rounded-full bg-primary/20">
            <Crown className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground mb-1">Upgrade</h3>
            <p className="text-xs text-muted-foreground">
              Desbloqueie todos os recursos
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
