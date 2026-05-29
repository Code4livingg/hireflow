"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMounted(true); }, []);

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      type="button"
      variant="outline"
      size="icon-lg"
      aria-label="Toggle color theme"
      title="Toggle color theme"
      disabled={!mounted}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative border-white/55 bg-white/70 shadow-sm backdrop-blur-xl hover:bg-white dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/15"
    >
      <Sun
        className={`size-4 transition-all ${mounted && isDark ? "-rotate-90 scale-0" : "rotate-0 scale-100"}`}
      />
      <Moon
        className={`absolute size-4 transition-all ${mounted && isDark ? "rotate-0 scale-100" : "rotate-90 scale-0"}`}
      />
    </Button>
  );
}
