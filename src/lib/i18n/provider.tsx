"use client";

import React, { createContext, useContext } from "react";
import type { Dictionary, Locale } from "@/config/dictionaries";
import { esDictionary } from "@/config/dictionaries/es";

interface I18nContextType {
	locale: Locale;
	dict: Dictionary;
}

const I18nContext = createContext<I18nContextType>({
	locale: "es",
	dict: esDictionary,
});

export function I18nProvider({
	locale,
	dictionary,
	children,
}: {
	locale: Locale;
	dictionary: Dictionary;
	children: React.ReactNode;
}) {
	return (
		<I18nContext.Provider value={{ locale, dict: dictionary }}>
			{children}
		</I18nContext.Provider>
	);
}

export function useI18n(): I18nContextType {
	return useContext(I18nContext);
}

export function useDictionary(): Dictionary {
	const context = useContext(I18nContext);
	return context.dict;
}

export function useLocale(): Locale {
	const context = useContext(I18nContext);
	return context.locale;
}
