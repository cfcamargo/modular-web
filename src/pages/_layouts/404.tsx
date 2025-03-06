import Header from "@/components/layout/header/header";
import { LottieAnimation } from "@/components/shared/lottie-animation";

export function NotFoud() {
  return (
    <div className="flex min-h-screen flex-col antialiased">
      <Header />
      <div className="flex flex-1 flex-col gap-4 p-8 pt-6 px-40 justify-center items-center">
        <h4 className="text-2xl font-bold">Página não encontrada</h4>
        <LottieAnimation src="/404.json" />
      </div>
    </div>
  );
}
