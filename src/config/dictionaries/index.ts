import { esDictionary, type Dictionary } from "./es";
import { enDictionary } from "./en";

export type Locale = "es" | "en";

export function getDictionary(locale: Locale): Dictionary {
	return locale === "en" ? enDictionary : esDictionary;
}

export { esDictionary, enDictionary };
