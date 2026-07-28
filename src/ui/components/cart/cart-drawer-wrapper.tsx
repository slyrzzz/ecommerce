import { cookies } from "next/headers";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { CartDrawer, type CartSettings } from "./cart-drawer";

interface CartDrawerWrapperProps {
	channel: string;
}

export async function CartDrawerWrapper({ channel }: CartDrawerWrapperProps) {
	const cookieStore = await cookies();
	const cartId = cookieStore.get("cartId")?.value;
	let lines: any[] = [];
	let totalAmount = 0;

	let cartSettings: CartSettings = {
		showFreeShippingBar: true,
		freeShippingThreshold: 100,
		showCartFooterMessages: true,
		freeDeliveryText: "Free delivery over",
		returnsText: "30-day returns",
	};

	try {
		const payload = await getPayload({ config: configPromise });

		// 1. Obtener la configuración global del carrito en "Manejo de Tienda" -> "Opciones de Carrito"
		try {
			const globalConfig = await payload.findGlobal({
				slug: "store-management" as any,
			}).catch(() => null);

			if (globalConfig) {
				const fs = (globalConfig as any).freeShipping;
				const fm = (globalConfig as any).footerMessages;
				cartSettings = {
					showFreeShippingBar: fs?.enabled ?? true,
					freeShippingThreshold: typeof fs?.thresholdAmount === "number" ? fs.thresholdAmount : 100,
					showCartFooterMessages: fm?.enabled ?? true,
					freeDeliveryText: fm?.freeDeliveryText || "Free delivery over",
					returnsText: fm?.returnsText || "30-day returns",
				};
			}
		} catch (gErr) {
			console.error("CartDrawerWrapper store-management config error:", gErr);
		}

		// 2. Obtener el carrito y sus productos si hay un cartId
		if (cartId) {
			const cart = await payload.findByID({ collection: "carts", id: cartId }).catch(() => null);

			if (cart && cart.lines && cart.lines.length > 0) {
				const productIds = cart.lines.map((line: any) => line.merchandiseId);

				const productsRes = await payload.find({
					collection: "products",
					where: {
						id: {
							in: productIds,
						},
					},
					limit: 100,
				});

				const productMap = new Map();
				productsRes.docs.forEach((prod) => productMap.set(prod.id, prod));

				for (const line of cart.lines) {
					const product = productMap.get(line.merchandiseId);
					if (product) {
						const price =
							typeof product.price === "number"
								? product.price
								: product.pricing?.priceRange?.start?.gross?.amount || 0;
						totalAmount += price * line.quantity;
						const normalizedProduct = {
							...product,
							name: product.title || product.name || "Producto",
							slug: product.slug || "",
							media: product.media || (product.thumbnail ? [product.thumbnail] : []),
						};
						lines.push({
							id: line.id || line.merchandiseId,
							merchandiseId: line.merchandiseId,
							quantity: line.quantity,
							product: normalizedProduct,
							totalPrice: price * line.quantity,
						});
					}
				}
			}
		}
	} catch (error) {
		console.error("CartDrawerWrapper error:", error);
	}

	return (
		<CartDrawer
			cartId={cartId || null}
			lines={lines}
			totalPrice={totalAmount}
			channel={channel}
			settings={cartSettings}
		/>
	);
}
