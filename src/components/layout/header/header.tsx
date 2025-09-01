import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Menu } from "./menu";
import UserProfile from "./user-profile";

export default function Header() {
  return (
    <header className="w-full h-[80px] flex items-center gap-6 justify-between py-4 border-b px-8">
      <div className="relative">
        <div className="rounded-full w-14 h-14 overflow-hidden">
          <img src="/logo.jpg" alt="" className="h-full w-full" />
        </div>
        <span className="absolute text-red-600 z-10 -right-1 -bottom-1 px-1 bg-white rounded-lg border-red-600 border-1 text-xs shadow-md">v0.1</span>
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
