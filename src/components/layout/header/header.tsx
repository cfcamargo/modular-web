import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Menu } from "./menu";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { loggout } from "@/api/sign-in";
import { toast } from "sonner";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await loggout()
      .then(() => {
        localStorage.removeItem("modular-token");
        toast.success("Loggout concluido, até mais!");
        navigate("/sign-in");
      })
      .catch(() => {
        toast.error("{Erro ao sair do sistema");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <header className="w-full h-[80px] flex items-center gap-6 justify-between px-40 py-4 border-b">
      <div className="rounded-full w-14 h-14 overflow-hidden">
        <img src="/logo.jpg" alt="" />
      </div>

      <div className="flex flex-1 justify-between">
        <Menu />
        <div className="flex items-end gap-4">
          <ThemeToggle />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  title="sair"
                  disabled={loading}
                  onClick={handleLogout}
                >
                  <LogOut />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Sair do sistema</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </header>
  );
}
