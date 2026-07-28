import { NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { getCurrentUser } from "@/lib/payload/auth";

export async function POST(request: Request) {
	try {
		const user = await getCurrentUser();
		if (!user) {
			return NextResponse.json({ error: "No autorizado" }, { status: 401 });
		}

		const body = await request.json();
		const { orderId } = body;

		if (!orderId) {
			return NextResponse.json({ error: "ID de orden requerido" }, { status: 400 });
		}

		const payload = await getPayload({ config: configPromise });
		const order = await payload.findByID({ collection: "orders", id: orderId });

		if (!order) {
			return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
		}

		const ownerId = typeof order.user === "object" ? order.user?.id : order.user;
		if (ownerId !== user.id) {
			return NextResponse.json({ error: "No autorizado para eliminar esta orden" }, { status: 403 });
		}

		await payload.delete({
			collection: "orders",
			id: orderId,
		});

		return NextResponse.json({ ok: true });
	} catch (err: any) {
		console.error("Error al eliminar orden:", err);
		return NextResponse.json(
			{ error: err.message || "Error al eliminar pedido" },
			{ status: 500 },
		);
	}
}

export async function DELETE(request: Request) {
	return POST(request);
}
