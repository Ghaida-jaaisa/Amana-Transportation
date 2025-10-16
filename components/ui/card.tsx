import * as React from "react";
import { cn } from "@/lib/utils";

// Main card container
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-border/50 py-6 shadow-md shadow-black/5",
        "hover:shadow-xl hover:-translate-y-1 hover:border-primary/40 transition-all duration-300 ease-out",
        "backdrop-blur-sm",
        className
      )}
      {...props}
    />
  );
}

// Card header (title + actions)
function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6",
        "has-data-[slot=card-action]:grid-cols-[1fr_auto]",
        className
      )}
      {...props}
    />
  );
}

// Title
function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold text-lg", className)}
      {...props}
    />
  );
}

// Description text
function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

// Optional header action
function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  );
}

// Card content area
function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="card-content" className={cn("px-6", className)} {...props} />
  );
}

// Footer area
function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 border-t border-border/40 pt-4", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
