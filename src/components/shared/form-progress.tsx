import type React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface FormProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  readonly currentStep: number;
  readonly steps: Array<{
    label: string;
    description?: string;
  }>;
}

export function FormProgress({
  currentStep,
  steps,
  className,
  ...props
}: FormProgressProps) {
  return (
    <div className={cn("w-full max-w-3xl mx-auto", className)} {...props}>
      <ol className="flex items-center w-full">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <li
              key={step.label}
              className={cn(
                "flex items-center",
                index !== steps.length - 1 ? "w-full" : ""
              )}
            >
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors duration-300",
                    isActive
                      ? "border-primary bg-primary text-primary-foreground"
                      : isCompleted
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <span className="text-sm font-medium">{stepNumber}</span>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <div
                    className={cn(
                      "text-sm font-medium",
                      isActive || isCompleted
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </div>
                  {step.description && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {step.description}
                    </div>
                  )}
                </div>
              </div>
              {index !== steps.length - 1 && (
                <div
                  className={cn(
                    "w-full h-0.5 mx-2 transition-colors duration-300",
                    isCompleted ? "bg-primary" : "bg-muted"
                  )}
                ></div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
