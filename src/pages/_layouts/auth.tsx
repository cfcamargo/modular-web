import { Outlet } from "react-router-dom";
import { Building2 } from "lucide-react";

export function AuthLayout() {
  return (
    <div className="min-h-screen grid grid-cols-2 antialiased">
      <div className="h-full bg-muted text-muted-foreground flex flex-col justify-between bg-[url('/bg.jpg')] bg-cover bg-center">
        <div className="h-full p-10 flex flex-col justify-between bg-primary dark:bg-zinc-900">
          <div className="flex items-center gap-3 text-lg text-foreground">
            <Building2 className="w-5 h-5" />
            <span className="font-semibold text-foreground">Modular Pré Moldados</span>
          </div>
          <footer className="text-sm">
            Painel administrativo &copy; Modular - {new Date().getFullYear()}
          </footer>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center relative">
        <div className="w-32 h-32 rounded-full overflow-hidden">
          <img src="/logo.jpg" className="h-full" />
        </div>
        <Outlet />
      </div>
    </div>
  );
}
