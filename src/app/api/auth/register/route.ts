import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password, firstName, lastName, phone, address, city } = body;

  if (!email || !password) {
    return NextResponse.json(
      { errors: [{ message: "Email and password are required", code: "REQUIRED" }] },
      { status: 400 },
    );
  }

  try {
    const payload = await getPayload({ config: configPromise });

    // Check if user already exists
    const existing = await payload.find({
      collection: "users",
      where: { email: { equals: email.toLowerCase() } },
    });
    if (existing && existing.totalDocs > 0) {
      return NextResponse.json(
        { errors: [{ message: "An account with this email already exists", code: "UNIQUE" }] },
        { status: 400 },
      );
    }

    const newUser = await payload.create({
      collection: "users",
      data: {
        email: email.toLowerCase(),
        password,
        firstName: firstName || "",
        lastName: lastName || "",
        phone: phone || "",
        address: address || "",
        city: city || "",
      },
    });

    // Log the user in immediately after registering
    const loginResult = await payload.login({
      collection: "users",
      data: {
        email: email.toLowerCase(),
        password,
      },
    });

    if (loginResult.token) {
      const cookieStore = await cookies();
      cookieStore.set("payload-token", loginResult.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    return NextResponse.json({
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
      },
      message: "Account created successfully.",
    });
  } catch (error: any) {
    console.error("Payload registration error:", error);
    return NextResponse.json(
      { errors: [{ message: error.message || "Error creating account", code: "ERROR" }] },
      { status: 400 },
    );
  }
}
