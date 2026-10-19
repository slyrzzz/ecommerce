"use client";

import { useState, useEffect } from "react";
import { getDictionary, esDictionary, type Locale } from "@/config/dictionaries";

export function useDictionary() {
	const [dict, setDict] = useState(esDictionary);

	useEffect(() => {
		try {
			const match = document.cookie.match(/(?:^|; )NEXT_LOCALE=([^;]*)/);
			const locale = match ? (decodeURIComponent(match[1]) as Locale) : "es";
			setDict(getDictionary(locale));
		} catch {
			setDict(esDictionary);
		}
	}, []);

	return dict;
}
