import { cookies } from "next/headers";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { localeConfig } from "@/config/locale";

export async function getIdFromCookies(channel?: string): Promise<string> {
	try {
		const cookieStore = await cookies();
		// Soporta tanto la cookie unificada 'cartId' como la cookie histórica con channel
		return (
			cookieStore.get("cartId")?.value ||
			(channel ? cookieStore.get(`checkoutId-${channel}`)?.value : "") ||
			""
		);
	} catch {
		return "";
	}
}

export async function saveIdToCookie(channel: string, checkoutId: string) {
	try {
		const shouldUseHttps =
			process.env.NEXT_PUBLIC_STOREFRONT_URL?.startsWith("https") || !!process.env.NEXT_PUBLIC_VERCEL_URL;
		const cookieStore = await cookies();
		cookieStore.set("cartId", checkoutId, {
			sameSite: "lax",
			secure: shouldUseHttps,
		});
		if (channel) {
			cookieStore.set(`checkoutId-${channel}`, checkoutId, {
				sameSite: "lax",
				secure: shouldUseHttps,
			});
		}
	} catch (err) {
		console.error("Error setting cart cookie:", err);
	}
}

export async function clearCheckoutCookie(channel?: string) {
	try {
		const cookieStore = await cookies();
		cookieStore.delete("cartId");
		if (channel) {
			cookieStore.delete(`checkoutId-${channel}`);
		}
	} catch (err) {
		console.error("Error deleting cart cookie:", err);
	}
}

export async function find(cartId: string): Promise<any | null> {
	if (!cartId) return null;

	try {
		const payload = await getPayload({ config: configPromise });
		const cart: any = await payload.findByID({ collection: "carts", id: cartId });
		if (!cart || !cart.lines || cart.lines.length === 0) {
			return null;
		}

		const currency = localeConfig.fallbackCurrency || "USD";
		let totalAmount = 0;
		const lines = [];

		for (const line of cart.lines) {
			try {
				const product: any = await payload.findByID({
					collection: "products",
					id: line.merchandiseId,
				});

				if (product) {
					const price =
						typeof product.price === "number"
							? product.price
							: product.pricing?.priceRange?.start?.gross?.amount || 0;
					const lineTotal = price * line.quantity;
					totalAmount += lineTotal;

					// Extraer imagen representativa
					const mediaItem = product.media?.[0];
					const imageUrl =
						mediaItem?.cloudinaryURL ||
						(typeof mediaItem === "object" ? mediaItem?.url : null) ||
						product.images?.[0]?.url ||
						"";

					lines.push({
						id: line.id || line.merchandiseId,
						quantity: line.quantity,
						totalPrice: {
							gross: {
								amount: lineTotal,
								currency,
							},
						},
						variant: {
							id: line.merchandiseId,
							name: line.variantName || "",
							product: {
								name: product.title || product.name || "Producto",
								slug: product.slug || "",
								category: {
									name:
										typeof product.category === "object"
											? product.category?.name || ""
											: "",
								},
								thumbnail: {
									url: imageUrl,
									alt: product.title || product.name || "",
								},
							},
						},
					});
				}
			} catch {
				// El producto pudo ser eliminado, continuar con los demás
			}
		}

		return {
			id: cart.id,
			lines,
			totalPrice: {
				gross: {
					amount: totalAmount,
					currency,
				},
			},
		};
	} catch (error) {
		console.error("Error finding cart in Payload:", error);
		return null;
	}
}
