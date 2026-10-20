import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { type ReactNode } from "react";
import { type Metadata } from "next";
import { getStoreIdentity } from "@/lib/payload";
import { getMetadataBase } from "@/lib/seo";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@/ui/components/theme-provider";
import { getServerLocale } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
	const identity = await getStoreIdentity();
	return {
		title: {
			default: identity.siteName,
			template: `%s | ${identity.siteName}`,
		},
		description: identity.description,
		metadataBase: getMetadataBase(),
		icons: {
			icon: [{ url: identity.faviconUrl || "/favicon-32x32.png" }],
			shortcut: [identity.faviconUrl || "/favicon-32x32.png"],
			apple: [{ url: identity.faviconUrl || "/favicon-32x32.png" }],
		},
	};
}

export default async function RootLayout(props: { children: ReactNode }) {
	const { children } = props;
	const locale = await getServerLocale();

	return (
		<html lang={locale} className={`${GeistSans.variable} ${GeistMono.variable} min-h-dvh`} suppressHydrationWarning>
			<body className="min-h-dvh font-sans bg-background text-foreground transition-colors duration-200">
				<ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
					{children}
					<SpeedInsights />
				</ThemeProvider>
			</body>
		</html>
	);
}
