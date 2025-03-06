import { Outlet } from "react-router-dom";
import { Building2 } from "lucide-react";

export function AuthLayout() {
  return (
    <div className="min-h-screen grid grid-cols-2 antialiased">
      <div className="h-full border-r border-foreground/5 bg-muted p-10 text-muted-foreground flex flex-col justify-between">
        <div className="flex items-center gap-3 text-lg text-foreground">
          <Building2 className="w-5 h-5" />
          <span className="font-semibold">Modular Pré Moldados</span>
        </div>
        <footer className="text-sm">
          Painel administrativo &copy; Modular - {new Date().getFullYear()}
        </footer>
      </div>

      <div className="flex flex-col items-center justify-center relative">
        <Outlet />
      </div>
    </div>
  );
}
