"use client";

import { useState, useEffect } from "react";
import { getDictionary, esDictionary, type Dictionary, type Locale } from "@/config/dictionaries";

export function useDictionary(): Dictionary {
	const [dict, setDict] = useState<Dictionary>(esDictionary);

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
