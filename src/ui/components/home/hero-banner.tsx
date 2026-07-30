import React from "react";
import Link from "next/link";
import { getStoreIdentity } from "@/lib/payload";

export async function HeroBanner() {
	const identity = await getStoreIdentity();
	const hero = identity.hero;

	// Si está desactivado o no existe, no renderizar para no dejar espacios vacíos
	if (!hero || !hero.enabled) {
		return null;
	}

	const hasBgImage = Boolean(hero.backgroundImageUrl);

	const OPACITY_CLASSES: Record<string, string> = {
		"0": "opacity-0",
		"20": "opacity-20",
		"40": "opacity-40",
		"50": "opacity-50",
		"60": "opacity-60",
		"80": "opacity-80",
	};
	const overlayClass = OPACITY_CLASSES[hero.overlayOpacity || "50"] || "opacity-50";

	return (
		<div className="relative mb-12 overflow-hidden rounded-2xl border border-border bg-black text-white shadow-xl">
			{/* Imagen de fondo */}
			{hasBgImage && (
				<div
					className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 hover:scale-105"
					style={{ backgroundImage: `url(${hero.backgroundImageUrl})` }}
					aria-hidden="true"
				/>
			)}

			{/* Capa de oscuridad personalizable (Overlay Opacity) controlada desde Payload CMS */}
			<div className={`absolute inset-0 bg-black ${overlayClass} transition-opacity duration-300`} />

			{/* Gradiente lateral suave para legibilidad del texto sin tapar la foto a la derecha */}
			<div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />

			{/* Contenedor alineado a la izquierda (mr-auto) y más compacto para dejar lucir la foto */}
			<div className="relative z-10 mr-auto max-w-2xl px-6 py-12 sm:px-10 sm:py-16 lg:py-20">
				{hero.badge && (
					<p className="mb-3 inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-widest text-neutral-200 uppercase backdrop-blur-sm">
						{hero.badge}
					</p>
				)}

				{/* Titular de tamaño mediano y elegante (text-2xl -> lg:text-4xl) */}
				<h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
					{hero.title}
				</h1>

				{hero.description && (
					<p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-200 sm:text-base">
						{hero.description}
					</p>
				)}

				{hero.ctaText && (
					<div className="mt-6 flex flex-wrap items-center gap-4">
						<Link
							href={hero.ctaLink || "/products"}
							className="inline-flex h-10 items-center justify-center rounded-lg bg-white px-5 text-sm font-semibold text-black shadow-sm transition-all hover:bg-neutral-100 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-white/50"
						>
							{hero.ctaText}
						</Link>
					</div>
				)}
			</div>
		</div>
	);
}
