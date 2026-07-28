import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { errors: [{ message: "Email and password are required", code: "REQUIRED" }] },
      { status: 400 },
    );
  }

  try {
    const payload = await getPayload({ config: configPromise });
    const result = await payload.login({
      collection: "users",
      data: {
        email: email.toLowerCase(),
        password,
      },
    });

    if (!result.token) {
      return NextResponse.json(
        { errors: [{ message: "Invalid email or password", code: "INVALID" }] },
        { status: 401 },
      );
    }

    const cookieStore = await cookies();
    cookieStore.set("payload-token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({
      user: {
        id: result.user.id,
        email: result.user.email,
        firstName: (result.user as any).firstName || "",
        lastName: (result.user as any).lastName || "",
      },
      token: result.token,
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { errors: [{ message: "Invalid email or password. Please try again.", code: "INVALID" }] },
      { status: 401 },
    );
  }
}
