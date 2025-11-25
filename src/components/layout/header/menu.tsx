import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import type { MenuItem } from "./types";
import { MobileMenu } from "./menu-mobile";

const menuItems: MenuItem[] = [
  {
    path: "/dashboard",
    name: "Dashboard",
  },
  {
    path: "/clients",
    name: "Clientes",
  },
  // {
  //   path: "",
  //   name: "Vendas",
  //   subItems: [
  //     {
  //       name: "Orçamentos",
  //       path: "/quotes",
  //     },
  //     // {
  //     //   name: "Pedidos",
  //     //   path: "/orders",
  //     // },
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
      {
        path: "/production",
        name: "Producao",
      },
    ],
  },
  {
    path: "/users",
    name: "Usuários",
  },
];
export function Menu() {
  return (
    <>
      <nav className="xs:hidden md:flex items-center space-x-4">
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
      <div>
        <MobileMenu items={menuItems} />
      </div>
    </>
  );
}
