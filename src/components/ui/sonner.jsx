"use client";

import { Toaster as Sonner } from "sonner";

/** App-wide toast host. Call `toast.success(...)` from "sonner" anywhere. */
function Toaster(props) {
  return (
    <Sonner
      position="top-right"
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "group toast !rounded-xl !border !border-border !bg-popover !text-popover-foreground !shadow-elegant",
          description: "!text-muted-foreground",
          actionButton: "!bg-primary !text-primary-foreground",
          cancelButton: "!bg-muted !text-muted-foreground",
          success: "[&_[data-icon]]:!text-success",
          error: "[&_[data-icon]]:!text-destructive",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
