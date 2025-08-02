import { NavLink } from "react-router-dom";
import { MenuItem } from "./types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { DropdownMenuContent } from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";

const menuItems: MenuItem[] = [
  {
    path: "/dashboard",
    name: "Dashboard",
  },
  // {
  //   path: "/clients",
  //   name: "Clientes",
  // },
  // {
  //   path: "",
  //   name: "Vendas",
  //   subItems: [
  //     {
  //       name: "Orçamentos",
  //       path: "/budgets",
  //     },
  //     {
  //       name: "Pedidos",
  //       path: "/orders",
  //     },
  //   ],
  // },
  {
    name: "Estoque",
    path: "",
    subItems: [
      {
        path: "/products",
        name: "Produtos",
      },
      // {
      //   path: "/production",
      //   name: "Produção",
      // },
    ],
  },
  {
    path: "/users",
    name: "Usuários",
  },
];
export function Menu() {
  return (
    <nav className="flex items-center space-x-4">
      {menuItems.map((item, index) => {
        return item.subItems ? (
          <NavigationMenu key={index}>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>{item.name}</NavigationMenuTrigger>
                <NavigationMenuContent className="p-2">
                  {item.subItems.map((subitem, index) => {
                    return (
                      <Button
                        key={index}
                        asChild
                        variant="ghost"
                        className="w-full flex justify-start"
                      >
                        <NavLink to={subitem.path}>{subitem.name}</NavLink>
                      </Button>
                    );
                  })}
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        ) : (
          <Button asChild variant="ghost" key={index}>
            <NavLink to={item.path}>{item.name}</NavLink>
          </Button>
        );
      })}
    </nav>
  );
}
