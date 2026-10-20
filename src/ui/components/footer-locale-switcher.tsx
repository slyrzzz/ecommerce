"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/lib/i18n/client";

export function FooterLocaleSwitcher() {
	const currentLocale = useLocale();
	const [locale, setLocale] = useState<"es" | "en">(currentLocale);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		setLocale(currentLocale);
	}, [currentLocale]);

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
