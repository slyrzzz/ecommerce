"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
	const { theme, setTheme, resolvedTheme } = useTheme();
	const [mounted, setMounted] = React.useState(false);

	// Avoid hydration mismatch
	React.useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<div
				className={`h-9 w-9 rounded-full border border-border bg-secondary/50 ${className}`}
				aria-hidden="true"
			/>
		);
	}

	const isDark = resolvedTheme === "dark" || theme === "dark";

	const toggleTheme = () => {
		setTheme(isDark ? "light" : "dark");
	};

	return (
		<button
			type="button"
			onClick={toggleTheme}
			className={`relative flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm transition-all duration-200 hover:bg-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${className}`}
			aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
			title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
		>
			<Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
			<Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
		</button>
	);
}
