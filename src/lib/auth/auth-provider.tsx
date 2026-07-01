"use client";

import { type ReactNode } from "react";

/**
 * Auth stub — Saleor auth SDK y urql han sido eliminados.
 * Este proyecto usa Payload CMS para auth.
 * El provider simplemente renderiza sus hijos sin envolver nada.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
	return <>{children}</>;
}
