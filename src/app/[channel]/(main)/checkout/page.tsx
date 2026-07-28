import { cookies } from "next/headers";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { CheckoutForm } from "./CheckoutForm";
import { localeConfig } from "@/config/locale";
import { getCurrentUser } from "@/lib/payload/auth";

export default async function CheckoutPage() {
	const cookieStore = await cookies();
	const cartId = cookieStore.get("cartId")?.value;
	const user = await getCurrentUser();
	
	const cartData = {
		totalPrice: 0,
		currency: localeConfig.fallbackCurrency,
		lines: [] as any[],
	};

	if (cartId) {
		try {
			const payload = await getPayload({ config: configPromise });
			const cart = await payload.findByID({ collection: "carts", id: cartId });
			
			if (cart && cart.lines) {
				for (const line of cart.lines) {
					try {
						const product = await payload.findByID({ collection: "products", id: line.merchandiseId });
						if (product) {
							const price =
								typeof product.price === "number"
									? product.price
									: product.pricing?.priceRange?.start?.gross?.amount || 0;
							cartData.totalPrice += price * line.quantity;
							cartData.lines.push({
								productName: product.title || product.name || "Producto",
								quantity: line.quantity,
								price: price,
								merchandiseId: line.merchandiseId,
							});
						}
					} catch {
						// product not found
					}
				}
			}
		} catch {
			// cart not found
		}
	}

	return (
		<section className="mx-auto max-w-7xl p-8 pb-16">
			<h1 className="text-3xl font-bold mb-8">Checkout</h1>
			<CheckoutForm cartData={cartData} currentUser={user} />
		</section>
	);
}
