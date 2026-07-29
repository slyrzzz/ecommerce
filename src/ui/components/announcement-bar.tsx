import React from "react";
import Link from "next/link";
import { getStoreIdentity } from "@/lib/payload";

export async function AnnouncementBar() {
	const identity = await getStoreIdentity();
	const announcement = identity.announcement;

	// Si no está activo desde Payload CMS, no renderizar nada
	if (!announcement || !announcement.enabled || !announcement.text) {
		return null;
	}

	return (
		<div
			className="w-full bg-black px-4 py-2.5 text-center text-xs font-medium tracking-wide text-white sm:text-sm"
			role="region"
			aria-label="Anuncio importante"
		>
			<div className="mx-auto flex max-w-7xl items-center justify-center gap-2">
				<span>{announcement.text}</span>
				{announcement.linkUrl && (
					<Link
						href={announcement.linkUrl}
						className="inline-flex items-center font-semibold text-white underline decoration-neutral-400 underline-offset-4 transition-colors hover:decoration-white"
					>
						{announcement.linkLabel || "Ver más"}
						<span aria-hidden="true" className="ml-1">
							&rarr;
						</span>
					</Link>
				)}
			</div>
		</div>
	);
}
