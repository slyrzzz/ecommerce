"use server";

import { revalidatePath } from "next/cache";
import { getPayload } from "payload";
import configPromise from "@payload-config";

type deleteLineFromCheckoutArgs = {
	lineId: string;
	checkoutId: string;
};

export const deleteLineFromCheckout = async ({ lineId, checkoutId }: deleteLineFromCheckoutArgs) => {
	try {
		const payload = await getPayload({ config: configPromise });
		
		const cart = await payload.findByID({
			collection: "carts",
			id: checkoutId,
		});

		if (cart && cart.lines) {
			// Asumimos que lineId corresponde al ID interno que Payload asigna a cada elemento del array (o comparamos con merchandiseId como fallback)
			const updatedLines = cart.lines.filter((line: any) => line.id !== lineId && line.merchandiseId !== lineId);
			
			await payload.update({
				collection: "carts",
				id: checkoutId,
				data: {
					lines: updatedLines,
				},
			});
		}
	} catch (error) {
		console.error("Error deleting line from cart in Payload:", error);
	}

	revalidatePath("/cart");
};
