import { ChevronDownIcon, LogOut, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserLoggedStore } from "@/store/auth/user-logged";
import { useState } from "react";
import { authApi } from "@/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getUserInitials } from "@/utils/stringUtils";
import { ChangePasswordModal } from "./change-password";

export default function UserProfile() {
  const { user } = useUserLoggedStore();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [openPasswordModal, setOpenPasswordModal] = useState(false);

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <Avatar>
            <AvatarImage src="./avatar.jpg" alt="Profile image" />
            <AvatarFallback>{getUserInitials(user?.fullName!)}</AvatarFallback>
          </Avatar>
          <ChevronDownIcon
            size={16}
            className="opacity-60"
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-64">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="text-foreground truncate text-sm font-medium">
            {user?.fullName}
          </span>
          <span className="text-muted-foreground truncate text-xs font-normal">
            {user?.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <ChangePasswordModal
            open={openPasswordModal}
            handleToggle={setOpenPasswordModal}
            handleLoggout={handleLogout}
          />
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Button variant={"ghost"} disabled={loading} onClick={handleLogout}>
              <LogOut size={16} className="opacity-60" aria-hidden="true" />
              <span>Sair do sistema</span>
            </Button>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
