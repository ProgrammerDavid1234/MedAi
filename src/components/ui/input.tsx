import * as React from "react";
import { cn } from "../../lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-400 transition-all",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
