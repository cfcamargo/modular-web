import { RouterProvider } from "react-router-dom";
import "./global.css";
import { router } from "./routes";
import { ThemeProvider } from "./components/theme/theme-provider";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/react-query";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Toaster } from "sonner";

export function App() {
  return (
    <ThemeProvider storageKey="modular-theme" defaultTheme="dark">
      <HelmetProvider>
        <Helmet titleTemplate="%s | Modular" />
        <Toaster richColors position="top-right" />
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </HelmetProvider>
    </ThemeProvider>
  );
}
