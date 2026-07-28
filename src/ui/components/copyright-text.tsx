"use client";

import { getCopyrightText } from "@/config/brand";

/** Client component for copyright text (needs current year) */
export function CopyrightText({ holder }: { holder?: string } = {}) {
	return <>{getCopyrightText(undefined, holder)}</>;
}
