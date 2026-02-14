import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "@/components/shared/Sidebar";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BreadcrumbHeader } from "@/components/shared/BreadcrumbHeader";

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const getBreadcrumbItems = () => {
    const path = location.pathname;

    // Nested Routes first
    if (path.includes('/import-transactions')) {
      return [
        { label: 'Transações', href: '/transactions' },
        { label: 'Importar' }
      ];
    }

    // Direct Routes
    if (path.includes('/merchants')) return [{ label: 'Lojas' }];
    if (path.includes('/banks')) return [{ label: 'Bancos' }];
    if (path.includes('/categories')) return [{ label: 'Categorias' }];
    if (path.includes('/transactions')) return [{ label: 'Transações' }];

    // Default
    return [{ label: 'Dashboard' }];
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-background flex">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden animate-in fade-in transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 lg:ml-64 bg-background transition-all duration-300">
        {/* Mobile Header */}
        <div className="lg:hidden p-4 border-b border-border/50 flex items-center gap-3 bg-card/50 backdrop-blur-sm sticky top-0 z-20 h-16">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(true)}
            className="hover:bg-primary/10 mr-2"
          >
            <Menu className="h-6 w-6 text-foreground" />
          </Button>
          <div className="flex-1 overflow-hidden">
            <BreadcrumbHeader
              items={getBreadcrumbItems()}
              className="mb-0"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto relative scroll-smooth">
          {/* Background gradient */}
          <div className="fixed inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
