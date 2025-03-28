import * as React from "react";
import * as DropdownPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "../../lib/utils";

export const DropdownMenu = DropdownPrimitive.Root;

export const DropdownMenuTrigger = DropdownPrimitive.Trigger;

export const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof DropdownPrimitive.Content>
>(({ className, ...props }, ref) => (
  <DropdownPrimitive.Content
    ref={ref}
    className={cn(
      "min-w-[150px] bg-white border border-gray-200 rounded-md shadow-md p-2",
      className
    )}
    {...props}
  />
));

DropdownMenuContent.displayName = "DropdownMenuContent";

export const DropdownMenuItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof DropdownPrimitive.Item>
>(({ className, ...props }, ref) => (
  <DropdownPrimitive.Item
    ref={ref}
    className={cn(
      "px-3 py-2 rounded-md text-sm hover:bg-gray-100 cursor-pointer",
      className
    )}
    {...props}
  />
));

DropdownMenuItem.displayName = "DropdownMenuItem";
