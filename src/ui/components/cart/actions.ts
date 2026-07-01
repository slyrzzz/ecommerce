"use server";

import { revalidatePath } from "next/cache";
import { getPayload } from "payload";
import configPromise from "@payload-config";

export async function deleteCartLine(cartId: string, merchandiseId: string) {
	console.time("deleteCartLine_total");
	try {
		console.time("getPayload");
		const payload = await getPayload({ config: configPromise });
		console.timeEnd("getPayload");

		console.time("findByID");
		const cart: any = await payload.findByID({ collection: "carts", id: cartId });
		console.timeEnd("findByID");
		
		if (cart && cart.lines) {
			const updatedLines = cart.lines.filter((line: any) => line.merchandiseId !== merchandiseId);
			console.time("updateCart");
			await payload.update({
				collection: "carts",
				id: cartId,
				data: { lines: updatedLines },
			});
			console.timeEnd("updateCart");
		}
	} catch (error) {
		console.error("Failed to delete cart line:", error);
	}

	console.time("revalidatePath");
	revalidatePath("/cart");
	revalidatePath("/");
	console.timeEnd("revalidatePath");
	console.timeEnd("deleteCartLine_total");
}

export async function updateCartLineQuantity(cartId: string, merchandiseId: string, quantity: number) {
	if (quantity < 1) {
		return deleteCartLine(cartId, merchandiseId);
	}

	try {
		const payload = await getPayload({ config: configPromise });
		const cart: any = await payload.findByID({ collection: "carts", id: cartId });
		
		if (cart && cart.lines) {
			const updatedLines = cart.lines.map((line: any) => {
				if (line.merchandiseId === merchandiseId) {
					return { ...line, quantity };
				}
				return line;
			});
			await payload.update({
				collection: "carts",
				id: cartId,
				data: { lines: updatedLines },
			});
		}
	} catch (error) {
		console.error("Failed to update cart line quantity:", error);
	}

	revalidatePath("/cart");
	revalidatePath("/");
}
