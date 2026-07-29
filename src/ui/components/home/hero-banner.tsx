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

	return (
		<div className="relative mb-12 overflow-hidden rounded-2xl border border-border bg-slate-900 text-white shadow-xl dark:bg-slate-950">
			{/* Imagen de fondo opcional con capa de contraste oscuro */}
			{hasBgImage && (
				<div
					className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 transition-transform duration-700 hover:scale-105"
					style={{ backgroundImage: `url(${hero.backgroundImageUrl})` }}
					aria-hidden="true"
				/>
			)}

			{/* Gradiente sutil para garantizar legibilidad óptima en todos los dispositivos */}
			<div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/60 to-transparent" />

			{/* Contenedor principal del Hero */}
			<div className="relative z-10 mx-auto max-w-4xl px-6 py-14 sm:px-12 sm:py-20 lg:py-24">
				{hero.badge && (
					<p className="mb-3 inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-widest text-slate-300 uppercase backdrop-blur-sm">
						{hero.badge}
					</p>
				)}

				<h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
					{hero.title}
				</h1>

				{hero.description && (
					<p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
						{hero.description}
					</p>
				)}

				{hero.ctaText && (
					<div className="mt-8 flex flex-wrap items-center gap-4">
						<Link
							href={hero.ctaLink || "/products"}
							className="inline-flex h-11 items-center justify-center rounded-lg bg-white px-6 font-semibold text-slate-900 shadow-sm transition-all hover:bg-slate-100 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-white/50"
						>
							{hero.ctaText}
						</Link>
					</div>
				)}
			</div>
		</div>
	);
}
