"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAdminTheme } from "@/components/admin/AdminThemeProvider";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }) {
  const { theme, toggleTheme } = useAdminTheme();
  const isDark = theme === "dark";
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label={label}
          className={cn("rounded-xl text-muted-foreground hover:text-foreground", className)}
        >
          <Sun className={cn("absolute transition-all duration-300", isDark ? "rotate-90 scale-0" : "rotate-0 scale-100")} />
          <Moon className={cn("absolute transition-all duration-300", isDark ? "rotate-0 scale-100" : "-rotate-90 scale-0")} />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
