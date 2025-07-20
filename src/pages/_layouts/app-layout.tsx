import Header from "@/components/layout/header/header";
import { Outlet } from "react-router-dom";

export function AppLayout() {
  // const verifyUser = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await authApi.me();
  //     if (!response) {
  //       clearLoginInLocalStorage();
  //       navigate("sign-in");
  //     }

  //     const token = localStorage.getItem("lyra-token");

  //     authStore.setToken(token!);

  //     authStore.setUser(response.data.user);
  //   } catch {
  //     toast.error("Token Invalido, faça login novamente");
  //     clearLoginInLocalStorage();
  //     navigate("sign-in");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="flex min-h-screen flex-col antialiased">
      <Header />
      <div className="flex flex-1 flex-col gap-4 p-8 pt-6 px-40">
        <Outlet />
      </div>
    </div>
  );
}
