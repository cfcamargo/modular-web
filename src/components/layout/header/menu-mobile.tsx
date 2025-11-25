import { useState } from "react";
import { Menu as MenuIcon, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { authApi } from "@/api";
import { toast } from "sonner";

// Reutilizando ou redefinindo o tipo para garantir tipagem
export interface MenuItem {
  path: string;
  name: string;
  subItems?: MenuItem[];
}

interface MobileMenuProps {
  items: MenuItem[];
  onLogout?: () => void; // Opcional: prop para ação de logout
}

export function MobileMenu({ items, onLogout }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Função para fechar o menu ao clicar em um link
  const handleLinkClick = () => {
    setOpen(false);
  };

  const handleLogout = async () => {
    setLoading(true);
    await authApi
      .loggout()
      .then(() => {
        navigate("/sign-in");
      })
      .catch(() => {
        toast.error("Erro ao sair do sistema");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="md:hidden">
          <MenuIcon className="h-10 w-10" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </SheetTrigger>

      {/* Ajuste de Layout:
        - h-full: Ocupa altura total (padrão do SheetContent lateral)
        - flex flex-col: Permite empilhar Header, Nav (scroll) e Footer
        - p-0: Removemos padding padrão para controlar nas seções internas
      */}
      <SheetContent
        side="left"
        className="w-[300px] sm:w-[400px] p-0 flex flex-col h-full"
      >
        {/* TOPO: Cabeçalho fixo */}
        <div className="p-6 pb-2 border-b">
          <SheetHeader className="text-left">
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
        </div>

        {/* MEIO: Área de navegação com Scroll */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <nav className="flex flex-col gap-2">
            {items.map((item, index) => {
              // Se tiver subitens, "achatamos" a lista renderizando eles diretamente
              if (item.subItems && item.subItems.length > 0) {
                return item.subItems.map((subItem, subIndex) => (
                  <Button
                    key={`${index}-${subIndex}`}
                    asChild
                    variant="ghost"
                    className="justify-start h-10 w-full font-medium"
                    onClick={handleLinkClick}
                  >
                    <NavLink
                      to={subItem.path}
                      className={({ isActive }) =>
                        isActive ? "bg-accent text-accent-foreground" : ""
                      }
                    >
                      {subItem.name}
                    </NavLink>
                  </Button>
                ));
              }

              // Se for um item simples
              return (
                <Button
                  key={index}
                  asChild
                  variant="ghost"
                  className="justify-start h-10 w-full font-medium"
                  onClick={handleLinkClick}
                >
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      isActive ? "bg-accent text-accent-foreground" : ""
                    }
                  >
                    {item.name}
                  </NavLink>
                </Button>
              );
            })}
          </nav>
        </div>

        <div className="p-6 pt-4 border-t mt-auto">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
            disabled={loading}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair do Sistema
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
