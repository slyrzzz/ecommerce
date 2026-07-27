import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "default" | "secondary" | "outline-solid" | "ghost" | "destructive";
	size?: "default" | "sm" | "lg" | "icon";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant = "default", size = "default", ...props }, ref) => {
		return (
			<button
				ref={ref}
				className={cn(
					// Base styles
					"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium",
					// Transitions
					"transition-all duration-200",
					// Focus states
					"focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
					// Disabled states
					"disabled:pointer-events-none disabled:opacity-50",
					// Variants
					{
						"hover:bg-primary/90 shadow-sm bg-primary text-primary-foreground font-semibold": variant === "default",
						"hover:bg-secondary/80 bg-secondary text-secondary-foreground font-semibold border border-border":
							variant === "secondary",
						"shadow-sm border-2 border-primary/20 bg-background hover:bg-accent hover:text-accent-foreground font-semibold":
							variant === "outline-solid",
						"hover:bg-accent hover:text-accent-foreground font-semibold": variant === "ghost",
						"hover:bg-destructive/90 shadow-sm bg-destructive text-destructive-foreground font-semibold":
							variant === "destructive",
					},
					// Sizes
					{
						"h-10 px-4 py-2 text-sm": size === "default",
						"h-9 px-3 text-sm": size === "sm",
						"h-14 px-8 text-base": size === "lg",
						"h-10 w-10 p-0": size === "icon",
					},
					className,
				)}
				{...props}
			/>
		);
	},
);

Button.displayName = "Button";
