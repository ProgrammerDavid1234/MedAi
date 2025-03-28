import * as React from "react";
import { cn } from "../../lib/utils";

const Badge = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("inline-flex items-center rounded-full bg-blue-500 px-2 py-1 text-xs font-bold text-white", className)}
    {...props}
  />
));

Badge.displayName = "Badge";

export { Badge };
