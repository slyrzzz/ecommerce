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
		const { firstName, lastName, phone, address, city } = body;

		const payload = await getPayload({ config: configPromise });
		const updatedUser = await payload.update({
			collection: "users",
			id: user.id,
			data: {
				firstName: firstName ?? user.firstName ?? "",
				lastName: lastName ?? user.lastName ?? "",
				phone: phone ?? user.phone ?? "",
				address: address ?? user.address ?? "",
				city: city ?? user.city ?? "",
			},
		});

		return NextResponse.json({ ok: true, user: updatedUser });
	} catch (err: any) {
		console.error("Error al actualizar perfil:", err);
		return NextResponse.json(
			{ error: err.message || "Error al actualizar información" },
			{ status: 500 },
		);
	}
}
