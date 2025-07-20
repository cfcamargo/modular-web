import { createBrowserRouter, redirect } from "react-router-dom";
import { AppLayout } from "./pages/_layouts/app-layout";
import Dashboard from "./pages/dashboard/dashboard";
import { AuthLayout } from "./pages/_layouts/auth";
import { SignIn } from "./pages/auth/sign-in";
import { ResetPassword } from "./pages/auth/reset-password";
import Clients from "./pages/clients/clients";
import CreateClient from "./pages/clients/create-client";
import DetailsClient from "./pages/clients/details-client";
import { NotFoud } from "./pages/_layouts/404";
import EditClient from "./pages/clients/edit-client";
import { Products } from "./pages/products/products";
import { NewProduct } from "./pages/products/new-product";
import { DetailsProduct } from "./pages/products/details-product";
import { EditProduct } from "./pages/products/edit-product";
import UserList from "./pages/users/users";
import CreateUser from "./pages/users/create-user";
import { Register } from "./pages/auth/register";
import { DetailsUser } from "./pages/users/details-user";

const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;

  try {
    const [, payloadBase64] = token.split(".");
    const payload = JSON.parse(atob(payloadBase64));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

const checkAuth = () => {
  const token = localStorage.getItem("modular-token");
  return isTokenValid(token);
};

const protectedLoader = () => {
  if (!checkAuth()) {
    return redirect("/sign-in");
  }
  return null;
};

const publicLoader = () => {
  if (checkAuth()) {
    return redirect("/dashboard");
  }
  return null;
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
      { path: "/clients/:id", element: <DetailsClient /> },
      { path: "/clients/:id/edit", element: <EditClient /> },
      { path: "/products", element: <Products /> },
      { path: "/products/create", element: <NewProduct /> },
      { path: "/products/:id", element: <DetailsProduct /> },
      { path: "/products/:id/edit", element: <EditProduct /> },
      { path: "/users", element: <UserList /> },
      { path: "/users/create", element: <CreateUser /> },
      { path: "/users/:id/edit", element: <CreateUser /> },
      { path: "/users/:id", element: <DetailsUser /> },
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
    loader: publicLoader,
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
