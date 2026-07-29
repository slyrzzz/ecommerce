import Link from "next/link";
import { CopyrightText } from "./copyright-text";
import { Logo } from "./shared/logo";
import { getStoreIdentity, getStoreContact } from "@/lib/payload";
import {
	Instagram,
	Facebook,
	Twitter,
	MessageCircle,
	Mail,
	Phone,
	MapPin,
	Clock,
} from "lucide-react";
import { FooterLocaleSwitcher } from "./footer-locale-switcher";

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
	const storeIdentity = await getStoreIdentity();
	const storeContact = await getStoreContact();

	return (
		<footer className="bg-foreground text-background">
			{/* Extra bottom padding on mobile to account for sticky add-to-cart bar */}
			<div className="mx-auto max-w-7xl px-4 pb-24 pt-12 sm:px-6 sm:pb-12 lg:px-8 lg:py-16">
				<div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
					{/* Brand */}
					<div className="col-span-2 md:col-span-1">
						<Link href={`/${channel}`} prefetch={false} className="mb-4 inline-block">
							<Logo
								className="h-7 w-auto"
								inverted
								logoUrl={storeIdentity.logoUrl}
								logoInvertedUrl={storeIdentity.logoInvertedUrl}
								ariaLabel={storeIdentity.siteName}
							/>
						</Link>
						<p className="mt-4 max-w-xs text-sm leading-relaxed text-neutral-400">
							{storeIdentity.tagline}
						</p>

						{/* Redes Sociales dinámicas con interruptor */}
						{storeContact.socialLinks.showSocialLinks && (
							<div className="mt-6 flex items-center gap-3">
								{storeContact.socialLinks.instagram && (
									<a
										href={
											storeContact.socialLinks.instagram.startsWith("http")
												? storeContact.socialLinks.instagram
												: `https://instagram.com/${storeContact.socialLinks.instagram.replace(/^@/, "")}`
										}
										target="_blank"
										rel="noopener noreferrer"
										className="rounded-full bg-neutral-800 p-2 text-neutral-300 transition-colors hover:bg-neutral-700 hover:text-white"
										aria-label="Instagram"
									>
										<Instagram className="h-4 w-4" />
									</a>
								)}
								{storeContact.socialLinks.facebook && (
									<a
										href={storeContact.socialLinks.facebook}
										target="_blank"
										rel="noopener noreferrer"
										className="rounded-full bg-neutral-800 p-2 text-neutral-300 transition-colors hover:bg-neutral-700 hover:text-white"
										aria-label="Facebook"
									>
										<Facebook className="h-4 w-4" />
									</a>
								)}
								{storeContact.socialLinks.twitter && (
									<a
										href={
											storeContact.socialLinks.twitter.startsWith("http")
												? storeContact.socialLinks.twitter
												: `https://x.com/${storeContact.socialLinks.twitter.replace(/^@/, "")}`
										}
										target="_blank"
										rel="noopener noreferrer"
										className="rounded-full bg-neutral-800 p-2 text-neutral-300 transition-colors hover:bg-neutral-700 hover:text-white"
										aria-label="Twitter"
									>
										<Twitter className="h-4 w-4" />
									</a>
								)}
								{storeContact.socialLinks.whatsappSupport && (
									<a
										href={
											storeContact.socialLinks.whatsappSupport.startsWith("http")
												? storeContact.socialLinks.whatsappSupport
												: `https://wa.me/${storeContact.socialLinks.whatsappSupport.replace(/\D/g, "")}`
										}
										target="_blank"
										rel="noopener noreferrer"
										className="rounded-full bg-neutral-800 p-2 text-neutral-300 transition-colors hover:bg-neutral-700 hover:text-white"
										aria-label="WhatsApp Soporte"
									>
										<MessageCircle className="h-4 w-4" />
									</a>
								)}
							</div>
						)}
					</div>

					{/* Contacto y Horarios (StoreContact) */}
					<div>
						<h4 className="mb-4 text-sm font-medium text-neutral-300">Contacto</h4>
						<ul className="space-y-3 text-sm text-neutral-400">
							{storeContact.contactInfo.address && (
								<li className="flex items-start gap-2.5">
									<MapPin className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500" />
									<span>
										{storeContact.contactInfo.address}
										{storeContact.contactInfo.cityCountry && (
											<span className="block text-xs text-neutral-500">
												{storeContact.contactInfo.cityCountry}
											</span>
										)}
									</span>
								</li>
							)}
							{storeContact.contactInfo.supportPhone && (
								<li className="flex items-center gap-2.5">
									<Phone className="h-4 w-4 shrink-0 text-neutral-500" />
									<a
										href={`tel:${storeContact.contactInfo.supportPhone.replace(/[^\d+]/g, "")}`}
										className="transition-colors hover:text-neutral-200"
									>
										{storeContact.contactInfo.supportPhone}
									</a>
								</li>
							)}
							{storeContact.contactInfo.supportEmail && (
								<li className="flex items-center gap-2.5">
									<Mail className="h-4 w-4 shrink-0 text-neutral-500" />
									<a
										href={`mailto:${storeContact.contactInfo.supportEmail}`}
										className="transition-colors hover:text-neutral-200"
									>
										{storeContact.contactInfo.supportEmail}
									</a>
								</li>
							)}
							{storeContact.contactInfo.hours && (
								<li className="flex items-start gap-2.5">
									<Clock className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500" />
									<span>{storeContact.contactInfo.hours}</span>
								</li>
							)}
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
						<CopyrightText holder={storeIdentity.copyrightHolder} />
					</p>
					<div className="flex items-center gap-6">
						<FooterLocaleSwitcher />
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
