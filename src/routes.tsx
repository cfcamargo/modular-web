import { createBrowserRouter, redirect } from "react-router-dom";
import { AppLayout } from "./pages/_layouts/app-layout";
import Dashboard from "./pages/dashboard/dashboard";
import { AuthLayout } from "./pages/_layouts/auth";
import { SignIn } from "./pages/auth/sign-in";
import { ResetPassword } from "./pages/auth/reset-password";
import Clients from "./pages/clients/clients";
import { NotFoud } from "./pages/_layouts/404";
import { Products } from "./pages/products/products";
import NewProduct from "./pages/products/new-product";
import UserList from "./pages/users/users";
import CreateUser from "./pages/users/create-user";
import { Register } from "./pages/auth/register";
import { DetailsUser } from "./pages/users/details-user";
import { authApi } from "./api";
import { useUserLoggedStore } from "@/store/auth/user-logged.ts";
import { toast } from "sonner";
import DetailsProduct from "./pages/products/details-product";
import QuoteList from "./pages/quote/quotes";
import NewQuote from "./pages/quote/new-quote";
import { CreateClient } from "./pages/clients/create-client";
import ClientDetails from "./pages/clients/client-details";
import ClientEdit from "./pages/clients/client-edit";
import ProductionOrders from "./pages/production/production-orders";
import Quotes from "./pages/quote/quotes";
import { OrderDetails } from "./pages/quote/quote-details";
import EditProduct from "./pages/products/edit-product";

const checkAuth = async () => {
  useUserLoggedStore.getState().setLoadingUserLoggedData(true);
  try {
    const { data } = await authApi.me();
    useUserLoggedStore.getState().setUser(data.user); // usuário autenticado — passa
  } catch {
    toast.error("Sessão expirada, Faça Login novamente");
    return redirect("/sign-in");
  } finally {
    useUserLoggedStore.getState().setLoadingUserLoggedData(false);
  }
};

const protectedLoader = async () => {
  return await checkAuth();
};

export const router = createBrowserRouter([
  {
    path: "/",
    loader: protectedLoader,
    element: <AppLayout />,
    // errorElement: <NotFound />,
    children: [
      // { path: "/", element: <Dashboard /> },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/clients", element: <Clients /> },
      { path: "/clients/create", element: <CreateClient /> },
      { path: "/clients/:id", element: <ClientDetails /> },
      { path: "/clients/:id/edit", element: <ClientEdit /> },
      { path: "/products", element: <Products /> },
      { path: "/products/create", element: <NewProduct /> },
      { path: "/products/:id", element: <DetailsProduct /> },
      { path: "/products/:id/edit", element: <EditProduct /> },
      { path: "/production", element: <ProductionOrders /> },
      { path: "/users", element: <UserList /> },
      { path: "/users/create", element: <CreateUser /> },
      { path: "/users/:id/edit", element: <CreateUser /> },
      { path: "/users/:id", element: <DetailsUser /> },
      { path: "/quotes", element: <Quotes /> },
      { path: "/quotes/create", element: <NewQuote /> },
      { path: "/quotes/:id", element: <OrderDetails /> },
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { path: "/sign-in", element: <SignIn /> },
      { path: "/reset-password", element: <ResetPassword /> },
      { path: "/register/:code", element: <Register /> },
    ],
  },
  {
    path: "*",
    element: <NotFoud />,
  },
  {
    path: "/404",
    element: <NotFoud />,
  },
]);
