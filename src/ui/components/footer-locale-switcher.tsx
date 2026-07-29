"use client";

import { useEffect, useState } from "react";

export function FooterLocaleSwitcher() {
	const [locale, setLocale] = useState<"es" | "en">("es");
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		// 1. Verificar si hay cookie o localStorage con preferencia guardada
		const saved = localStorage.getItem("NEXT_LOCALE") as "es" | "en" | null;
		if (saved === "es" || saved === "en") {
			setLocale(saved);
			return;
		}

		// 2. Si es primera visita, detectar idioma del navegador
		const browserLang = navigator.language || "es";
		const detected = browserLang.toLowerCase().startsWith("en") ? "en" : "es";
		setLocale(detected);
		localStorage.setItem("NEXT_LOCALE", detected);
		document.cookie = `NEXT_LOCALE=${detected}; path=/; max-age=31536000; SameSite=Lax`;
	}, []);

	const handleLocaleChange = (newLocale: "es" | "en") => {
		if (newLocale === locale) return;
		setLocale(newLocale);
		localStorage.setItem("NEXT_LOCALE", newLocale);
		document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
		// Recargar la página para aplicar el idioma inmediatamente
		window.location.reload();
	};

	if (!mounted) {
		return (
			<div className="flex items-center gap-1.5 text-xs text-neutral-500">
				<span className="text-neutral-300 font-medium">ES</span>
				<span>/</span>
				<span>EN</span>
			</div>
		);
	}

	return (
		<div
			className="flex items-center gap-1.5 text-xs text-neutral-500 select-none"
			title="Cambiar idioma / Change language"
		>
			<button
				type="button"
				onClick={() => handleLocaleChange("es")}
				className={`transition-colors cursor-pointer ${
					locale === "es"
						? "text-neutral-200 font-semibold underline underline-offset-4"
						: "text-neutral-500 hover:text-neutral-300"
				}`}
			>
				ES
			</button>
			<span className="text-neutral-700">/</span>
			<button
				type="button"
				onClick={() => handleLocaleChange("en")}
				className={`transition-colors cursor-pointer ${
					locale === "en"
						? "text-neutral-200 font-semibold underline underline-offset-4"
						: "text-neutral-500 hover:text-neutral-300"
				}`}
			>
				EN
			</button>
		</div>
	);
}
