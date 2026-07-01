import { cookies } from "next/headers";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { CartButton } from "@/ui/components/cart";

export const CartNavItem = async ({ channel }: { channel: string }) => {
	const cookieStore = await cookies();
	const cartId = cookieStore.get("cartId")?.value;
	let lineCount = 0;

	if (cartId) {
		try {
			const payload = await getPayload({ config: configPromise });
			const cart = await payload.findByID({ collection: "carts", id: cartId });
			if (cart && cart.lines) {
				lineCount = cart.lines.reduce((result, line) => result + line.quantity, 0);
			}
		} catch {
			// cart not found or error
		}
	}

	return <CartButton itemCount={lineCount} />;
};
