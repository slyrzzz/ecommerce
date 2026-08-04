import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";

export async function POST(request: NextRequest) {
	const body = await request.json();
	const { email, channel, redirectUrl } = body;

	if (!email || !channel) {
		return NextResponse.json(
			{ errors: [{ message: "Por favor ingresa un correo electrónico", code: "REQUIRED" }] },
			{ status: 400 },
		);
	}

	try {
		const payload = await getPayload({ config: configPromise });

		const users = await payload.find({
			collection: "users",
			where: { email: { equals: email.toLowerCase() } },
		});

		if (users && users.totalDocs > 0) {
			const token = await payload.forgotPassword({
				collection: "users",
				data: {
					email: email.toLowerCase(),
				},
				disableEmail: true,
			});

			let baseUrl = request.nextUrl.origin;
			try {
				if (redirectUrl && redirectUrl.startsWith("http")) {
					baseUrl = new URL(redirectUrl).origin;
				}
			} catch {
				// fallback to request origin
			}

			const resetUrl = `${baseUrl}/${channel}/login?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`;
			console.log(`[PASSWORD RESET] Enlace generado para ${email}: ${resetUrl}`);

			return NextResponse.json({
				success: true,
				token,
				resetUrl,
			});
		}

		// Always return success to prevent email enumeration
		return NextResponse.json({ success: true });
	} catch (error: any) {
		console.error("Password reset error:", error);
		return NextResponse.json(
			{ errors: [{ message: "No se pudo procesar la solicitud. Intenta de nuevo.", code: "ERROR" }] },
			{ status: 500 },
		);
	}
}
