import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getPayload } from "payload";
import configPromise from "@payload-config";

export async function POST(request: NextRequest) {
	const body = await request.json();
	const { token, password } = body;

	if (!token || !password) {
		return NextResponse.json(
			{ errors: [{ message: "El token y la contraseña son requeridos", code: "REQUIRED" }] },
			{ status: 400 },
		);
	}

	if (password.length < 8) {
		return NextResponse.json(
			{ errors: [{ message: "La contraseña debe tener al menos 8 caracteres", code: "PASSWORD_TOO_SHORT" }] },
			{ status: 400 },
		);
	}

	try {
		const payload = await getPayload({ config: configPromise });

		const result = await payload.resetPassword({
			collection: "users",
			data: {
				token,
				password,
			},
			overrideAccess: true,
		});

		if (result.token) {
			const cookieStore = await cookies();
			cookieStore.set("payload-token", result.token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				path: "/",
				sameSite: "lax",
				maxAge: 60 * 60 * 24 * 7, // 7 days
			});

			return NextResponse.json({
				success: true,
				token: result.token,
				message: "Contraseña actualizada exitosamente",
			});
		}

		return NextResponse.json(
			{ errors: [{ message: "No se pudo restablecer la contraseña", code: "UNKNOWN" }] },
			{ status: 500 },
		);
	} catch (err: any) {
		console.error("Set password error:", err);
		return NextResponse.json(
			{
				errors: [
					{
						message: "El enlace para restablecer la contraseña ha expirado o es inválido.",
						code: "INVALID_TOKEN",
					},
				],
			},
			{ status: 400 },
		);
	}
}
