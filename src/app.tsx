import { RouterProvider } from "react-router-dom";
import "./global.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/theme/theme-provider";
import { queryClient } from "./lib/react-query";
import { router } from "./routes";

export function App() {
  return (
    <ThemeProvider storageKey="modular-theme" defaultTheme="dark">
      <HelmetProvider>
        <Helmet titleTemplate="%s | Modular" />
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
        <Toaster richColors position="top-right" />
      </HelmetProvider>
    </ThemeProvider>
  );
}
