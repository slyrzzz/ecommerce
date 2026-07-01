import Link from "next/link";
import { LinkWithChannel } from "../atoms/link-with-channel";
import { CopyrightText } from "./copyright-text";
import { Logo } from "./shared/logo";
import { getCategories } from "@/lib/payload";

// Default footer links
const defaultFooterLinks = {
	support: [
		{ label: "Contact Us", href: "/contact" },
		{ label: "FAQs", href: "/faq" },
		{ label: "Shipping", href: "/shipping" },
		{ label: "Returns", href: "/returns" },
	],
	company: [
		{ label: "About", href: "/about" },
		{ label: "Sustainability", href: "/sustainability" },
		{ label: "Careers", href: "/careers" },
		{ label: "Press", href: "/press" },
	],
};

export async function Footer({ channel }: { channel: string }) {
	const categories = await getCategories();

	return (
		<footer className="bg-foreground text-background">
			{/* Extra bottom padding on mobile to account for sticky add-to-cart bar */}
			<div className="mx-auto max-w-7xl px-4 pb-24 pt-12 sm:px-6 sm:pb-12 lg:px-8 lg:py-16">
				<div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
					{/* Brand */}
					<div className="col-span-2 md:col-span-1">
						<Link href={`/${channel}`} prefetch={false} className="mb-4 inline-block">
							<Logo className="h-7 w-auto" inverted />
						</Link>
						<p className="mt-4 max-w-xs text-sm leading-relaxed text-neutral-400">
							Minimal design, maximum impact. Thoughtfully crafted essentials for everyday comfort.
						</p>
					</div>

					{/* Payload Categories */}
					<div>
						<h4 className="mb-4 text-sm font-medium text-neutral-300">Collections</h4>
						<ul className="space-y-3">
							{categories.map((category) => (
								<li key={category.id}>
									<LinkWithChannel
										href={`/categories/${category.slug}`}
										prefetch={false}
										className="text-sm text-neutral-400 transition-colors hover:text-neutral-200"
									>
										{category.name}
									</LinkWithChannel>
								</li>
							))}
						</ul>
					</div>

					{/* Static Support links */}
					<div>
						<h4 className="mb-4 text-sm font-medium text-neutral-300">Support</h4>
						<ul className="space-y-3">
							{defaultFooterLinks.support.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										prefetch={false}
										className="text-sm text-neutral-400 transition-colors hover:text-neutral-200"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>
					<div>
						<h4 className="mb-4 text-sm font-medium text-neutral-300">Company</h4>
						<ul className="space-y-3">
							{defaultFooterLinks.company.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										prefetch={false}
										className="text-sm text-neutral-400 transition-colors hover:text-neutral-200"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>

				{/* Bottom bar */}
				<div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-neutral-800 pt-8 sm:flex-row">
					<p className="text-xs text-neutral-500">
						<CopyrightText />
					</p>
					<div className="flex items-center gap-6">
						<Link
							href="/privacy"
							prefetch={false}
							className="text-xs text-neutral-500 transition-colors hover:text-neutral-300"
						>
							Privacy Policy
						</Link>
						<Link
							href="/terms"
							prefetch={false}
							className="text-xs text-neutral-500 transition-colors hover:text-neutral-300"
						>
							Terms of Service
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
