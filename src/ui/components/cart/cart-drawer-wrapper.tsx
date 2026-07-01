import { cookies } from "next/headers";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { CartDrawer } from "./cart-drawer";

interface CartDrawerWrapperProps {
	channel: string;
}

export async function CartDrawerWrapper({ channel }: CartDrawerWrapperProps) {
	const cookieStore = await cookies();
	const cartId = cookieStore.get("cartId")?.value;
	let lines: any[] = [];
	let totalAmount = 0;

	if (cartId) {
		try {
			console.time("CartWrapper_getPayload");
			const payload = await getPayload({ config: configPromise });
			console.timeEnd("CartWrapper_getPayload");

			console.time("CartWrapper_fetchCart");
			const cart = await payload.findByID({ collection: "carts", id: cartId });
			console.timeEnd("CartWrapper_fetchCart");

			if (cart && cart.lines && cart.lines.length > 0) {
				const productIds = cart.lines.map((line: any) => line.merchandiseId);
				
				console.time("CartWrapper_fetchProducts");
				const productsRes = await payload.find({
					collection: "products",
					where: {
						id: {
							in: productIds,
						},
					},
					limit: 100, // adjust as needed
				});
				console.timeEnd("CartWrapper_fetchProducts");

				const productMap = new Map();
				productsRes.docs.forEach((prod) => productMap.set(prod.id, prod));

				for (const line of cart.lines) {
					const product = productMap.get(line.merchandiseId);
					if (product) {
						const price = product.pricing?.priceRange?.start?.gross?.amount || 0;
						totalAmount += price * line.quantity;
						lines.push({
							id: line.id || line.merchandiseId,
							merchandiseId: line.merchandiseId,
							quantity: line.quantity,
							product,
							totalPrice: price * line.quantity,
						});
					}
				}
			}
		} catch (error) {
			console.error("CartDrawerWrapper error:", error);
		}
	}

	return (
		<CartDrawer
			cartId={cartId || null}
			lines={lines}
			totalPrice={totalAmount}
			channel={channel}
		/>
	);
}
