import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { getCurrentUser } from "@/lib/payload/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customer, lines, totalPrice, currency = "USD", status = "saved" } = body;

    if (!lines || lines.length === 0) {
      return NextResponse.json(
        { errors: [{ message: "Cannot save an empty order" }] },
        { status: 400 },
      );
    }

    const user = await getCurrentUser();
    const payload = await getPayload({ config: configPromise });

    // Generate readable Order Number
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;

    const orderData: any = {
      orderNumber,
      status,
      customer: {
        firstName: customer?.firstName || user?.firstName || "Cliente",
        lastName: customer?.lastName || user?.lastName || "",
        phone: customer?.phone || user?.phone || "",
        address: customer?.address || user?.address || "",
        city: customer?.city || user?.city || "",
      },
      lines: lines.map((l: any) => ({
        productName: l.productName || l.title || "Producto",
        quantity: Number(l.quantity) || 1,
        price: Number(l.price) || 0,
        merchandiseId: l.merchandiseId || "",
      })),
      totalPrice: Number(totalPrice) || 0,
      currency,
    };

    if (user && user.id) {
      orderData.user = user.id;
    }

    const savedOrder = await payload.create({
      collection: "orders",
      data: orderData,
    });

    return NextResponse.json({
      success: true,
      order: savedOrder,
      message: "Orden guardada correctamente en Pedidos no completados.",
    });
  } catch (error: any) {
    console.error("Save order error:", error);
    return NextResponse.json(
      { errors: [{ message: error.message || "No se pudo guardar la orden" }] },
      { status: 500 },
    );
  }
}
