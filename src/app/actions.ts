"use server";

import { getServerAuthClient } from "@/lib/auth/server";
import * as Checkout from "@/lib/checkout";

export async function logout() {
	"use server";
	const { cookies } = await import("next/headers");
	const cookieStore = await cookies();
	cookieStore.delete("payload-token");
}

/**
 * Clear the checkout cookie after a successful order.
 * Call this after checkoutComplete succeeds.
 */
export async function clearCheckout(channel: string) {
	"use server";
	await Checkout.clearCheckoutCookie(channel);
}
