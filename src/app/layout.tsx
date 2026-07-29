import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { type ReactNode } from "react";
import { type Metadata } from "next";
import { getStoreIdentity } from "@/lib/payload";
import { getMetadataBase } from "@/lib/seo";
import { localeConfig } from "@/config/locale";
import { SpeedInsights } from "@vercel/speed-insights/next";

export async function generateMetadata(): Promise<Metadata> {
	const identity = await getStoreIdentity();
	return {
		title: {
			default: identity.siteName,
			template: `%s | ${identity.siteName}`,
		},
		description: identity.description,
		metadataBase: getMetadataBase(),
		...(identity.faviconUrl
			? {
					icons: {
						icon: [{ url: identity.faviconUrl }],
						shortcut: [identity.faviconUrl],
						apple: [{ url: identity.faviconUrl }],
					},
			  }
			: {}),
	};
}

export default function RootLayout(props: { children: ReactNode }) {
	const { children } = props;

	return (
		<html lang={localeConfig.htmlLang} className={`${GeistSans.variable} ${GeistMono.variable} min-h-dvh`}>
			<body className="min-h-dvh font-sans">
				{children}
				<SpeedInsights />
			</body>
		</html>
	);
}
