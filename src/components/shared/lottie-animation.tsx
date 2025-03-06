import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface LottieAnimationProps {
  readonly src: string;
}

export function LottieAnimation({ src }: LottieAnimationProps) {
  return <DotLottieReact src={src} loop autoplay />;
}
