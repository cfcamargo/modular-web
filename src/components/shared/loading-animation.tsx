import { LoaderCircle } from "lucide-react";

interface LoaderCircleProps {
  readonly size?: number;
  readonly color?: string;
}

export default function LoadingAnimation({ size, color }: LoaderCircleProps) {
  return <LoaderCircle size={size} color={color} className="animate-spin" />;
}
