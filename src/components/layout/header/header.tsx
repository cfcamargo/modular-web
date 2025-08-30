import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Menu } from "./menu";
import UserProfile from "./user-profile";

export default function Header() {
  return (
    <header className="w-full h-[80px] flex items-center gap-6 justify-between py-4 border-b px-8">
      <div className="rounded-full w-14 h-14 overflow-hidden">
        <img src="/logo.jpg" alt="" />
      </div>

      <div className="flex flex-1 justify-between">
        <Menu />
        <div className="flex items-end gap-4">
          <ThemeToggle />
          <UserProfile />
        </div>
      </div>
    </header>
  );
}
