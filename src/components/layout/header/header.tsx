import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Menu } from "./menu";

export default function Header() {
  return (
    <header className="w-full h-[80px] flex items-center gap-6 justify-between px-40 py-4 border-b">
      <div className="rounded-full w-14 h-14 overflow-hidden">
        <img src="/logo.jpg" alt="" />
      </div>

      <div className="flex flex-1 justify-between">
        <Menu />
        <ThemeToggle />
      </div>
    </header>
  );
}
