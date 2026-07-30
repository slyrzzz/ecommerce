/**
 * Shared Logo Component
 *
 * Single source of truth for the storefront logo.
 * Uses external SVG files for better caching and smaller bundle size.
 *
 * - /public/logo.svg: dark logo for light backgrounds
 * - /public/logo-dark.svg: light logo for dark backgrounds
 *
 * @example
 * <Logo className="h-7 w-auto" />                    // Header (auto light/dark)
 * <Logo className="h-7 w-auto" inverted />          // Footer (inverted for dark bg)
 */

interface LogoProps {
	className?: string;
	size?: string;
	/** Accessible label for the logo */
	ariaLabel?: string;
	/** Invert colors (for dark backgrounds like footer) */
	inverted?: boolean;
	/** Custom uploaded logo URL from Payload CMS */
	logoUrl?: string | null;
	/** Custom uploaded inverted logo URL from Payload CMS */
	logoInvertedUrl?: string | null;
}

const SIZE_CLASSES: Record<string, string> = {
	pequeno: "h-6 sm:h-7 w-auto",
	normal: "h-7 sm:h-8 w-auto",
	mediano: "h-9 sm:h-10 w-auto",
	grande: "h-11 sm:h-14 w-auto",
};

/**
 * Combined logo component supporting custom uploaded images from Payload CMS
 * or falling back to default Saleor SVG logos.
 */
export const Logo = ({
	className,
	size,
	ariaLabel = "Store Logo",
	inverted = false,
	logoUrl = null,
	logoInvertedUrl = null,
}: LogoProps) => {
	const effectiveSizeClass = size && SIZE_CLASSES[size] ? SIZE_CLASSES[size] : (className || "h-7 sm:h-8 w-auto");

	// If a custom logo image was uploaded in admin
	if (logoUrl || logoInvertedUrl) {
		const customSrc = (inverted && logoInvertedUrl) ? logoInvertedUrl : (logoUrl || logoInvertedUrl || "/logo.svg");
		return (
			/* eslint-disable-next-line @next/next/no-img-element */
			<img
				src={customSrc}
				alt={ariaLabel}
				className={`w-auto object-contain ${effectiveSizeClass}`}
			/>
		);
	}

	// Default fallback SVG logos
	const lightModeLogo = inverted ? "/logo-dark.svg" : "/logo.svg";
	const darkModeLogo = inverted ? "/logo.svg" : "/logo-dark.svg";

	const baseStyles = "aspect-[100/23]";

	return (
		<>
			{/* Light mode */}
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img
				src={lightModeLogo}
				alt={ariaLabel}
				width={100}
				height={23}
				className={`dark:hidden ${baseStyles} ${effectiveSizeClass}`}
			/>
			{/* Dark mode */}
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img
				src={darkModeLogo}
				alt={ariaLabel}
				width={100}
				height={23}
				className={`hidden dark:block ${baseStyles} ${effectiveSizeClass}`}
			/>
		</>
	);
};
