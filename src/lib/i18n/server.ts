import { cookies } from "next/headers";
import { getDictionary, type Locale } from "@/config/dictionaries";

export async function getServerDictionary() {
	try {
		const cookieStore = await cookies();
		const locale = (cookieStore.get("NEXT_LOCALE")?.value as Locale) || "es";
		return getDictionary(locale);
	} catch {
		return getDictionary("es");
	}
}

export async function getServerLocale(): Promise<Locale> {
	try {
		const cookieStore = await cookies();
		return (cookieStore.get("NEXT_LOCALE")?.value as Locale) || "es";
	} catch {
		return "es";
	}
}
