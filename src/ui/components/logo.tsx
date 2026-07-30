import { LinkWithChannel } from "../atoms/link-with-channel";
import { Logo as SharedLogo } from "./shared/logo";

interface LogoProps {
	logoUrl?: string | null;
	logoInvertedUrl?: string | null;
	siteName?: string;
	inverted?: boolean;
	className?: string;
	size?: string;
}

/**
 * Site logo with link to homepage.
 * Renders custom image from StoreIdentity if configured in Payload CMS.
 */
export const Logo = ({
	logoUrl = null,
	logoInvertedUrl = null,
	siteName = "Store Homepage",
	inverted = false,
	size,
	className,
}: LogoProps = {}) => {
	return (
		<LinkWithChannel href="/" className="flex shrink-0 items-center" aria-label={siteName}>
			<SharedLogo
				className={className}
				size={size}
				ariaLabel={siteName}
				inverted={inverted}
				logoUrl={logoUrl}
				logoInvertedUrl={logoInvertedUrl}
			/>
		</LinkWithChannel>
	);
};
